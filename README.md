# Trust IT — Enterprise IT Solutions Platform

Production full-stack platform for **Trust IT** ("Technology You Can Trust" · 12+ Years of Experience in IT Solutions, Dhaka, Bangladesh).

## Architecture Overview

- **Frontend (`/src`)**: React 19 + TypeScript + Tailwind CSS v4 + React Router + Recharts (lazy-loaded strictly for `/admin`).
- **Backend (`/backend`)**: Separated Express REST API, Mongoose schemas & models, JWT + bcrypt HTTP-only cookie authentication, RBAC (`SUPER_ADMIN`, `ADMIN`), Zod validation, Helmet, CORS, rate limiting, and Cloudinary media/resume upload service.
- **Database**: MongoDB via Mongoose (`MONGODB_URI`). Includes a persistent local JSON store adapter (`/backend/data/store.json`) when `MONGODB_URI` is not yet configured in local preview.
- **Media Storage**: Cloudinary (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) organized into `trust-it/*` folders, with automatic local `/public/uploads/` fallback during local development.

## Key Routes

### Public Website
- `/` — Homepage (Hero, Trust Counters, Client Logos, Why 12+ Years Matters, Services, Solutions, Interactive 01–07 Process, Architecture Advisor, Industries, Interactive Tech Stack, Projects, Case Studies, Testimonials, Team, Blog, FAQ, CTA)
- `/about`, `/services`, `/services/:slug`, `/solutions`, `/solutions/:slug`, `/industries`, `/industries/:slug`
- `/projects`, `/projects/:slug`, `/case-studies`, `/case-studies/:slug`
- `/technologies`, `/team`, `/careers`, `/careers/:slug`, `/blog`, `/blog/:slug`
- `/contact`, `/faq`, `/testimonials`, `/pricing`, `/search?q=...`
- `/privacy-policy`, `/terms-and-conditions`, `/cookie-policy`, `/sitemap`
- `/sitemap.xml`, `/robots.txt`

### Admin CMS Portal (`/admin`)
- Protected by JWT HTTP-only cookies and role-based middleware.
- On a fresh database with zero admin accounts, visiting `/admin/login` presents a secure one-time Super Admin initialization form.
- Manage Services, Solutions, Industries, Projects, Case Studies, Blog Posts, Categories, Team, Testimonials, FAQs, Careers, Job Applications, Contact Leads, and Website Settings.

## Deployment

1. Copy `.env.example` to `.env` and configure `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`, and `ADMIN_SEED_*`.
2. Build frontend: `npm run build`
3. Start production server: `npm run start`
