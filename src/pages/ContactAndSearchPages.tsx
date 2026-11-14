import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Clock, Mail, MapPin, MessageSquare, Phone, Search } from 'lucide-react';
import { EmptyState, PageBanner, SkeletonGrid } from '../components/common/PagePrimitives';
import { useSeo } from '../hooks/useSeo';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { api } from '../services/api';
import { BlogPostItem, CaseStudyItem, ProjectItem, ServiceItem, SolutionItem } from '../types';

export function ContactPage() {
  const { settings } = useSiteSettings();
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || 'Web Development';
  const initialPackage = searchParams.get('package') || '';

  const [serviceOptions, setServiceOptions] = useState<string[]>([
    'Web Development',
    'Software Development',
    'Custom Software Development',
    'Mobile App Development',
    'UI/UX Design',
    'Digital Marketing',
    'Meta Ads & Paid Social Advertising',
    'Google Ads & Search Marketing',
    'Social Media Marketing',
    'Lead Generation',
    'SEO Services',
    'E-commerce Development',
    'Business & Enterprise Solutions',
    'Cloud & DevOps',
    'Cybersecurity',
    'IT Consulting & Support',
  ]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: initialService,
    budget: '৳300,000 – ৳800,000 ($2.5K – $7K)',
    message: initialPackage
      ? `Interested in the ${initialPackage} package for ${initialService}. Please share next steps and onboarding timeline.`
      : '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useSeo({
    title: 'Contact Trust IT — Free Software, Web & Digital Consultation in Dhaka',
    description:
      'Contact Trust IT in Banani, Dhaka for custom software development, web engineering, digital marketing, SEO, cloud solutions, and enterprise IT consulting.',
    canonicalPath: '/contact',
  });

  useEffect(() => {
    api
      .get<{ items: ServiceItem[] }>('/services?limit=50')
      .then((res) => {
        const titles = res.items.map((s) => s.title);
        if (initialService && !titles.includes(initialService)) {
          titles.unshift(initialService);
        }
        if (titles.length > 0) setServiceOptions(titles);
      })
      .catch(() => {});
  }, [initialService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await api.post<{ message: string }>('/contact', form);
      setSuccessMsg(res.message);
      setForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: 'Web Development',
        budget: '৳300,000 – ৳800,000 ($2.5K – $7K)',
        message: '',
      });
    } catch (err: any) {
      setErrorMsg(err.details?.join(', ') || err.message || 'Unable to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageBanner
        eyebrow="Start a Conversation"
        title="Schedule Your Free Technical Consultation"
        description="Tell us about your software goals, timeline, or modernization challenges. A senior Trust IT architect will respond within one business day."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-7 space-y-5">
              <h2 className="text-xl font-bold text-slate-950">Dhaka Headquarters</h2>

              <div className="flex items-start gap-3 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-blue-700 shrink-0 mt-1" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-blue-700 shrink-0 mt-1" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-blue-700 shrink-0 mt-1" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <Clock className="w-4 h-4 text-blue-700 shrink-0 mt-1" />
                <span>{settings.businessHours}</span>
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                </a>
                <a
                  href={`tel:${settings.phone}`}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold bg-slate-950 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Now
                </a>
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold border border-slate-300 text-slate-800 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </a>
              </div>
            </div>

            <div className="bg-slate-900 text-slate-200 rounded-xl p-6 border border-slate-800">
              <p className="text-xs font-semibold text-sky-400 mb-2">Office Map Placeholder · Banani, Dhaka</p>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Located in Banani Commercial Zone (Road 11), 20 minutes from Hazrat Shahjalal International Airport.
              </p>
              <div className="h-44 rounded-lg bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center p-4">
                <MapPin className="w-6 h-6 text-sky-400 mb-2" />
                <p className="text-sm font-semibold text-white">Trust IT Engineering Center</p>
                <p className="text-xs text-slate-400 mt-1">Banani, Dhaka 1213 · 23.7937° N, 90.4066° E</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-slate-950 mb-2">Project & Consultation Inquiry</h2>
            <p className="text-sm text-slate-600 mb-6">
              All submissions are encrypted and routed directly to our solutions engineering desk.
            </p>

            {successMsg ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl p-6 space-y-3">
                <h3 className="text-lg font-bold">Inquiry Received</h3>
                <p className="text-sm">{successMsg}</p>
                <button
                  type="button"
                  onClick={() => setSuccessMsg('')}
                  className="px-4 py-2 text-xs font-semibold bg-emerald-800 text-white rounded-lg cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div role="alert" className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg p-3.5">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      id="c-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="c-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Work Email *
                    </label>
                    <input
                      id="c-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Phone / WhatsApp *
                    </label>
                    <input
                      id="c-phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="c-company" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Company / Organization
                    </label>
                    <input
                      id="c-company"
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-service" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Service / Solution Needed *
                    </label>
                    <select
                      id="c-service"
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-700"
                    >
                      {serviceOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="c-budget" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Estimated Budget *
                    </label>
                    <select
                      id="c-budget"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-700"
                    >
                      <option value="৳490 – ৳25,000 (Social Media / Design Package)">৳490 – ৳25,000 (Social Media / Design Package)</option>
                      <option value="৳25,000 – ৳150,000 (Monthly Marketing / Starter Web)">৳25,000 – ৳150,000 (Monthly Marketing / Starter Web)</option>
                      <option value="৳150,000 – ৳300,000 ($1.5K – $2.5K)">৳150,000 – ৳300,000 ($1.5K – $2.5K)</option>
                      <option value="৳300,000 – ৳800,000 ($2.5K – $7K)">৳300,000 – ৳800,000 ($2.5K – $7K)</option>
                      <option value="৳800,000 – ৳2,500,000 ($7K – $20K)">৳800,000 – ৳2,500,000 ($7K – $20K)</option>
                      <option value="৳2,500,000+ ($20K+ Enterprise)">৳2,500,000+ ($20K+ Enterprise)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="c-message" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Project Requirements & Timeline *
                  </label>
                  <textarea
                    id="c-message"
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Briefly describe what you want to build or modernize..."
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 text-sm font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {submitting ? 'Submitting Inquiry...' : 'Request Free Consultation'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    services: ServiceItem[];
    solutions: SolutionItem[];
    projects: ProjectItem[];
    caseStudies: CaseStudyItem[];
    blogs: BlogPostItem[];
  } | null>(null);

  useSeo({
    title: initialQ ? `Search results for "${initialQ}" | Trust IT` : 'Search | Trust IT',
    description: 'Search Trust IT services, solutions, delivered projects, case studies, and engineering articles.',
    canonicalPath: '/search',
  });

  useEffect(() => {
    if (!initialQ.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    api
      .get<any>(`/search?q=${encodeURIComponent(initialQ)}`)
      .then((res) => setResults(res))
      .finally(() => setLoading(false));
  }, [initialQ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
  };

  const totalCount = results
    ? results.services.length +
      results.solutions.length +
      results.projects.length +
      results.caseStudies.length +
      results.blogs.length
    : 0;

  return (
    <div>
      <PageBanner
        eyebrow="Global Site Search"
        title="Search Trust IT Knowledge & Capabilities"
        description="Find services, software solutions, portfolio case studies, and technical articles across our database."
        breadcrumbs={[{ label: 'Search' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 space-y-10">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search e.g. ERP, Next.js, Healthcare, Cloud, Fintech..."
                aria-label="Global search"
                className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 cursor-pointer"
            >
              Search
            </button>
          </form>

          {loading ? (
            <SkeletonGrid count={4} cols={2} />
          ) : results && totalCount === 0 ? (
            <EmptyState
              title={`No results for "${initialQ}"`}
              description="Try searching broader terms like Web, ERP, Cloud, Security, or Retail."
            />
          ) : results ? (
            <div className="space-y-8">
              <p className="text-sm text-slate-600 tabular-nums">
                Found <span className="font-semibold text-slate-950">{totalCount}</span> matching items for &ldquo;{initialQ}&rdquo;
              </p>

              {[
                { label: 'Services', items: results.services, prefix: '/services/' },
                { label: 'Solutions', items: results.solutions, prefix: '/solutions/' },
                { label: 'Projects', items: results.projects, prefix: '/projects/' },
                { label: 'Case Studies', items: results.caseStudies, prefix: '/case-studies/' },
                { label: 'Blog Articles', items: results.blogs, prefix: '/blog/' },
              ]
                .filter((g) => g.items.length > 0)
                .map((group) => (
                  <div key={group.label} className="space-y-3">
                    <h2 className="text-lg font-bold text-slate-950">{group.label}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.items.map((item: any) => (
                        <Link
                          key={item._id}
                          to={`${group.prefix}${item.slug}`}
                          className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-700/40 transition-colors flex items-center justify-between gap-4"
                        >
                          <div className="min-w-0">
                            <p className="text-base font-bold text-slate-950 truncate">{item.title}</p>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                              {item.shortDescription || item.summary || item.excerpt}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-blue-700 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export function LegalPage({ type }: { type: 'privacy' | 'terms' | 'cookies' }) {
  const config = {
    privacy: {
      title: 'Privacy Policy',
      path: '/privacy-policy',
      desc: 'How Trust IT collects, processes, and safeguards inquiry, recruitment, and client portal data.',
      sections: [
        { h: '1. Information We Collect', p: 'We collect contact details submitted voluntarily through our consultation, newsletter, and career application forms, including uploaded resume files.' },
        { h: '2. How We Use Data', p: 'Submitted information is used solely to respond to project inquiries, evaluate job applications, and deliver requested technical updates. We never sell or rent client data.' },
        { h: '3. Data Security & Retention', p: 'All form submissions are transmitted over HTTPS, sanitized, and stored with strict role-based administrative access controls.' },
      ],
    },
    terms: {
      title: 'Terms & Conditions',
      path: '/terms-and-conditions',
      desc: 'Standard terms governing use of the Trust IT website and initial project consultations.',
      sections: [
        { h: '1. Scope of Website Content', p: 'Service overviews, timeline estimates, and pricing ranges on this site are informational; binding deliverables are governed by executed Master Services Agreements.' },
        { h: '2. Intellectual Property', p: 'All Trust IT brand marks, case study text, and original visual assets remain the property of Trust IT unless transferred under a client agreement.' },
      ],
    },
    cookies: {
      title: 'Cookie Policy',
      path: '/cookie-policy',
      desc: 'Information regarding essential authentication and session cookies used by Trust IT.',
      sections: [
        { h: '1. Essential Session Cookies', p: 'We use strictly necessary HTTP-only cookies to secure administrative authentication sessions and protect against CSRF attacks.' },
        { h: '2. Analytics & Preferences', p: 'You may manage browser cookie settings at any time without affecting access to public informational pages.' },
      ],
    },
  }[type];

  useSeo({ title: `${config.title} | Trust IT`, description: config.desc, canonicalPath: config.path });

  return (
    <div>
      <PageBanner eyebrow="Legal & Compliance" title={config.title} description={config.desc} breadcrumbs={[{ label: config.title }]} />
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          {config.sections.map((s) => (
            <div key={s.h} className="space-y-2">
              <h2 className="text-xl font-bold text-slate-950">{s.h}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{s.p}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function HtmlSitemapPage() {
  useSeo({
    title: 'Sitemap | Trust IT Bangladesh',
    description: 'Complete directory of Trust IT pages, services, solutions, industries, portfolio, and insights.',
    canonicalPath: '/sitemap',
  });

  const groups = [
    {
      title: 'Core Pages',
      links: [
        { label: 'Home', to: '/' },
        { label: 'About Us', to: '/about' },
        { label: 'Services', to: '/services' },
        { label: 'Solutions', to: '/solutions' },
        { label: 'Industries', to: '/industries' },
        { label: 'Portfolio', to: '/projects' },
        { label: 'Case Studies', to: '/case-studies' },
        { label: 'Technologies', to: '/technologies' },
      ],
    },
    {
      title: 'Company & Resources',
      links: [
        { label: 'Leadership & Team', to: '/team' },
        { label: 'Careers', to: '/careers' },
        { label: 'Blog & Insights', to: '/blog' },
        { label: 'Testimonials', to: '/testimonials' },
        { label: 'Pricing & Engagement', to: '/pricing' },
        { label: 'FAQ', to: '/faq' },
        { label: 'Contact', to: '/contact' },
        { label: 'Global Search', to: '/search' },
      ],
    },
    {
      title: 'Legal & Machine Feeds',
      links: [
        { label: 'Privacy Policy', to: '/privacy-policy' },
        { label: 'Terms & Conditions', to: '/terms-and-conditions' },
        { label: 'Cookie Policy', to: '/cookie-policy' },
      ],
    },
  ];

  return (
    <div>
      <PageBanner
        eyebrow="Navigation Directory"
        title="Trust IT Sitemap"
        description="Structured links across all public pages and machine-readable XML sitemap endpoints."
        breadcrumbs={[{ label: 'Sitemap' }]}
      />
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {groups.map((g) => (
            <div key={g.title} className="bg-white border border-slate-200 rounded-xl p-7">
              <h2 className="text-lg font-bold text-slate-950 mb-4">{g.title}</h2>
              <ul className="space-y-2.5 text-sm text-blue-700">
                {g.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
                {g.title === 'Legal & Machine Feeds' && (
                  <>
                    <li>
                      <a href="/sitemap.xml" className="hover:underline">
                        XML Sitemap (/sitemap.xml)
                      </a>
                    </li>
                    <li>
                      <a href="/robots.txt" className="hover:underline">
                        Robots.txt (/robots.txt)
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function NotFoundPage() {
  useSeo({
    title: '404 Page Not Found | Trust IT',
    description: 'The requested Trust IT page could not be found.',
  });

  return (
    <div className="py-24 px-6 bg-slate-50">
      <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-xl p-10 text-center space-y-4">
        <p className="font-mono text-sm font-bold text-blue-700">404</p>
        <h1 className="text-3xl font-bold text-slate-950">Page Not Found</h1>
        <p className="text-sm text-slate-600">
          The page you are looking for may have moved or been archived. Use our navigation or search to locate what you need.
        </p>
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="px-5 py-2.5 text-sm font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800">
            Back to Home
          </Link>
          <Link to="/search" className="px-5 py-2.5 text-sm font-semibold border border-slate-300 text-slate-800 rounded-lg hover:bg-slate-50">
            Search Site
          </Link>
        </div>
      </div>
    </div>
  );
}
