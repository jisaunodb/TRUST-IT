import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.ts';
import { repos } from '../services/repository.ts';
import { AdminRole } from '../types/entities.ts';

export interface AuthPayload {
  sub: string;
  email: string;
  name: string;
  role: AdminRole;
}

export interface AuthenticatedRequest extends Request {
  admin?: AuthPayload;
}

export const ADMIN_COOKIE_NAME = 'trustit_admin_token';

export function signAdminToken(payload: AuthPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAdminToken(token: string): AuthPayload {
  return jwt.verify(token, env.jwtSecret) as AuthPayload;
}

export async function requireAdminAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const cookieToken = req.cookies?.[ADMIN_COOKIE_NAME];
    const header = req.headers.authorization;
    const bearerToken = header?.startsWith('Bearer ') ? header.slice(7).trim() : undefined;
    const token = cookieToken || bearerToken;

    if (!token) {
      res.status(401).json({ error: 'Authentication required. Please sign in.' });
      return;
    }

    const decoded = verifyAdminToken(token);
    const admin = await repos.admins.findById(decoded.sub);
    if (!admin || !admin.isActive) {
      res.clearCookie(ADMIN_COOKIE_NAME);
      res.status(401).json({ error: 'Session invalid or account deactivated.' });
      return;
    }

    if (admin.role !== 'SUPER_ADMIN' && admin.role !== 'ADMIN') {
      res.status(403).json({ error: 'Insufficient permissions.' });
      return;
    }

    req.admin = {
      sub: String(admin._id),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };
    next();
  } catch {
    res.clearCookie(ADMIN_COOKIE_NAME);
    res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }
}

export function requireRole(...allowedRoles: AdminRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }
    if (!allowedRoles.includes(req.admin.role)) {
      res.status(403).json({ error: 'Forbidden: insufficient administrative role.' });
      return;
    }
    next();
  };
}
