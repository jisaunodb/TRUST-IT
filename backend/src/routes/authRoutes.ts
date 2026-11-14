import { Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import {
  ADMIN_COOKIE_NAME,
  AuthenticatedRequest,
  requireAdminAuth,
  signAdminToken,
} from '../middleware/auth.ts';
import { AppError, authRateLimiter } from '../middleware/security.ts';
import { env } from '../config/env.ts';
import { repos } from '../services/repository.ts';
import { loginSchema, setupAdminSchema } from '../validators/schemas.ts';

const router = Router();

function setAuthCookie(res: Response, token: string): void {
  const isProd = env.nodeEnv === 'production';
  res.cookie(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

// GET /api/auth/setup-status - Check if initial Super Admin needs setup
router.get('/setup-status', async (_req, res, next) => {
  try {
    const count = await repos.admins.count();
    res.json({ needsSetup: count === 0 });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/setup-admin - First-time Super Admin creation (only allowed when 0 admins exist)
router.post('/setup-admin', authRateLimiter, async (req, res, next) => {
  try {
    const count = await repos.admins.count();
    if (count > 0) {
      throw new AppError('Administrator account already initialized. Please sign in.', 403);
    }

    const parsed = setupAdminSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(parsed.password, 12);
    const created = await repos.admins.create({
      name: parsed.name,
      email: parsed.email.toLowerCase(),
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
      lastLoginAt: new Date().toISOString(),
    });

    const token = signAdminToken({
      sub: String(created._id),
      email: created.email,
      name: created.name,
      role: created.role,
    });

    setAuthCookie(res, token);
    res.status(201).json({
      token,
      admin: {
        _id: created._id,
        name: created.name,
        email: created.email,
        role: created.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', authRateLimiter, async (req, res, next) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const admin = await repos.admins.findOne({ email: parsed.email.toLowerCase() });
    if (!admin || !admin.isActive) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(parsed.password, admin.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    await repos.admins.updateById(String(admin._id), { lastLoginAt: new Date().toISOString() });

    const token = signAdminToken({
      sub: String(admin._id),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    setAuthCookie(res, token);
    res.json({
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        avatar: admin.avatar,
        lastLoginAt: admin.lastLoginAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post('/logout', (_req, res) => {
  const isProd = env.nodeEnv === 'production';
  res.clearCookie(ADMIN_COOKIE_NAME, {
    path: '/',
    sameSite: 'lax',
    secure: isProd,
  });
  res.json({ success: true });
});

// GET /api/auth/me
router.get('/me', requireAdminAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const admin = await repos.admins.findById(req.admin!.sub);
    if (!admin) {
      throw new AppError('Admin not found', 404);
    }
    res.json({
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        avatar: admin.avatar,
        lastLoginAt: admin.lastLoginAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/profile - Update current admin profile or password
router.put('/profile', requireAdminAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const admin = await repos.admins.findById(req.admin!.sub);
    if (!admin) throw new AppError('Account not found', 404);

    const updates: Record<string, any> = {};
    if (name && String(name).trim().length >= 2) {
      updates.name = String(name).trim();
    }

    if (newPassword) {
      if (!currentPassword) {
        throw new AppError('Current password is required to set a new password', 400);
      }
      const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!valid) {
        throw new AppError('Current password is incorrect', 401);
      }
      if (String(newPassword).length < 8) {
        throw new AppError('New password must be at least 8 characters', 400);
      }
      updates.passwordHash = await bcrypt.hash(String(newPassword), 12);
    }

    const updated = await repos.admins.updateById(String(admin._id), updates);
    res.json({
      admin: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        avatar: updated.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
