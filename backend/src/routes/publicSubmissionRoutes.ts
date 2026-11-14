import { Request, Response, Router } from 'express';
import { requireAdminAuth, requireRole } from '../middleware/auth.ts';
import { AppError, publicSubmitRateLimiter, resumeUpload } from '../middleware/security.ts';
import { uploadAsset } from '../services/cloudinary.ts';
import { repos } from '../services/repository.ts';
import { contactSchema, jobApplicationSchema, newsletterSchema } from '../validators/schemas.ts';

export const contactRouter = Router();

// Public contact form submission
contactRouter.post('/', publicSubmitRateLimiter, async (req: Request, res: Response, next) => {
  try {
    const parsed = contactSchema.parse(req.body);
    const created = await repos.contactMessages.create({
      ...parsed,
      status: 'NEW',
    });
    res.status(201).json({
      message: 'Thank you for contacting Trust IT. Our solutions team will respond within 1 business day.',
      id: created._id,
    });
  } catch (err) {
    next(err);
  }
});

// Admin lead management
contactRouter.get('/', requireAdminAuth, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    const status = String(req.query.status || '').trim();
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 25);

    const filter: Record<string, any> = {};
    if (status && status !== 'ALL') filter.status = status;
    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } },
        { company: { $regex: escaped, $options: 'i' } },
        { service: { $regex: escaped, $options: 'i' } },
      ];
    }

    const result = await repos.contactMessages.findAll({ filter, sort: { createdAt: -1 }, page, limit });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

contactRouter.patch('/:id', requireAdminAuth, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res, next) => {
  try {
    const allowedStatuses = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED'];
    const updates: Record<string, any> = {};
    if (req.body.status && allowedStatuses.includes(req.body.status)) {
      updates.status = req.body.status;
    }
    if (typeof req.body.notes === 'string') {
      updates.notes = req.body.notes;
    }
    const updated = await repos.contactMessages.updateById(req.params.id, updates);
    if (!updated) throw new AppError('Contact message not found', 404);
    res.json({ item: updated });
  } catch (err) {
    next(err);
  }
});

contactRouter.delete('/:id', requireAdminAuth, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res, next) => {
  try {
    const ok = await repos.contactMessages.deleteById(req.params.id);
    if (!ok) throw new AppError('Contact message not found', 404);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export const applicationsRouter = Router();

// Public job application submission with resume upload
applicationsRouter.post(
  '/',
  publicSubmitRateLimiter,
  resumeUpload.single('resume'),
  async (req: Request, res: Response, next) => {
    try {
      if (!req.file) {
        throw new AppError('Please upload your resume (PDF, DOC, or DOCX)', 400);
      }
      const parsed = jobApplicationSchema.parse(req.body);
      const career =
        (await repos.careers.findById(parsed.careerId)) ||
        (await repos.careers.findOne({ slug: parsed.careerId }));
      if (!career || career.status !== 'OPEN') {
        throw new AppError('This position is no longer accepting applications', 404);
      }

      const uploadedResume = await uploadAsset(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        'trust-it/careers',
        `${parsed.name} Resume`
      );

      const created = await repos.jobApplications.create({
        careerId: String(career._id),
        careerTitle: career.title,
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        linkedin: parsed.linkedin,
        portfolio: parsed.portfolio,
        coverLetter: parsed.coverLetter,
        resume: uploadedResume,
        status: 'NEW',
      });

      res.status(201).json({
        message: 'Application received. Our talent team will review your profile and reach out shortly.',
        id: created._id,
      });
    } catch (err) {
      next(err);
    }
  }
);

applicationsRouter.get('/', requireAdminAuth, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    const status = String(req.query.status || '').trim();
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 25);

    const filter: Record<string, any> = {};
    if (status && status !== 'ALL') filter.status = status;
    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } },
        { careerTitle: { $regex: escaped, $options: 'i' } },
      ];
    }

    const result = await repos.jobApplications.findAll({ filter, sort: { createdAt: -1 }, page, limit });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

applicationsRouter.patch('/:id', requireAdminAuth, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res, next) => {
  try {
    const allowedStatuses = ['NEW', 'REVIEWING', 'SHORTLISTED', 'REJECTED'];
    if (!allowedStatuses.includes(req.body.status)) {
      throw new AppError('Invalid application status', 400);
    }
    const updated = await repos.jobApplications.updateById(req.params.id, { status: req.body.status });
    if (!updated) throw new AppError('Application not found', 404);
    res.json({ item: updated });
  } catch (err) {
    next(err);
  }
});

applicationsRouter.delete('/:id', requireAdminAuth, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res, next) => {
  try {
    const ok = await repos.jobApplications.deleteById(req.params.id);
    if (!ok) throw new AppError('Application not found', 404);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export const newsletterRouter = Router();

newsletterRouter.post('/', publicSubmitRateLimiter, async (req, res, next) => {
  try {
    const parsed = newsletterSchema.parse(req.body);
    const existing = await repos.newsletterSubscribers.findOne({ email: parsed.email.toLowerCase() });
    if (existing) {
      res.json({ message: 'You are already subscribed to Trust IT insights.' });
      return;
    }
    await repos.newsletterSubscribers.create({ email: parsed.email.toLowerCase() });
    res.status(201).json({ message: 'Subscribed successfully to Trust IT engineering updates.' });
  } catch (err) {
    next(err);
  }
});
