import { Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest, requireAdminAuth, requireRole } from '../middleware/auth.ts';
import { AppError, imageUpload } from '../middleware/security.ts';
import { CloudinaryFolder, deleteAsset, replaceAsset, uploadAsset } from '../services/cloudinary.ts';
import { repos } from '../services/repository.ts';

const router = Router();

router.use(requireAdminAuth);

// GET /api/admin/dashboard - Aggregated CMS & lead metrics
router.get('/dashboard', requireRole('SUPER_ADMIN', 'ADMIN'), async (_req, res, next) => {
  try {
    const [
      totalProjects,
      totalServices,
      totalSolutions,
      totalIndustries,
      totalCaseStudies,
      totalBlogPosts,
      totalTeamMembers,
      totalContactMessages,
      newContactMessages,
      totalJobApplications,
      totalTestimonials,
      totalCareers,
      recentMessagesRes,
      recentAppsRes,
      allMessagesRes,
      allAppsRes,
    ] = await Promise.all([
      repos.projects.count(),
      repos.services.count(),
      repos.solutions.count(),
      repos.industries.count(),
      repos.caseStudies.count(),
      repos.blogPosts.count(),
      repos.teamMembers.count(),
      repos.contactMessages.count(),
      repos.contactMessages.count({ status: 'NEW' }),
      repos.jobApplications.count(),
      repos.testimonials.count(),
      repos.careers.count({ status: 'OPEN' }),
      repos.contactMessages.findAll({ sort: { createdAt: -1 }, limit: 5 }),
      repos.jobApplications.findAll({ sort: { createdAt: -1 }, limit: 5 }),
      repos.contactMessages.findAll({ limit: 200 }),
      repos.jobApplications.findAll({ limit: 200 }),
    ]);

    const contentDistribution = [
      { name: 'Services', count: totalServices },
      { name: 'Solutions', count: totalSolutions },
      { name: 'Industries', count: totalIndustries },
      { name: 'Projects', count: totalProjects },
      { name: 'Case Studies', count: totalCaseStudies },
      { name: 'Blog Posts', count: totalBlogPosts },
    ];

    const leadStatusBreakdown = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED'].map((status) => ({
      status,
      count: allMessagesRes.items.filter((m: any) => m.status === status).length,
    }));

    const applicationBreakdown = ['NEW', 'REVIEWING', 'SHORTLISTED', 'REJECTED'].map((status) => ({
      status,
      count: allAppsRes.items.filter((a: any) => a.status === status).length,
    }));

    res.json({
      counts: {
        totalProjects,
        totalServices,
        totalSolutions,
        totalIndustries,
        totalCaseStudies,
        totalBlogPosts,
        totalTeamMembers,
        totalContactMessages,
        newContactMessages,
        totalJobApplications,
        totalTestimonials,
        totalCareers,
      },
      charts: {
        contentDistribution,
        leadStatusBreakdown,
        applicationBreakdown,
      },
      recentMessages: recentMessagesRes.items,
      recentApplications: recentAppsRes.items,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/upload - Upload or replace image via Cloudinary
router.post(
  '/upload',
  requireRole('SUPER_ADMIN', 'ADMIN'),
  imageUpload.single('file'),
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      if (!req.file) {
        throw new AppError('No image file uploaded', 400);
      }
      const allowedFolders: CloudinaryFolder[] = [
        'trust-it',
        'trust-it/projects',
        'trust-it/team',
        'trust-it/blog',
        'trust-it/services',
        'trust-it/services/web-development',
        'trust-it/services/digital-marketing',
        'trust-it/services/seo',
        'trust-it/services/design',
        'trust-it/careers',
        'trust-it/settings',
      ];
      const requestedFolder = String(req.body.folder || 'trust-it') as CloudinaryFolder;
      const folder = allowedFolders.includes(requestedFolder) ? requestedFolder : 'trust-it';
      const alt = String(req.body.alt || '');
      const replacePublicId = req.body.replacePublicId ? String(req.body.replacePublicId) : undefined;

      const asset = replacePublicId
        ? await replaceAsset(
            replacePublicId,
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            folder,
            alt
          )
        : await uploadAsset(req.file.buffer, req.file.originalname, req.file.mimetype, folder, alt);

      res.status(201).json({ asset });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/admin/asset - Remove Cloudinary asset
router.delete('/asset', requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res, next) => {
  try {
    const publicId = String(req.body?.public_id || '');
    if (!publicId) throw new AppError('public_id is required', 400);
    await deleteAsset(publicId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Admin user management (SUPER_ADMIN only)
router.get('/users', requireRole('SUPER_ADMIN'), async (_req, res, next) => {
  try {
    const result = await repos.admins.findAll({ sort: { createdAt: -1 } });
    res.json({
      items: result.items.map((a: any) => ({
        _id: a._id,
        name: a.name,
        email: a.email,
        role: a.role,
        isActive: a.isActive,
        lastLoginAt: a.lastLoginAt,
        createdAt: a.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.post('/users', requireRole('SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || String(password).length < 8) {
      throw new AppError('Name, valid email, and password (min 8 chars) are required', 400);
    }
    const existing = await repos.admins.findOne({ email: String(email).toLowerCase() });
    if (existing) throw new AppError('An admin with this email already exists', 409);

    const passwordHash = await bcrypt.hash(String(password), 12);
    const created = await repos.admins.create({
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      passwordHash,
      role: role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN',
      isActive: true,
    });
    res.status(201).json({
      item: {
        _id: created._id,
        name: created.name,
        email: created.email,
        role: created.role,
        isActive: created.isActive,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/users/:id', requireRole('SUPER_ADMIN'), async (req: AuthenticatedRequest, res, next) => {
  try {
    if (req.params.id === req.admin!.sub) {
      throw new AppError('You cannot delete your own active account', 400);
    }
    const ok = await repos.admins.deleteById(req.params.id);
    if (!ok) throw new AppError('Admin user not found', 404);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
