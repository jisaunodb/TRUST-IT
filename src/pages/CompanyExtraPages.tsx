import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { CtaSection, ErrorBanner, PageBanner, SkeletonGrid } from '../components/common/PagePrimitives';
import { SafeImage } from '../components/common/SafeImage';
import { useSeo } from '../hooks/useSeo';
import { api } from '../services/api';
import { FAQItem, PaginatedResponse, TeamMemberItem, TestimonialItem } from '../types';

const fullTechStack = [
  {
    category: 'Frontend Engineering',
    items: [
      { name: 'HTML5', desc: 'Semantic, accessible web markup' },
      { name: 'CSS3', desc: 'Modern grid, flex & responsive layout' },
      { name: 'JavaScript', desc: 'ES2024 browser & runtime scripting' },
      { name: 'TypeScript', desc: 'Strict type-safe enterprise interfaces' },
      { name: 'React', desc: 'Modular component UI architecture' },
      { name: 'Next.js', desc: 'SSR, App Router & SEO optimization' },
      { name: 'Vue', desc: 'Progressive interactive portals' },
      { name: 'Tailwind CSS', desc: 'Consistent token-driven styling' },
    ],
  },
  {
    category: 'Backend & APIs',
    items: [
      { name: 'Node.js', desc: 'High-concurrency API runtime' },
      { name: 'Express.js', desc: 'RESTful API & security middleware' },
      { name: 'TypeScript APIs', desc: 'Schema-validated REST & service backends' },
      { name: 'Laravel', desc: 'Structured MVC business applications' },
    ],
  },
  {
    category: 'Databases & Storage',
    items: [
      { name: 'MongoDB', desc: 'Flexible, horizontally scalable NoSQL' },
      { name: 'PostgreSQL', desc: 'ACID-compliant financial & ERP ledgers' },
      { name: 'MySQL', desc: 'Proven relational web workloads' },
      { name: 'Mongoose & Indexing', desc: 'Type-safe modeling, aggregation & tuning' },
    ],
  },
  {
    category: 'Cloud Infrastructure',
    items: [
      { name: 'AWS', desc: 'ECS, EC2, RDS, S3 & CloudFront' },
      { name: 'Google Cloud', desc: 'Cloud Run, GKE & BigQuery' },
      { name: 'Cloudflare', desc: 'Edge DNS, SSL, WAF & global CDN routing' },
      { name: 'Cloudinary', desc: 'Automated image/video CDN & optimization' },
    ],
  },
  {
    category: 'DevOps & Infrastructure',
    items: [
      { name: 'Docker', desc: 'Consistent containerized deployments' },
      { name: 'GitHub Actions', desc: 'Automated CI testing & release pipelines' },
      { name: 'CI/CD', desc: 'Zero-downtime blue/green rollouts' },
      { name: 'Linux', desc: 'Hardened Ubuntu & Debian production servers' },
    ],
  },
  {
    category: 'Mobile Engineering',
    items: [
      { name: 'React Native', desc: 'Unified iOS & Android engineering' },
      { name: 'Android & iOS Native APIs', desc: 'Biometrics, GPS, push notifications & offline sync' },
      { name: 'Expo & Store CI', desc: 'Streamlined Play Store & App Store release pipelines' },
    ],
  },
];

