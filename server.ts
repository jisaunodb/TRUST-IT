import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { createServer as createViteServer } from 'vite';
import { connectDatabase } from './backend/src/config/db.ts';
import { env } from './backend/src/config/env.ts';
import { apiRateLimiter, errorHandler, sanitizeRequest } from './backend/src/middleware/security.ts';
import apiRouter from './backend/src/routes/index.ts';
import seoRouter from './backend/src/routes/seoRoutes.ts';
import { runSeedIfEmpty } from './backend/src/seed/seedData.ts';

async function bootstrap() {
  await connectDatabase();
  await runSeedIfEmpty();

  const app = express();
  app.set('trust proxy', 1);

  // Security middleware (frameAncestors relaxed only for AI Studio preview iframe compatibility)
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      frameguard: false,
    })
  );

  app.use(
    cors({
      origin: [env.frontendUrl, 'http://localhost:3000'],
      credentials: true,
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(sanitizeRequest);

  // Static uploaded media & generated assets
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'public', 'uploads')));
  app.use('/src/assets/images', express.static(path.resolve(process.cwd(), 'src', 'assets', 'images')));

  // SEO XML Sitemap & Robots.txt
  app.use('/', seoRouter);

  // REST API
  app.use('/api', apiRateLimiter, apiRouter);

  // Centralized API error handler
  app.use('/api', errorHandler);

  if (env.nodeEnv !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(env.port, '0.0.0.0', () => {
    console.log(`[Trust IT] Server running at http://0.0.0.0:${env.port} (${env.nodeEnv})`);
  });
}

bootstrap().catch((err) => {
  console.error('[Trust IT] Fatal startup error:', err);
  process.exit(1);
});
