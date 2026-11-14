import { Router } from 'express';
import authRoutes from './authRoutes.ts';
import adminRoutes from './adminRoutes.ts';
import { createCrudRouter } from './crudFactory.ts';
import { applicationsRouter, contactRouter, newsletterRouter } from './publicSubmissionRoutes.ts';
import { isMongoConnected } from '../config/db.ts';
import { requireAdminAuth, requireRole } from '../middleware/auth.ts';
import { repos } from '../services/repository.ts';

const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Trust IT API',
    database: isMongoConnected() ? 'mongodb' : 'local-json',
  });
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/admin', adminRoutes);

apiRouter.use(
  '/service-categories',
  createCrudRouter({
    collection: 'serviceCategories',
    searchFields: ['name', 'description', 'filterGroup'],
    publishField: 'published',
    publishedValue: true,
    defaultSort: { order: 1, createdAt: 1 },
    slugSourceField: 'name',
    extraFilterFields: ['filterGroup'],
  })
);

apiRouter.use(
  '/services',
  createCrudRouter({
    collection: 'services',
    searchFields: ['title', 'category', 'filterGroup', 'shortDescription', 'description'],
    publishField: 'status',
    publishedValue: 'PUBLISHED',
    defaultSort: { order: 1, createdAt: -1 },
    extraFilterFields: ['filterGroup'],
  })
);

apiRouter.use(
  '/solutions',
  createCrudRouter({
    collection: 'solutions',
    searchFields: ['title', 'tagline', 'shortDescription'],
    publishField: 'published',
    publishedValue: true,
    defaultSort: { order: 1, createdAt: -1 },
  })
);

apiRouter.use(
  '/industries',
  createCrudRouter({
    collection: 'industries',
    searchFields: ['title', 'shortDescription', 'overview'],
    publishField: 'published',
    publishedValue: true,
    defaultSort: { order: 1, createdAt: -1 },
  })
);

apiRouter.use(
  '/projects',
  createCrudRouter({
    collection: 'projects',
    searchFields: ['title', 'client', 'industry', 'category', 'shortDescription'],
    publishField: 'published',
    publishedValue: true,
    defaultSort: { featured: -1, createdAt: -1 },
  })
);

apiRouter.use(
  '/case-studies',
  createCrudRouter({
    collection: 'caseStudies',
    searchFields: ['title', 'client', 'industry', 'summary'],
    publishField: 'published',
    publishedValue: true,
    defaultSort: { featured: -1, createdAt: -1 },
  })
);

apiRouter.use(
  '/blog',
  createCrudRouter({
    collection: 'blogPosts',
    searchFields: ['title', 'excerpt', 'content', 'category', 'author'],
    publishField: 'status',
    publishedValue: 'PUBLISHED',
    defaultSort: { publishedAt: -1, createdAt: -1 },
  })
);

apiRouter.use(
  '/categories',
  createCrudRouter({
    collection: 'categories',
    searchFields: ['name', 'description'],
    defaultSort: { name: 1 },
    slugSourceField: 'name',
  })
);

apiRouter.use(
  '/team',
  createCrudRouter({
    collection: 'teamMembers',
    searchFields: ['name', 'position', 'department', 'bio'],
    publishField: 'published',
    publishedValue: true,
    defaultSort: { order: 1, createdAt: -1 },
    slugSourceField: 'name',
  })
);

apiRouter.use(
  '/testimonials',
  createCrudRouter({
    collection: 'testimonials',
    searchFields: ['clientName', 'company', 'quote', 'industry'],
    publishField: 'published',
    publishedValue: true,
    defaultSort: { featured: -1, createdAt: -1 },
    hasSlug: false,
  })
);

apiRouter.use(
  '/faqs',
  createCrudRouter({
    collection: 'faqs',
    searchFields: ['question', 'answer', 'category'],
    publishField: 'published',
    publishedValue: true,
    defaultSort: { order: 1, createdAt: -1 },
    hasSlug: false,
  })
);

apiRouter.use(
  '/careers',
  createCrudRouter({
    collection: 'careers',
    searchFields: ['title', 'department', 'location', 'summary'],
    publishField: 'status',
    publishedValue: 'OPEN',
    defaultSort: { publishedAt: -1 },
  })
);

apiRouter.use('/applications', applicationsRouter);
apiRouter.use('/contact', contactRouter);
apiRouter.use('/newsletter', newsletterRouter);

apiRouter.get('/settings', async (_req, res, next) => {
  try {
    const result = await repos.websiteSettings.findAll({ limit: 1 });
    res.json({ item: result.items[0] || null });
  } catch (err) {
    next(err);
  }
});

apiRouter.put('/settings', requireAdminAuth, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res, next) => {
  try {
    const result = await repos.websiteSettings.findAll({ limit: 1 });
    const existing = result.items[0];
    const updates = { ...req.body };
    delete updates._id;
    const item = existing
      ? await repos.websiteSettings.updateById(String(existing._id), updates)
      : await repos.websiteSettings.create(updates);
    res.json({ item });
  } catch (err) {
    next(err);
  }
});

apiRouter.get('/search', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) {
      res.json({ services: [], solutions: [], projects: [], caseStudies: [], blogs: [] });
      return;
    }
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = { $regex: escaped, $options: 'i' };

    const [services, solutions, projects, caseStudies, blogs] = await Promise.all([
      repos.services.findAll({
        filter: { status: 'PUBLISHED', $or: [{ title: regex }, { category: regex }, { shortDescription: regex }] },
        limit: 12,
      }),
      repos.solutions.findAll({
        filter: { published: true, $or: [{ title: regex }, { shortDescription: regex }] },
        limit: 12,
      }),
      repos.projects.findAll({
        filter: { published: true, $or: [{ title: regex }, { client: regex }, { industry: regex }, { shortDescription: regex }] },
        limit: 12,
      }),
      repos.caseStudies.findAll({
        filter: { published: true, $or: [{ title: regex }, { client: regex }, { summary: regex }] },
        limit: 12,
      }),
      repos.blogPosts.findAll({
        filter: { status: 'PUBLISHED', $or: [{ title: regex }, { excerpt: regex }, { category: regex }] },
        limit: 12,
      }),
    ]);

    res.json({
      services: services.items,
      solutions: solutions.items,
      projects: projects.items,
      caseStudies: caseStudies.items,
      blogs: blogs.items,
    });
  } catch (err) {
    next(err);
  }
});

apiRouter.use((_req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

export default apiRouter;
