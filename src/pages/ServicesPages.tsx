import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Layers,
  MessageSquare,
  Search,
  Sparkles,
} from 'lucide-react';
import { LucideIcon } from '../components/common/LucideIcon';
import { EmptyState, ErrorBanner, PageBanner, SkeletonGrid } from '../components/common/PagePrimitives';
import { SafeImage } from '../components/common/SafeImage';
import { useSeo } from '../hooks/useSeo';
import { useSiteSettings } from '../hooks/useSiteSettings';
import {
  DigitalMarketingShowcase,
  EcommerceLifecycleShowcase,
  SeoShowcase,
  ServiceRecommenderQuiz,
} from '../sections/services/ServicesInteractive';
import { SocialMediaPackagesSection } from '../sections/services/SocialMediaPackagesSection';
import { api } from '../services/api';
import {
  CaseStudyItem,
  PaginatedResponse,
  ProjectItem,
  ServiceCategoryItem,
  ServiceItem,
  TestimonialItem,
} from '../types';

const FILTER_TABS = [
  'All',
  'Development',
  'Design',
  'Marketing',
  'SEO',
  'E-commerce',
  'Business Solutions',
  'Cloud & DevOps',
  'Cybersecurity',
  'Consulting',
];

export function ServicesPage() {
  const { settings } = useSiteSettings();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<ServiceCategoryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSeo({
    title: 'IT Services, Software, Digital Marketing & SEO in Bangladesh | Trust IT',
    description:
      'Explore 10 core service categories from Trust IT in Dhaka: Web & Software Development, Mobile Apps, UI/UX Design, Meta & Google Ads Digital Marketing, SEO, E-commerce, ERP, Cloud & Cybersecurity.',
    canonicalPath: '/services',
    keywords: [
      'IT Company in Bangladesh',
      'Software Development Company Bangladesh',
      'Digital Marketing Agency Bangladesh',
      'SEO Services Bangladesh',
      'E-commerce Website Development Dhaka',
    ],
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [srvRes, catRes] = await Promise.all([
        api.get<PaginatedResponse<ServiceItem>>('/services?limit=100'),
        api.get<PaginatedResponse<ServiceCategoryItem>>('/service-categories?limit=20'),
      ]);
      setServices(srvRes.items);
      setCategories(catRes.items);
    } catch (err: any) {
      setError(err.message || 'Unable to load services catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const featuredServices = useMemo(
    () => services.filter((s) => s.isFeatured || s.featured).slice(0, 6),
    [services]
  );

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesGroup = activeFilter === 'All' || s.filterGroup === activeFilter;
      if (!matchesGroup) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        (s.category || '').toLowerCase().includes(q) ||
        (s.technologies || []).some((t) => t.toLowerCase().includes(q)) ||
        (s.subServices || []).some((sub) => sub.title.toLowerCase().includes(q))
      );
    });
  }, [services, activeFilter, search]);

  const jumpToCategory = (filterGroup: string) => {
    setActiveFilter(filterGroup);
    const el = document.getElementById('services-catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* 1. SERVICES HERO */}
      <section className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="max-w-3xl space-y-6">
            <p className="text-xs font-semibold text-sky-400 tracking-wide">
              6+ Years of Experience · 10 Full-Spectrum Practice Areas
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] text-balance">
              Technology &amp; Digital Solutions Built for Growth
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              From custom enterprise software, Next.js platforms, and UX design to Meta Ads, SEO, and cloud security—Trust IT engineers integrated digital ecosystems for businesses in Bangladesh and worldwide.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0"
              >
                Get a Free Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#services-catalog"
                className="inline-flex items-center px-6 py-3.5 text-sm font-semibold border border-slate-700 text-slate-100 rounded-lg hover:bg-slate-900 transition-colors whitespace-nowrap shrink-0"
              >
                Explore Services
              </a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-slate-400">
            <div>
              <p className="text-2xl font-bold text-white tabular-nums">10</p>
              <p className="mt-0.5">Core Practice Categories</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white tabular-nums">{services.length || 16}+</p>
              <p className="mt-0.5">Dedicated Service Lines</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white tabular-nums">500+</p>
              <p className="mt-0.5">Projects &amp; Campaigns Shipped</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white tabular-nums">6+ Yrs</p>
              <p className="mt-0.5">In-House Engineering Heritage</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED SERVICES GRID */}
      {!loading && !error && featuredServices.length > 0 && (
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold text-blue-700 mb-2 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Flagship Capabilities
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                  Featured Services
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Our most requested engineering, creative, and performance growth practices.
                </p>
              </div>
              <a
                href="#service-finder"
                className="text-sm font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                Need help choosing? Take our 6-question check <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((srv) => {
                const subCount = (srv.subServices?.length || 0) || (srv.features?.length || 0);
                return (
                  <Link
                    key={srv._id}
                    to={`/services/${srv.slug}`}
                    className="group bg-slate-50 border border-slate-200 rounded-xl p-7 hover:bg-white hover:border-blue-700/50 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <div className="w-11 h-11 rounded-lg bg-slate-950 text-sky-400 flex items-center justify-center">
                          <LucideIcon name={srv.icon} className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                          {srv.category || srv.filterGroup}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-950 group-hover:text-blue-700 transition-colors">
                        {srv.title}
                      </h3>
                      <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                        {srv.shortDescription}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
                      <span className="text-slate-600 tabular-nums">
                        {srv.startingPrice ? `From ${srv.startingPrice}` : 'Custom Quote'}
                        {subCount > 0 ? ` · ${subCount} Capabilities` : ''}
                      </span>
                      <span className="font-semibold text-blue-700 inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                        Learn More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 3. INTERACTIVE CATEGORY FILTER + SEARCH + ALL SERVICES DIRECTORY */}
      <section className="py-16 bg-slate-50" id="services-catalog">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold text-blue-700 mb-2">Complete Capabilities Directory</p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Explore All Trust IT Services
              </h2>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services, Meta Ads, SEO, React..."
                aria-label="Filter services"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          {/* Horizontal Category Tabs */}
          <div className="flex flex-wrap gap-2 pb-2" role="tablist" aria-label="Service Categories">
            {FILTER_TABS.map((tab) => {
              const active = activeFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-slate-950 text-white border-slate-950'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {loading ? (
            <SkeletonGrid count={6} />
          ) : error ? (
            <ErrorBanner message={error} onRetry={load} />
          ) : filteredServices.length === 0 ? (
            <EmptyState
              title="No matching services"
              description="Reset your category filter or search term to view all Trust IT capabilities."
              onReset={() => {
                setActiveFilter('All');
                setSearch('');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((s) => {
                const subCount = (s.subServices?.length || 0) || (s.features?.length || 0);
                return (
                  <Link
                    key={s._id}
                    to={`/services/${s.slug}`}
                    className="group bg-white border border-slate-200 rounded-xl p-7 hover:border-blue-700/50 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 text-blue-700 flex items-center justify-center">
                          <LucideIcon name={s.icon} className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-slate-500 truncate">
                          {s.filterGroup}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-950 group-hover:text-blue-700 transition-colors">
                        {s.title}
                      </h3>
                      <p className="mt-2.5 text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {s.shortDescription}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                      <span className="text-slate-600 tabular-nums truncate">
                        {s.startingPrice ? `Starting ${s.startingPrice}` : 'Custom Scope'}
                        {subCount > 0 ? ` · ${subCount} Modules` : ''}
                      </span>
                      <span className="font-semibold text-blue-700 inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                        Learn More <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. ALL 10 SERVICE CATEGORIES OVERVIEW */}
      {categories.length > 0 && (
        <section className="py-16 bg-slate-950 text-white border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6 space-y-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-sky-400 mb-2">Practice Architecture</p>
              <h2 className="text-3xl font-bold tracking-tight">10 Specialized Service Divisions</h2>
              <p className="mt-2 text-sm text-slate-300">
                Select any division below to filter our service catalog or schedule a multi-disciplinary discovery call.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => jumpToCategory(cat.filterGroup)}
                  className="text-left bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-sky-500/60 hover:bg-slate-900/80 transition-colors cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <LucideIcon name={cat.icon} className="w-5 h-5 text-sky-400 mb-3" />
                    <h3 className="text-sm font-bold text-white">{cat.name}</h3>
                    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {cat.description}
                    </p>
                  </div>
                  <span className="mt-4 text-xs font-semibold text-sky-400 inline-flex items-center gap-1">
                    Filter {cat.filterGroup} <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4B. MULTI-PLATFORM SOCIAL MEDIA SOLUTIONS & PACKAGES */}
      <SocialMediaPackagesSection />

      {/* 5. INTERACTIVE SERVICE FINDER QUESTIONNAIRE */}
      <ServiceRecommenderQuiz services={services} />

      {/* 6. FINAL CTA ("Not Sure What You Need?") */}
      <section className="py-20 bg-slate-950 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <p className="text-xs font-semibold text-sky-400">Free Advisory &amp; Scope Audit</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            Not Sure What You Need?
          </h2>
          <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Whether you are planning a custom software platform, fixing slow website conversions, or restructuring Meta &amp; Google Ads campaigns, our senior Dhaka architects will review your goals and propose a clear plan.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              Let Our Experts Guide You
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`https://wa.me/${(settings.whatsapp || '+8801711000000').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border border-slate-700 text-slate-100 rounded-lg hover:bg-slate-900 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

const DIGITAL_MARKETING_SLUGS = new Set([
  'digital-marketing',
  'facebook-meta-ads',
  'google-ads',
  'social-media-marketing',
  'lead-generation',
]);

export function ServiceDetailPage() {
  const { slug } = useParams();
  const [service, setService] = useState<ServiceItem | null>(null);
  const [allServices, setAllServices] = useState<ServiceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudyItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    setLoading(true);
    setError('');
    setOpenFaq(0);
    Promise.all([
      api.get<{ item: ServiceItem }>(`/services/${slug}`),
      api.get<PaginatedResponse<ServiceItem>>('/services?limit=50'),
      api.get<PaginatedResponse<ProjectItem>>('/projects?featured=true&limit=3'),
      api.get<PaginatedResponse<CaseStudyItem>>('/case-studies?limit=2'),
      api.get<PaginatedResponse<TestimonialItem>>('/testimonials?featured=true&limit=3'),
    ])
      .then(([srvRes, listRes, projRes, csRes, testRes]) => {
        setService(srvRes.item);
        setAllServices(listRes.items);
        setProjects(projRes.items);
        setCaseStudies(csRes.items);
        setTestimonials(testRes.items);
      })
      .catch((err: any) => setError(err.message || 'Service not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  const relatedList = useMemo(() => {
    if (!service) return [];
    const relatedSlugs = service.relatedServices || [];
    const matched = relatedSlugs
      .map((rSlug) => allServices.find((item) => item.slug === rSlug))
      .filter((x): x is ServiceItem => Boolean(x));
    if (matched.length > 0) return matched;
    return allServices
      .filter((item) => item.slug !== service.slug && item.filterGroup === service.filterGroup)
      .slice(0, 3);
  }, [service, allServices]);

  useSeo({
    title:
      service?.seo?.metaTitle ||
      (service?.seo as { title?: string } | undefined)?.title ||
      service?.seoTitle ||
      `${service?.title || 'Service'} | Trust IT Bangladesh`,
    description:
      service?.seo?.metaDescription ||
      (service?.seo as { description?: string } | undefined)?.description ||
      service?.seoDescription ||
      service?.shortDescription ||
      'Enterprise IT, software, digital marketing, and SEO services from Trust IT.',
    keywords: service?.seo?.keywords,
    canonicalPath: `/services/${slug}`,
    schema: service
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: service.title,
            serviceType: service.category || service.filterGroup,
            description: service.shortDescription,
            provider: {
              '@type': 'Organization',
              name: 'Trust IT',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Dhaka',
                addressCountry: 'BD',
              },
            },
            areaServed: ['Bangladesh', 'Global'],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
              { '@type': 'ListItem', position: 2, name: 'Services', item: '/services' },
              { '@type': 'ListItem', position: 3, name: service.title, item: `/services/${service.slug}` },
            ],
          },
        ]
      : undefined,
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <SkeletonGrid count={3} />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24">
        <EmptyState
          title="Service Not Found"
          description={error || 'The requested service page does not exist.'}
          actionLabel="Browse All Services"
          actionTo="/services"
        />
      </div>
    );
  }

  const heroImage = service.featuredImage?.secure_url ? service.featuredImage : service.image;
  const overviewText = service.description || service.detailedDescription || service.shortDescription;
  const isMarketingPage = DIGITAL_MARKETING_SLUGS.has(service.slug);
  const isSeoPage = service.slug === 'seo';
  const isEcommercePage = service.slug === 'ecommerce-development';

  return (
    <div>
      {/* 1. SERVICE HERO */}
      <PageBanner
        eyebrow={`${service.category || service.filterGroup}${service.startingPrice ? ` · Starting ${service.startingPrice}` : ''}`}
        title={service.title}
        description={service.shortDescription}
        breadcrumbs={[{ label: 'Services', to: '/services' }, { label: service.title }]}
      >
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Link
            to={`/contact?service=${encodeURIComponent(service.title)}`}
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Get Free Consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
          {service.packages && service.packages.length > 0 && (
            <a
              href="#packages"
              className="inline-flex items-center px-5 py-3 text-sm font-semibold border border-slate-700 text-slate-100 rounded-lg hover:bg-slate-900 transition-colors"
            >
              View Service Packages
            </a>
          )}
        </div>
      </PageBanner>

      {/* 2. SERVICE INTRODUCTION & VISUAL */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <p className="text-xs font-semibold text-blue-700 mb-2">Service Overview</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950">
                What We Provide Under {service.title}
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed text-base">{overviewText}</p>
            </div>

            {service.benefits && service.benefits.length > 0 && (
              <div className="pt-2">
                <h3 className="text-lg font-bold text-slate-950 mb-4">Key Business Outcomes</h3>
                <ul className="space-y-3">
                  {service.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
              <SafeImage src={heroImage?.secure_url} alt={heroImage?.alt || service.title} />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-500">Category</p>
                  <p className="font-semibold text-slate-950 mt-0.5">{service.category || service.filterGroup}</p>
                </div>
                <div>
                  <p className="text-slate-500">Starting Investment</p>
                  <p className="font-semibold text-slate-950 tabular-nums mt-0.5">
                    {service.startingPrice || 'Custom Proposal'}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-1.5">Core Stack &amp; Tools</p>
                <p className="text-xs font-medium text-slate-800 leading-relaxed">
                  {(service.technologies || []).join(' · ')}
                </p>
              </div>
              <Link
                to={`/contact?service=${encodeURIComponent(service.title)}`}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                Request Proposal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEMS WE SOLVE & OUR SOLUTION */}
      {((service.problemsSolved && service.problemsSolved.length > 0) || service.ourSolution) && (
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-7 space-y-4">
              <p className="text-xs font-semibold text-red-700 inline-flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Common Business Challenges
              </p>
              <h2 className="text-2xl font-bold text-slate-950">Problems We Solve</h2>
              <ul className="space-y-3">
                {(service.problemsSolved || []).map((prob) => (
                  <li key={prob} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="font-mono text-xs text-red-600 mt-1 shrink-0">—</span>
                    <span>{prob}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6 bg-slate-950 text-white border border-slate-800 rounded-xl p-7 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-sky-400 inline-flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Trust IT Engineering &amp; Growth Approach
                </p>
                <h2 className="text-2xl font-bold text-white">Our Solution</h2>
                <p className="text-sm text-slate-300 leading-relaxed">{service.ourSolution}</p>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <Link
                  to={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300"
                >
                  Discuss how this solves your bottleneck <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. SUB-SERVICES & KEY FEATURES */}
      {((service.subServices && service.subServices.length > 0) || (service.features && service.features.length > 0)) && (
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 space-y-10">
            {service.subServices && service.subServices.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-blue-700 mb-2">Specialized Modules</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mb-6">
                  Included Sub-Services &amp; Capabilities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {service.subServices.map((sub) => {
                    const targetLink = sub.slug
                      ? sub.slug.startsWith('../')
                        ? `/${sub.slug.replace('../', '')}`
                        : `/services/${sub.slug}`
                      : null;

                    return (
                      <div
                        key={sub.title}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between"
                      >
                        <div>
                          <h3 className="text-base font-bold text-slate-950">{sub.title}</h3>
                          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{sub.description}</p>
                        </div>
                        {targetLink && (
                          <div className="mt-4 pt-3 border-t border-slate-200">
                            <Link
                              to={targetLink}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800"
                            >
                              Explore Dedicated Page <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {service.features && service.features.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-950 mb-4">Deliverable Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {service.features.map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2.5 border border-slate-200 rounded-lg px-4 py-3 bg-slate-50 text-sm font-medium text-slate-900"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. DOMAIN-SPECIFIC VISUALS (DIGITAL MARKETING FUNNEL / SEO GROWTH / E-COMMERCE LIFECYCLE) */}
      {isMarketingPage && <DigitalMarketingShowcase />}
      {isMarketingPage && <SocialMediaPackagesSection compact />}
      {isSeoPage && <SeoShowcase />}
      {isEcommercePage && <EcommerceLifecycleShowcase />}

      {/* 6. DELIVERY PROCESS */}
      {service.process && service.process.length > 0 && (
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs font-semibold text-blue-700 mb-2">Execution Framework</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mb-8">
              How Trust IT Delivers {service.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.process.map((p) => (
                <div key={p.step} className="bg-white border border-slate-200 rounded-xl p-6">
                  <span className="font-mono text-xs text-blue-700 font-semibold tabular-nums">{p.step}.</span>
                  <h3 className="text-base font-bold text-slate-950 mt-2">{p.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. TECHNOLOGIES & PLATFORMS */}
      {service.technologies && service.technologies.length > 0 && (
        <section className="py-12 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold text-blue-700 mb-1">Verified Stack</p>
              <h2 className="text-xl font-bold text-slate-950">Technologies &amp; Platforms Used</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2.5">
              {service.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3.5 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. SERVICE PACKAGES (DYNAMIC FROM ADMIN CMS) */}
      {service.packages && service.packages.length > 0 && (
        <section className="py-16 bg-slate-50 border-t border-slate-200" id="packages">
          <div className="max-w-7xl mx-auto px-6 space-y-10">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-blue-700 mb-2">Transparent Engagement Tiers</p>
              <h2 className="text-3xl font-bold text-slate-950">
                {service.title} Packages
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Select a structured starting tier or request a custom enterprise scope tailored to your workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {service.packages.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`rounded-xl p-7 flex flex-col justify-between border ${
                    pkg.highlighted
                      ? 'bg-slate-950 text-white border-slate-800 shadow-lg'
                      : 'bg-white text-slate-950 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-bold">{pkg.name}</h3>
                      <span
                        className={`text-xs font-mono ${
                          pkg.highlighted ? 'text-sky-400' : 'text-blue-700'
                        }`}
                      >
                        {pkg.billingType}
                      </span>
                    </div>
                    <p className="mt-3 text-2xl sm:text-3xl font-extrabold tabular-nums">{pkg.price}</p>
                    <p className={`mt-2 text-xs tabular-nums ${pkg.highlighted ? 'text-slate-300' : 'text-slate-500'}`}>
                      Delivery: {pkg.deliveryTime} · Revisions: {pkg.revisions}
                    </p>
                    <p className={`mt-1 text-xs ${pkg.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>
                      Support: {pkg.support}
                    </p>

                    <ul className="mt-6 pt-5 border-t border-slate-200/20 space-y-2.5 text-sm">
                      {pkg.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5">
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              pkg.highlighted ? 'text-sky-400' : 'text-blue-700'
                            }`}
                          />
                          <span className={pkg.highlighted ? 'text-slate-200' : 'text-slate-700'}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <Link
                      to={`/contact?service=${encodeURIComponent(service.title)}&package=${encodeURIComponent(pkg.name)}`}
                      className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg transition-colors ${
                        pkg.highlighted
                          ? 'bg-blue-600 text-white hover:bg-blue-500'
                          : 'bg-slate-950 text-white hover:bg-slate-800'
                      }`}
                    >
                      Get Started with {pkg.name}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. PORTFOLIO & CASE STUDIES */}
      {(projects.length > 0 || caseStudies.length > 0) && (
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            {projects.length > 0 && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs font-semibold text-blue-700 mb-1">Proven Delivery</p>
                    <h2 className="text-2xl font-bold text-slate-950">Selected Production Projects</h2>
                  </div>
                  <Link to="/projects" className="text-xs font-semibold text-blue-700 inline-flex items-center gap-1">
                    View Full Portfolio <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {projects.map((p) => (
                    <Link
                      key={p._id}
                      to={`/projects/${p.slug}`}
                      className="group border border-slate-200 rounded-xl overflow-hidden bg-slate-50 hover:border-blue-700/40 transition-colors"
                    >
                      <div className="aspect-[16/10] bg-slate-900 overflow-hidden">
                        <SafeImage
                          src={p.image?.secure_url}
                          alt={p.image?.alt || p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <p className="text-xs text-slate-500">
                          {p.industry} · {p.completedYear}
                        </p>
                        <h3 className="text-base font-bold text-slate-950 mt-1">{p.title}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {caseStudies.length > 0 && (
              <div className="pt-8 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs font-semibold text-blue-700 mb-1">Client Impact</p>
                    <h2 className="text-2xl font-bold text-slate-950">Featured Case Studies</h2>
                  </div>
                  <Link to="/case-studies" className="text-xs font-semibold text-blue-700 inline-flex items-center gap-1">
                    Explore Case Studies <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {caseStudies.map((cs) => (
                    <Link
                      key={cs._id}
                      to={`/case-studies/${cs.slug}`}
                      className="bg-slate-950 text-white rounded-xl p-6 hover:bg-slate-900 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <p className="text-xs text-sky-400">
                          {cs.client} · {cs.industry}
                        </p>
                        <h3 className="text-lg font-bold mt-2">{cs.title}</h3>
                        <p className="text-xs text-slate-300 mt-2 line-clamp-2">{cs.summary}</p>
                      </div>
                      <p className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono text-slate-300 tabular-nums">
                        {cs.metrics.map((m) => `${m.label}: ${m.value}`).join(' · ')}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 10. CLIENT TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs font-semibold text-blue-700 mb-2">Verified Client Feedback</p>
            <h2 className="text-2xl font-bold text-slate-950 mb-8">Trusted by Leadership Teams</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t._id} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-mono font-semibold text-blue-700 tabular-nums mb-2">
                      {t.outcomeMetric}
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <p className="text-sm font-bold text-slate-950">{t.clientName}</p>
                    <p className="text-xs text-slate-500">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 11. SERVICE FAQ */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-xs font-semibold text-blue-700 mb-2">Frequently Asked Questions</p>
            <h2 className="text-2xl font-bold text-slate-950 mb-6">{service.title} FAQ</h2>
            <div className="space-y-3">
              {service.faqs.map((f, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    aria-expanded={openFaq === idx}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-slate-950 cursor-pointer"
                  >
                    <span>{f.question}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-4 text-sm text-slate-600 border-t border-slate-200 pt-3 bg-white leading-relaxed">
                      {f.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 12. RELATED SERVICES */}
      {relatedList.length > 0 && (
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold text-blue-700 mb-1">Complementary Services</p>
                <h2 className="text-2xl font-bold text-slate-950">Frequently Combined With {service.title}</h2>
              </div>
              <Link to="/services" className="text-xs font-semibold text-blue-700 inline-flex items-center gap-1">
                All Services <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedList.map((rel) => (
                <Link
                  key={rel._id}
                  to={`/services/${rel.slug}`}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-700/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <LucideIcon name={rel.icon} className="w-5 h-5 text-blue-700" />
                      <span className="text-xs text-slate-500">{rel.filterGroup}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-950">{rel.title}</h3>
                    <p className="mt-1.5 text-xs text-slate-600 line-clamp-2">{rel.shortDescription}</p>
                  </div>
                  <p className="mt-4 text-xs font-semibold text-blue-700 inline-flex items-center gap-1">
                    Learn More <ArrowRight className="w-3.5 h-3.5" />
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 13. CONVERSION FINAL CTA */}
      <section className="py-20 bg-slate-950 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <p className="text-xs font-semibold text-sky-400">Ready to Start?</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            Launch Your {service.title} Roadmap With Trust IT
          </h2>
          <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Schedule a free discovery consultation with our senior Dhaka specialists. Receive a scoped architecture or campaign plan within 24 hours.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={`/contact?service=${encodeURIComponent(service.title)}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              Request Free Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact?service=Technical%20Audit"
              className="inline-flex items-center px-6 py-3.5 text-sm font-semibold border border-slate-700 text-slate-100 rounded-lg hover:bg-slate-900 transition-colors"
            >
              Book Free Discovery Call
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
