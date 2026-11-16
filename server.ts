import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { connectDatabase } from './backend/src/config/db.ts';
import { env } from './backend/src/config/env.ts';
import { apiRateLimiter, errorHandler, sanitizeRequest } from './backend/src/middleware/security.ts';
import apiRouter from './backend/src/routes/index.ts';
import seoRouter from './backend/src/routes/seoRoutes.ts';
import { runSeedIfEmpty } from './backend/src/seed/seedData.ts';

function getAllowedOrigins(): string[] {
  const configured = [env.frontendUrl, process.env.APP_URL]
    .filter((v): v is string => Boolean(v && v !== 'MY_APP_URL'))
    .flatMap((v) => v.split(','))
    .map((u) => u.trim().replace(/\/+$/, ''))
    .filter(Boolean);
  return Array.from(
    new Set([...configured, 'https://trust-it.onrender.com', 'http://localhost:3000'])
  );
}

function isAllowedOrigin(origin: string | undefined, allowedOrigins: string[]): boolean {
  if (!origin) return true;
  const normalized = origin.replace(/\/+$/, '');
  if (allowedOrigins.includes(normalized)) return true;
  if (env.nodeEnv !== 'production') {
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalized)) return true;
    if (/^https:\/\/[a-z0-9-]+\.run\.app$/i.test(normalized)) return true;
  }
  return false;
}

async function bootstrap() {
  const dbReadyPromise = connectDatabase()
    .then(() => runSeedIfEmpty())
    .catch((err) => {
      console.error('[Trust IT] Database initialization warning:', err);
    });

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

  const allowedOrigins = getAllowedOrigins();
  app.use(
    cors({
      origin: (origin, callback) => {
        callback(null, isAllowedOrigin(origin, allowedOrigins));
      },
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

  // Ensure DB & seed finish before serving dynamic API or sitemap data (keep /api/health instant)
  app.use(async (req, _res, next) => {
    if (req.path === '/sitemap.xml' || (req.path.startsWith('/api/') && req.path !== '/api/health')) {
      await dbReadyPromise;
    }
    next();
  });

  // SEO XML Sitemap & Robots.txt
  app.use('/', seoRouter);

  // REST API
  app.use('/api', apiRateLimiter, apiRouter);

  // Centralized API error handler
  app.use('/api', errorHandler);

  if (env.nodeEnv !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

function startKeepAlive(): void {
  if (env.nodeEnv !== 'production') return;
  const targetUrl =
    process.env.KEEP_ALIVE_URL?.trim() ||
    (process.env.RENDER ? 'https://trust-it.onrender.com/api/health' : '');
  if (!targetUrl) return;

  const TEN_MINUTES_MS = 10 * 60 * 1000;
  const timer = setInterval(async () => {
    try {
      await fetch(targetUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(10000),
      });
    } catch {
      // Ignore transient network errors during keep-alive checks
    }
  }, TEN_MINUTES_MS);

  timer.unref();
  console.log(`[Trust IT] Keep-alive monitor active every 10m -> ${targetUrl}`);
}

  app.listen(env.port, '0.0.0.0', () => {
    console.log(`[Trust IT] Server running at http://0.0.0.0:${env.port} (${env.nodeEnv})`);
    startKeepAlive();
  });
}

bootstrap().catch((err) => {
  console.error('[Trust IT] Fatal startup error:', err);
  process.exit(1);
});
