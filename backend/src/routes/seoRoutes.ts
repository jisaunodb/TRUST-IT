import { Request, Response, Router } from 'express';
import { repos } from '../services/repository.ts';

const router = Router();

function getBaseUrl(req: Request): string {
  const host = req.get('host') || 'localhost:3000';
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  return process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL'
    ? process.env.APP_URL.replace(/\/$/, '')
    : `${proto}://${host}`;
}

router.get('/robots.txt', (req: Request, res: Response) => {
  const baseUrl = getBaseUrl(req);
  res.type('text/plain').send(
    `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${baseUrl}/sitemap.xml\n`
  );
});

router.get('/sitemap.xml', async (req: Request, res: Response, next) => {
  try {
    const baseUrl = getBaseUrl(req);
    const staticPaths = [
      '',
      '/about',
      '/services',
      '/solutions',
      '/industries',
      '/projects',
      '/case-studies',
      '/technologies',
      '/team',
      '/careers',
      '/blog',
      '/contact',
      '/faq',
      '/testimonials',
      '/pricing',
      '/privacy-policy',
      '/terms-and-conditions',
      '/cookie-policy',
      '/sitemap',
    ];

    const [services, solutions, industries, projects, caseStudies, blogs, careers] = await Promise.all([
      repos.services.findAll({ filter: { status: 'PUBLISHED' }, limit: 100 }),
      repos.solutions.findAll({ filter: { published: true }, limit: 100 }),
      repos.industries.findAll({ filter: { published: true }, limit: 100 }),
      repos.projects.findAll({ filter: { published: true }, limit: 100 }),
      repos.caseStudies.findAll({ filter: { published: true }, limit: 100 }),
      repos.blogPosts.findAll({ filter: { status: 'PUBLISHED' }, limit: 200 }),
      repos.careers.findAll({ filter: { status: 'OPEN' }, limit: 100 }),
    ]);

    const urls: { loc: string; priority: string; changefreq: string }[] = [
      ...staticPaths.map((p) => ({
        loc: `${baseUrl}${p}`,
        priority: p === '' ? '1.0' : '0.8',
        changefreq: p === '' || p === '/blog' ? 'weekly' : 'monthly',
      })),
      ...services.items.map((s: any) => ({ loc: `${baseUrl}/services/${s.slug}`, priority: '0.9', changefreq: 'monthly' })),
      ...solutions.items.map((s: any) => ({ loc: `${baseUrl}/solutions/${s.slug}`, priority: '0.8', changefreq: 'monthly' })),
      ...industries.items.map((i: any) => ({ loc: `${baseUrl}/industries/${i.slug}`, priority: '0.8', changefreq: 'monthly' })),
      ...projects.items.map((p: any) => ({ loc: `${baseUrl}/projects/${p.slug}`, priority: '0.7', changefreq: 'monthly' })),
      ...caseStudies.items.map((c: any) => ({ loc: `${baseUrl}/case-studies/${c.slug}`, priority: '0.8', changefreq: 'monthly' })),
      ...blogs.items.map((b: any) => ({ loc: `${baseUrl}/blog/${b.slug}`, priority: '0.7', changefreq: 'weekly' })),
      ...careers.items.map((j: any) => ({ loc: `${baseUrl}/careers/${j.slug}`, priority: '0.7', changefreq: 'weekly' })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map(
        (u) =>
          `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
      )
      .join('\n')}\n</urlset>`;

    res.type('application/xml').send(xml);
  } catch (err) {
    next(err);
  }
});

export default router;
