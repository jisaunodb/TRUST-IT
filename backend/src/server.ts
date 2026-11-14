import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { connectDatabase } from './config/db.ts';
import { env } from './config/env.ts';
import { apiRateLimiter, errorHandler, sanitizeRequest } from './middleware/security.ts';
import apiRouter from './routes/index.ts';
import seoRouter from './routes/seoRoutes.ts';
import { runSeedIfEmpty } from './seed/seedData.ts';

function parseAllowedOrigins(): string[] {
  const raw = env.frontendUrl || '';
  const list = raw
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter(Boolean);
  if (env.nodeEnv !== 'production') {
    list.push('http://localhost:3000', 'http://localhost:5173');
  }
  return Array.from(new Set(list));
}

async function bootstrap() {
  await connectDatabase();
  await runSeedIfEmpty();

  const app = express();
  app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  const allowedOrigins = parseAllowedOrigins();
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const clean = origin.replace(/\/+$/, '');
        if (allowedOrigins.includes(clean) || allowedOrigins.includes('*')) {
          return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
      },
      credentials: true,
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(sanitizeRequest);

  app.use('/uploads', express.static(path.resolve(process.cwd(), 'public', 'uploads')));

  app.get('/', (_req, res) => {
    res.json({
      service: 'Trust IT API Server',
      status: 'ok',
      health: '/api/health',
    });
  });

  app.use('/', seoRouter);
  app.use('/api', apiRateLimiter, apiRouter);
  app.use('/api', errorHandler);

  app.listen(env.port, '0.0.0.0', () => {
    console.log(`[Trust IT API] Running on port ${env.port} (${env.nodeEnv})`);
  });
}

bootstrap().catch((err) => {
  console.error('[Trust IT API] Fatal startup error:', err);
  process.exit(1);
});