export function TechnologiesPage() {
  useSeo({
    title: 'Technologies & Engineering Stack — Next.js, Node.js, MongoDB, AWS | Trust IT',
    description:
      'Explore Trust IT’s core technology stack across frontend, backend, databases, cloud, DevOps, and mobile development.',
    canonicalPath: '/technologies',
  });

  return (
    <div>
      <PageBanner
        eyebrow="Engineering Stack"
        title="Technologies We Master in Production"
        description="We standardize on proven, well-supported open-source and cloud technologies—never chasing short-lived frameworks that leave clients stranded."
        breadcrumbs={[{ label: 'Technologies' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {fullTechStack.map((group) => (
            <div key={group.category} className="space-y-5">
              <h2 className="text-2xl font-bold text-slate-950 border-b border-slate-200 pb-3">
                {group.category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {group.items.map((tech) => (
                  <div key={tech.name} className="bg-white border border-slate-200 rounded-xl p-5">
                    <h3 className="text-base font-bold text-slate-950">{tech.name}</h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{tech.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaSection />
    </div>
  );
}

export function TeamPage() {
  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSeo({
    title: 'Leadership & Engineering Team — 50+ Professionals | Trust IT',
    description:
      'Meet the principal architects, engineering leads, cloud specialists, and product designers driving Trust IT in Dhaka, Bangladesh.',
    canonicalPath: '/team',
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedResponse<TeamMemberItem>>('/team?limit=50');
      setMembers(res.items);
    } catch (err: any) {
      setError(err.message || 'Unable to load team members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <PageBanner
        eyebrow="50+ In-House Specialists"
        title="Meet the People Behind Trust IT"
        description="Senior architects, full-stack engineers, security specialists, and UI/UX designers working collaboratively from our Dhaka headquarters."
        breadcrumbs={[{ label: 'Team' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <SkeletonGrid count={6} />
          ) : error ? (
            <ErrorBanner message={error} onRetry={load} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((m) => (
                <div key={m._id} className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
                  <div className="aspect-square bg-slate-200">
                    <SafeImage src={m.image?.secure_url} alt={m.image?.alt || m.name} />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        {m.department} · {m.experienceYears}+ Years Exp.
                      </p>
                      <h2 className="text-xl font-bold text-slate-950">{m.name}</h2>
                      <p className="text-xs font-semibold text-blue-700 mt-0.5">{m.position}</p>
                      <p className="mt-3 text-sm text-slate-600 leading-relaxed">{m.bio}</p>
                    </div>
                    <p className="pt-3 border-t border-slate-100 text-xs text-slate-500">
                      {m.skills.join(' · ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaSection />
    </div>
  );
}

export function TestimonialsPage() {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSeo({
    title: 'Client Testimonials & Verified Outcomes | Trust IT Bangladesh',
    description:
      'Read verified outcomes and client feedback from 300+ businesses served by Trust IT across finance, retail, healthcare, and education.',
    canonicalPath: '/testimonials',
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedResponse<TestimonialItem>>('/testimonials?limit=50');
      setItems(res.items);
    } catch (err: any) {
      setError(err.message || 'Unable to load testimonials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <PageBanner
        eyebrow="300+ Satisfied Organizations"
        title="Client Partnerships Built on Delivery"
        description="Real outcomes reported by operations directors, CTOs, and founders who trusted us with mission-critical platforms."
        breadcrumbs={[{ label: 'Testimonials' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <SkeletonGrid count={6} />
          ) : error ? (
            <ErrorBanner message={error} onRetry={load} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((t) => (
                <div key={t._id} className="bg-white border border-slate-200 rounded-xl p-7 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-mono font-semibold text-blue-700 tabular-nums mb-3">
                      {t.outcomeMetric}
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <p className="text-sm font-bold text-slate-950">{t.clientName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t.role} · {t.company} · {t.industry}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaSection />
    </div>
  );
}

export function FaqPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [category, setCategory] = useState('All');

  useSeo({
    title: 'Frequently Asked Questions — Process, Pricing & Security | Trust IT',
    description:
      'Answers to common questions about custom software development, pricing models, local payment integrations, source ownership, and SLAs.',
    canonicalPath: '/faq',
    schema:
      faqs.length > 0
        ? {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          }
        : undefined,
  });

  useEffect(() => {
    api
      .get<PaginatedResponse<FAQItem>>('/faqs?limit=50')
      .then((res) => {
        setFaqs(res.items);
        if (res.items[0]) setOpenId(res.items[0]._id);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(faqs.map((f) => f.category)))];
  const filtered = category === 'All' ? faqs : faqs.filter((f) => f.category === category);

  return (
    <div>
      <PageBanner
        eyebrow="Knowledge Base"
        title="Frequently Asked Questions"
        description="Everything leadership teams ask before starting a web, custom software, or cloud partnership with Trust IT."
        breadcrumbs={[{ label: 'FAQ' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg cursor-pointer ${
                  category === c ? 'bg-slate-950 text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <SkeletonGrid count={4} cols={2} />
          ) : (
            <div className="space-y-3">
              {filtered.map((faq) => {
                const open = openId === faq._id;
                return (
                  <div key={faq._id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : faq._id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="text-base font-semibold text-slate-950">{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 ${open ? 'rotate-180' : ''}`} />
                    </button>
                    {open && (
                      <div className="px-6 pb-5 pt-3 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <CtaSection />
    </div>
  );
}

export function PricingPage() {
  useSeo({
    title: 'Engagement Models & Software Pricing | Trust IT Bangladesh',
    description:
      'Transparent engagement models for startups, growing SMEs, and enterprises: Fixed-Scope Milestone builds, Dedicated Squads, and Managed Cloud SLAs.',
    canonicalPath: '/pricing',
  });

  const tiers = [
    {
      name: 'Growth Web & Brand Launch',
      audience: 'For Growing Businesses & Startups',
      price: 'From ৳180,000',
      cadence: 'Fixed Milestone · 5–7 Weeks',
      desc: 'High-speed Next.js corporate or e-commerce website engineered for technical SEO and lead conversion.',
      limits: [
        'Custom responsive UI/UX design',
        'CMS dashboard + Cloudinary media pipeline',
        'Technical SEO, Schema.org & Core Web Vitals 90+',
        'SSLCommerz / bKash checkout (if e-commerce)',
        '60 days post-launch warranty support',
      ],
      featured: false,
    },
    {
      name: 'Custom Software & ERP Build',
      audience: 'For Mid-Market & Multi-Branch Operations',
      price: 'From ৳550,000',
      cadence: 'Phased Milestones · 10–16 Weeks',
      desc: 'Bespoke web, mobile, or ERP architecture built around your operational rules, roles, and local APIs.',
      limits: [
        'Full architecture discovery & database modeling',
        'Role-based access control & audit trail logging',
        'Automated testing & OWASP security review',
        '100% source code & cloud ownership',
        'Staff training & 90 days stabilization SLA',
      ],
      featured: true,
    },
    {
      name: 'Dedicated Engineering Squad',
      audience: 'For Enterprises & Funded Product Teams',
      price: 'Custom Monthly Retainer',
      cadence: 'Monthly Sprint Cadence · Flexible Scale',
      desc: 'Full-time Dhaka product squad (Tech Lead, Full-Stack Engineers, UI/UX & QA) integrated into your roadmap.',
      limits: [
        '2–6 dedicated senior & mid-level engineers',
        'Weekly sprint demos & Jira/Linear transparency',
        'Dedicated DevOps & 24/7 cloud monitoring',
        'Direct Slack/Teams communication with engineers',
        'Quarterly architecture & security audits',
      ],
      featured: false,
    },
  ];

  return (
    <div>
      <PageBanner
        eyebrow="Transparent Engagement Models"
        title="Flexible Pricing Matched to Your Scope"
        description="Whether launching a flagship web presence or modernizing multi-branch enterprise software, every budget is tied to clear deliverables."
        breadcrumbs={[{ label: 'Pricing' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl p-8 flex flex-col justify-between border ${
                tier.featured
                  ? 'bg-slate-950 text-white border-slate-950'
                  : 'bg-white text-slate-900 border-slate-200'
              }`}
            >
              <div>
                <p className={`text-xs font-semibold mb-2 ${tier.featured ? 'text-sky-400' : 'text-blue-700'}`}>
                  {tier.audience}
                </p>
                <h2 className="text-2xl font-bold tracking-tight">{tier.name}</h2>
                <p className="text-2xl font-extrabold mt-4 tabular-nums">{tier.price}</p>
                <p className={`text-xs mt-1 ${tier.featured ? 'text-slate-400' : 'text-slate-500'}`}>
                  {tier.cadence}
                </p>
                <p className={`mt-4 text-sm leading-relaxed ${tier.featured ? 'text-slate-300' : 'text-slate-600'}`}>
                  {tier.desc}
                </p>
                <ul className="mt-6 pt-6 border-t border-slate-200/20 space-y-3 text-sm">
                  {tier.limits.map((l) => (
                    <li key={l} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${tier.featured ? 'text-sky-400' : 'text-blue-700'}`}
                      />
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={`/contact?service=${encodeURIComponent(tier.name)}`}
                className={`mt-8 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg transition-colors ${
                  tier.featured
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'bg-slate-950 text-white hover:bg-slate-800'
                }`}
              >
                Request Itemized Estimate
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
