import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { BrandLogo } from '../components/common/BrandLogo';
import { LucideIcon } from '../components/common/LucideIcon';
import { CtaSection } from '../components/common/PagePrimitives';
import { SafeImage } from '../components/common/SafeImage';
import { useSeo } from '../hooks/useSeo';
import { useSiteSettings } from '../hooks/useSiteSettings';
import {
  InteractiveProcessSection,
  InteractiveTechStackSection,
  SolutionRecommenderSection,
} from '../sections/home/ProcessAndEstimator';
import { SocialMediaPackagesSection } from '../sections/services/SocialMediaPackagesSection';
import { api } from '../services/api';
import {
  BlogPostItem,
  CaseStudyItem,
  FAQItem,
  IndustryItem,
  PaginatedResponse,
  ProjectItem,
  ServiceItem,
  SolutionItem,
  TeamMemberItem,
  TestimonialItem,
} from '../types';

export function HomePage() {
  const { settings } = useSiteSettings();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [solutions, setSolutions] = useState<SolutionItem[]>([]);
  const [industries, setIndustries] = useState<IndustryItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudyItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [team, setTeam] = useState<TeamMemberItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useSeo({
    title: settings.seoDefaults?.siteTitle || 'Trust IT — Building Digital Solutions You Can Trust',
    description:
      settings.seoDefaults?.metaDescription ||
      'With 6+ years of experience, Trust IT delivers reliable web, software, cloud, and digital solutions in Bangladesh.',
    canonicalPath: '/',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Trust IT',
      description: 'Established Bangladeshi IT company delivering software, web, cloud, and cybersecurity solutions.',
      telephone: settings.phone,
      email: settings.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'House 42, Road 11, Block F, Banani',
        addressLocality: 'Dhaka',
        postalCode: '1213',
        addressCountry: 'BD',
      },
    },
  });

  useEffect(() => {
    Promise.allSettled([
      api.get<PaginatedResponse<ServiceItem>>('/services?isFeatured=true&limit=6'),
      api.get<PaginatedResponse<SolutionItem>>('/solutions?limit=6'),
      api.get<PaginatedResponse<IndustryItem>>('/industries?limit=11'),
      api.get<PaginatedResponse<ProjectItem>>('/projects?featured=true&limit=3'),
      api.get<PaginatedResponse<CaseStudyItem>>('/case-studies?limit=2'),
      api.get<PaginatedResponse<TestimonialItem>>('/testimonials?featured=true&limit=3'),
      api.get<PaginatedResponse<TeamMemberItem>>('/team?limit=3'),
      api.get<PaginatedResponse<BlogPostItem>>('/blog?limit=3'),
      api.get<PaginatedResponse<FAQItem>>('/faqs?limit=5'),
    ]).then(([srv, sol, ind, proj, cs, test, tm, blg, fq]) => {
      if (srv.status === 'fulfilled') setServices(srv.value.items);
      if (sol.status === 'fulfilled') setSolutions(sol.value.items);
      if (ind.status === 'fulfilled') setIndustries(ind.value.items);
      if (proj.status === 'fulfilled') setProjects(proj.value.items);
      if (cs.status === 'fulfilled') setCaseStudies(cs.value.items);
      if (test.status === 'fulfilled') setTestimonials(test.value.items);
      if (tm.status === 'fulfilled') setTeam(tm.value.items);
      if (blg.status === 'fulfilled') setBlogs(blg.value.items);
      if (fq.status === 'fulfilled') {
        setFaqs(fq.value.items);
        if (fq.value.items[0]) setOpenFaq(fq.value.items[0]._id);
      }
    });
  }, []);

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 lg:pt-24 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-4 mb-5">
                <BrandLogo variant="hero" />
                <div className="hidden sm:block h-9 w-px bg-slate-800" aria-hidden="true" />
                <p className="text-xs font-semibold text-amber-400 tracking-wide">
                  6+ Years in IT · Dhaka, Bangladesh
                </p>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.08] text-white text-balance">
                {settings.heroHeadline || 'Building Digital Solutions You Can Trust'}
              </h1>
              <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                {settings.heroSubheadline}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0"
                >
                  Get a Free Consultation
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center px-6 py-3.5 text-sm font-semibold border border-slate-700 text-slate-100 rounded-lg hover:bg-slate-900 transition-colors whitespace-nowrap shrink-0"
                >
                  Explore Our Services
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 min-h-[300px] lg:min-h-[420px]">
              <div className="h-full w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                <SafeImage
                  src="/src/assets/images/hero_trust_it_1794679591353.jpg"
                  alt="Trust IT Software Engineering Center in Dhaka, Bangladesh"
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* 4-Column Trust Indicators Row */}
          <div className="mt-14 pt-10 border-t border-slate-800/90 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                <AnimatedCounter target={settings.stats?.yearsExperience || 6} suffix="+" />
              </p>
              <p className="mt-1 text-sm text-slate-400">Years Experience</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                <AnimatedCounter target={settings.stats?.projectsCompleted || 500} suffix="+" />
              </p>
              <p className="mt-1 text-sm text-slate-400">Projects Delivered</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                <AnimatedCounter target={settings.stats?.happyClients || 300} suffix="+" />
              </p>
              <p className="mt-1 text-sm text-slate-400">Happy Clients</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                <AnimatedCounter target={settings.stats?.professionals || 50} suffix="+" />
              </p>
              <p className="mt-1 text-sm text-slate-400">Engineering Professionals</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUSTED BY BUSINESSES THAT THINK AHEAD */}
      <section className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-semibold text-slate-500 text-center mb-6">
            Trusted by Businesses That Think Ahead
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {(settings.clientLogos || []).map((client) => (
              <div
                key={client.id}
                className="border border-slate-200 rounded-lg px-4 py-3.5 text-center bg-slate-50/70"
              >
                <p className="text-sm font-bold text-slate-800 tracking-tight truncate">{client.name}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{client.sector}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ABOUT TRUST IT & WHY 6+ YEARS MATTERS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-6 min-h-[320px]">
            <div className="h-full rounded-xl overflow-hidden border border-slate-200 bg-white">
              <SafeImage
                src="/src/assets/images/about_team_office_1794679591380.jpg"
                alt="Trust IT Senior Engineering and Architecture Leadership in Dhaka"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div>
              <p className="text-xs font-semibold text-blue-700 mb-2">Why 6+ Years of Experience Matters</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 text-balance">
                Built for Long-Term Reliability, Not Short-Term Demos
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Since 2020, Trust IT has partnered with Bangladeshi enterprises, high-growth startups, educational institutions, and global organizations to engineer software that remains fast, secure, and maintainable years after launch.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white border border-slate-200 rounded-lg p-5">
                <p className="text-2xl font-bold text-slate-950 tabular-nums">
                  {settings.stats?.clientSatisfaction || 98}%
                </p>
                <p className="text-xs font-semibold text-slate-800 mt-1">Client Satisfaction & Retention</p>
                <p className="text-xs text-slate-500 mt-1">Multi-year partnerships across core platforms.</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-5">
                <p className="text-2xl font-bold text-slate-950 tabular-nums">99.95%</p>
                <p className="text-xs font-semibold text-slate-800 mt-1">Production Cloud SLA</p>
                <p className="text-xs text-slate-500 mt-1">Monitored 24/7 by our Dhaka DevOps desk.</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-sm text-slate-700">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
                <span>Senior in-house Dhaka engineering squads with zero third-party outsourcing</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
                <span>Deep local integration expertise: bKash, SSLCommerz, banks, and courier APIs</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
                <span>100% client source-code ownership and transparent milestone delivery</span>
              </li>
            </ul>

            <div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                Read Our 6+ Year Story
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES SECTION */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-blue-700 mb-2">Core Capabilities</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 text-balance">
                End-to-End IT Services for Modern Enterprises
              </h2>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0"
            >
              Explore All Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <Link
                key={service._id}
                to={`/services/${service.slug}`}
                className={`group bg-slate-50 border border-slate-200 rounded-xl p-7 hover:bg-white hover:border-blue-700/40 transition-colors flex flex-col justify-between ${
                  idx === 0 ? 'lg:col-span-2 bg-slate-950 text-white hover:bg-slate-900 border-slate-800' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        idx === 0 ? 'bg-blue-600/20 text-sky-400' : 'bg-white border border-slate-200 text-blue-700'
                      }`}
                    >
                      <LucideIcon name={service.icon} className="w-5 h-5" />
                    </div>
                    <span className={`font-mono text-xs tabular-nums ${idx === 0 ? 'text-slate-400' : 'text-slate-500'}`}>
                      {service.startingPrice ? `From ${service.startingPrice}` : `0${idx + 1}.`}
                    </span>
                  </div>
                  <h3 className={`text-xl font-bold tracking-tight ${idx === 0 ? 'text-white' : 'text-slate-950'}`}>
                    {service.title}
                  </h3>
                  <p className={`mt-2.5 text-sm leading-relaxed ${idx === 0 ? 'text-slate-300' : 'text-slate-600'}`}>
                    {service.shortDescription}
                  </p>
                </div>
                <div className={`mt-6 pt-4 border-t flex items-center justify-between text-xs font-semibold ${
                  idx === 0 ? 'border-slate-800 text-sky-400' : 'border-slate-200 text-blue-700'
                }`}>
                  <span>{service.technologies.slice(0, 3).join(' · ')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4B. SOCIAL MEDIA SOLUTIONS & PLATFORM PACKAGES */}
      <SocialMediaPackagesSection compact />

      {/* 5. FEATURED SOLUTIONS */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-blue-700 mb-2">Business Software Suites</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 text-balance">
                Ready-to-Customize Enterprise Solutions
              </h2>
            </div>
            <Link
              to="/solutions"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0"
            >
              View All 12 Solutions
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((sol) => (
              <Link
                key={sol._id}
                to={`/solutions/${sol.slug}`}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-700/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center">
                      <LucideIcon name={sol.icon} className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-slate-500 truncate">{sol.targetAudience[0]}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-950">{sol.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{sol.shortDescription}</p>
                </div>
                <p className="mt-5 text-xs font-semibold text-blue-700 inline-flex items-center gap-1.5">
                  Explore Solution <ArrowRight className="w-3.5 h-3.5" />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE 01-07 PROCESS */}
      <InteractiveProcessSection />

      {/* 7. SOLUTION RECOMMENDER */}
      <SolutionRecommenderSection />

      {/* 8. INDUSTRIES WE SERVE */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-blue-700 mb-2">Domain Specialization</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 text-balance">
                Industries We Serve Across Bangladesh & Globally
              </h2>
            </div>
            <Link
              to="/industries"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0"
            >
              All 11 Industries
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {industries.slice(0, 8).map((ind) => (
              <Link
                key={ind._id}
                to={`/industries/${ind.slug}`}
                className="border border-slate-200 rounded-xl p-5 bg-slate-50/60 hover:bg-white hover:border-blue-700/40 transition-colors"
              >
                <LucideIcon name={ind.icon} className="w-5 h-5 text-blue-700 mb-3" />
                <h3 className="text-base font-bold text-slate-950">{ind.title}</h3>
                <p className="mt-1.5 text-xs text-slate-600 line-clamp-2">{ind.shortDescription}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9. INTERACTIVE TECHNOLOGY STACK */}
      <InteractiveTechStackSection />

      {/* 10. FEATURED PROJECTS & CASE STUDIES */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-semibold text-blue-700 mb-2">Selected Portfolio</p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
                  Production Systems Delivering Real ROI
                </h2>
              </div>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0"
              >
                Explore All Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project.slug}`}
                  className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden hover:border-blue-700/40 transition-colors flex flex-col"
                >
                  <div className="aspect-[4/3] bg-slate-900 overflow-hidden">
                    <SafeImage
                      src={project.image?.secure_url}
                      alt={project.image?.alt || project.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-500 mb-2">
                        {project.industry} · {project.completedYear}
                      </p>
                      <h3 className="text-lg font-bold text-slate-950 leading-snug">{project.title}</h3>
                      <p className="mt-2 text-sm text-slate-600 line-clamp-2">{project.shortDescription}</p>
                    </div>
                    {project.metrics && project.metrics.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-slate-200 grid grid-cols-2 gap-3">
                        {project.metrics.slice(0, 2).map((m) => (
                          <div key={m.label}>
                            <p className="text-base font-bold text-slate-950 tabular-nums">{m.value}</p>
                            <p className="text-xs text-slate-500">{m.label}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {caseStudies.length > 0 && (
            <div className="pt-8 border-t border-slate-200">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                  <p className="text-xs font-semibold text-blue-700 mb-2">Engineering Deep Dives</p>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                    Featured Case Studies
                  </h2>
                </div>
                <Link
                  to="/case-studies"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                >
                  Read All Case Studies
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {caseStudies.map((cs) => (
                  <Link
                    key={cs._id}
                    to={`/case-studies/${cs.slug}`}
                    className="bg-slate-950 text-white rounded-xl p-8 hover:bg-slate-900 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <p className="text-xs text-sky-400 mb-3">
                        {cs.client} · {cs.industry}
                      </p>
                      <h3 className="text-xl font-bold leading-snug">{cs.title}</h3>
                      <p className="mt-3 text-sm text-slate-300 leading-relaxed">{cs.summary}</p>
                    </div>
                    <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-300 tabular-nums">
                        {cs.metrics.map((m) => `${m.label}: ${m.value}`).join(' · ')}
                      </span>
                      <ArrowRight className="w-4 h-4 text-sky-400 shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 11. CLIENT TESTIMONIALS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-semibold text-blue-700 mb-2">Verified Client Outcomes</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
                What Enterprise Leaders Say
              </h2>
            </div>
            <Link
              to="/testimonials"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
            >
              View All Testimonials
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
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
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. TEAM PREVIEW & BLOG INSIGHTS */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-semibold text-blue-700 mb-2">Leadership</p>
                <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                  Senior Architects Leading Every Delivery
                </h2>
              </div>
              <Link to="/team" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                Meet Full Team <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {team.map((member) => (
                <div key={member._id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <div className="aspect-square bg-slate-200">
                    <SafeImage
                      src={member.image?.secure_url}
                      alt={member.image?.alt || member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-950">{member.name}</h3>
                    <p className="text-xs text-blue-700 font-semibold mt-0.5">{member.position}</p>
                    <p className="text-sm text-slate-600 mt-3 line-clamp-2">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-12 border-t border-slate-200">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-semibold text-blue-700 mb-2">Engineering Insights</p>
                <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                  Latest Articles & Architecture Guides
                </h2>
              </div>
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                Read All Insights <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((post) => (
                <Link
                  key={post._id}
                  to={`/blog/${post.slug}`}
                  className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-blue-700/40 transition-colors flex flex-col"
                >
                  <div className="aspect-[16/9] bg-slate-900 overflow-hidden">
                    <SafeImage
                      src={post.featuredImage?.secure_url}
                      alt={post.featuredImage?.alt || post.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-500 mb-2">
                        {post.category} · {post.readingTime}
                      </p>
                      <h3 className="text-base font-bold text-slate-950 leading-snug">{post.title}</h3>
                      <p className="mt-2 text-sm text-slate-600 line-clamp-2">{post.excerpt}</p>
                    </div>
                    <p className="mt-4 text-xs font-medium text-slate-500">By {post.author}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 13. FAQ SECTION */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-blue-700 mb-2">Frequently Asked Questions</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
              Clear Answers Before You Start
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq._id;
              return (
                <div key={faq._id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : faq._id)}
                    aria-expanded={isOpen}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-semibold text-slate-950">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link to="/faq" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
              View All Frequently Asked Questions
            </Link>
          </div>
        </div>
      </section>

      {/* 14. FINAL CTA */}
      <CtaSection />
    </div>
  );
}
