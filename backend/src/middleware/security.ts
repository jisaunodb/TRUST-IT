import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import multer from 'multer';

// Strip MongoDB operator keys ($gt, $where, etc.) and script injection vectors recursively
function sanitizeValue(val: unknown): unknown {
  if (typeof val === 'string') {
    return val.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeValue);
  }
  if (val && typeof val === 'object') {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      if (k.startsWith('$') || k.includes('.')) continue;
      clean[k] = sanitizeValue(v);
    }
    return clean;
  }
  return val;
}

export function sanitizeRequest(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    for (const key of Object.keys(req.query)) {
      if (key.startsWith('$')) {
        delete req.query[key];
      }
    }
  }
  next();
}

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again in 15 minutes.' },
});

export const publicSubmitRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Submission limit reached. Please wait a few minutes and try again.' },
});

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image format. Allowed: JPEG, PNG, WebP, AVIF, SVG.'));
    }
  },
});

export const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid resume format. Please upload PDF, DOC, or DOCX (max 8MB).'));
    }
  },
});

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  const statusCode = err.statusCode || (err.name === 'ZodError' ? 400 : err.code === 11000 ? 409 : 500);
  if (err.name === 'ZodError') {
    res.status(400).json({
      error: 'Validation failed',
      details: err.issues?.map((i: any) => `${i.path.join('.')}: ${i.message}`) || [],
    });
    return;
  }
  if (err.message?.includes('File too large')) {
    res.status(413).json({ error: 'Uploaded file exceeds the maximum allowed size.' });
    return;
  }
  const message = statusCode >= 500 ? 'An internal server error occurred.' : err.message || 'Request failed';
  if (statusCode >= 500) {
    console.error('[API Error]', err);
  }
  res.status(statusCode).json({ error: message });
}
