import { Request, Response, Router } from 'express';
import { AuthenticatedRequest, requireAdminAuth, requireRole, verifyAdminToken, ADMIN_COOKIE_NAME } from '../middleware/auth.ts';
import { AppError } from '../middleware/security.ts';
import { CollectionName, repos } from '../services/repository.ts';
import { slugify } from '../validators/schemas.ts';

interface CrudOptions {
  collection: CollectionName;
  searchFields?: string[];
  publishField?: 'published' | 'status';
  publishedValue?: unknown;
  defaultSort?: Record<string, 1 | -1>;
  hasSlug?: boolean;
  slugSourceField?: string;
  extraFilterFields?: string[];
}

function isAdminRequest(req: Request): boolean {
  try {
    const cookieToken = req.cookies?.[ADMIN_COOKIE_NAME];
    const header = req.headers.authorization;
    const bearer = header?.startsWith('Bearer ') ? header.slice(7).trim() : undefined;
    const token = cookieToken || bearer;
    if (!token) return false;
    const decoded = verifyAdminToken(token);
    return decoded.role === 'SUPER_ADMIN' || decoded.role === 'ADMIN';
  } catch {
    return false;
  }
}

export function createCrudRouter(options: CrudOptions): Router {
  const router = Router();
  const repo = repos[options.collection];
  const {
    searchFields = ['title', 'name', 'shortDescription'],
    publishField,
    publishedValue = true,
    defaultSort = { order: 1, createdAt: -1 },
    hasSlug = true,
    slugSourceField = 'title',
    extraFilterFields = [],
  } = options;

  router.get('/', async (req: Request, res: Response, next) => {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 50);
      const q = String(req.query.q || '').trim();
      const category = String(req.query.category || '').trim();
      const industry = String(req.query.industry || '').trim();
      const technology = String(req.query.technology || '').trim();
      const status = String(req.query.status || '').trim();
      const featured = req.query.featured;
      const includeDrafts = req.query.includeDrafts === 'true' && isAdminRequest(req);

      const filter: Record<string, any> = {};

      if (publishField && !includeDrafts) {
        filter[publishField] = publishedValue;
      } else if (status && includeDrafts) {
        filter.status = status;
      }

      if (category && category !== 'All') filter.category = category;
      if (industry && industry !== 'All') filter.industry = industry;
      if (technology && technology !== 'All') filter.technologies = technology;
      if (featured === 'true') filter.featured = true;
      if (req.query.isFeatured === 'true') filter.isFeatured = true;
      if (req.query.type) filter.type = String(req.query.type);

      for (const field of extraFilterFields) {
        const val = req.query[field];
        if (val && val !== 'All') filter[field] = String(val);
      }

      if (q) {
        const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.$or = searchFields.map((field) => ({
          [field]: { $regex: escaped, $options: 'i' },
        }));
      }

      const result = await repo.findAll({ filter, sort: defaultSort, page, limit });
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get('/:idOrSlug', async (req: Request, res: Response, next) => {
    try {
      const { idOrSlug } = req.params;
      const includeDrafts = isAdminRequest(req);

      let item = hasSlug ? await repo.findOne({ slug: idOrSlug }) : null;
      if (!item) {
        item = await repo.findById(idOrSlug);
      }
      if (!item) {
        throw new AppError('Requested item was not found', 404);
      }

      if (publishField && !includeDrafts && item[publishField] !== publishedValue) {
        throw new AppError('Requested item is not published', 404);
      }

      res.json({ item });
    } catch (err) {
      next(err);
    }
  });

  router.post(
    '/',
    requireAdminAuth,
    requireRole('SUPER_ADMIN', 'ADMIN'),
    async (req: AuthenticatedRequest, res: Response, next) => {
      try {
        const payload = { ...req.body };
        if (hasSlug) {
          const base = payload.slug || payload[slugSourceField] || `item-${Date.now()}`;
          payload.slug = slugify(base);
          const existing = await repo.findOne({ slug: payload.slug });
          if (existing) {
            payload.slug = `${payload.slug}-${Date.now().toString().slice(-4)}`;
          }
        }
        const created = await repo.create(payload);
        res.status(201).json({ item: created });
      } catch (err) {
        next(err);
      }
    }
  );

  const updateHandler = async (req: AuthenticatedRequest, res: Response, next: any) => {
    try {
      const { id } = req.params;
      const updates = { ...req.body };
      delete updates._id;
      if (hasSlug && updates.slug) {
        updates.slug = slugify(updates.slug);
      }
      const updated = await repo.updateById(id, updates);
      if (!updated) {
        throw new AppError('Record not found', 404);
      }
      res.json({ item: updated });
    } catch (err) {
      next(err);
    }
  };

  router.put('/:id', requireAdminAuth, requireRole('SUPER_ADMIN', 'ADMIN'), updateHandler);
  router.patch('/:id', requireAdminAuth, requireRole('SUPER_ADMIN', 'ADMIN'), updateHandler);

  router.delete(
    '/:id',
    requireAdminAuth,
    requireRole('SUPER_ADMIN', 'ADMIN'),
    async (req: AuthenticatedRequest, res: Response, next) => {
      try {
        const deleted = await repo.deleteById(req.params.id);
        if (!deleted) {
          throw new AppError('Record not found', 404);
        }
        res.json({ success: true });
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
}
