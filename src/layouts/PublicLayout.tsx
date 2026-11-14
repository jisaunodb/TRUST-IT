import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { api } from '../services/api';

const megaMenus = {
  services: [
    { label: 'All IT & Digital Services', to: '/services', desc: '10 categories · 16+ full-spectrum practices' },
    { label: 'Web & Software Development', to: '/services/web-development', desc: 'Next.js, React, APIs & enterprise apps' },
    { label: 'Social Media Solutions', to: '/services/social-media-marketing', desc: 'Facebook, Instagram, TikTok, YouTube, X & LinkedIn' },
    { label: 'Digital Marketing & Meta Ads', to: '/services/digital-marketing', desc: 'Meta Ads, Google Ads, Video Editing & Content' },
    { label: 'SEO & Organic Growth', to: '/services/seo', desc: 'Technical SEO, local Dhaka & e-commerce' },
    { label: 'UI/UX & Graphic Design', to: '/services/ui-ux-design', desc: 'Logos, flyers, social posts, CV & UI systems' },
  ],
  solutions: [
    { label: 'All Business Solutions', to: '/solutions', desc: '12 enterprise software suites' },
    { label: 'ERP Solutions', to: '/solutions/erp-solutions', desc: 'Finance, VAT & multi-branch inventory' },
    { label: 'CRM & Automation', to: '/solutions/crm-solutions', desc: 'Sales pipeline & workflow engines' },
    { label: 'Hospital Management', to: '/solutions/hospital-management', desc: 'OPD/IPD, lab & clinical EMR' },
    { label: 'Industries We Serve', to: '/industries', desc: '11 core industry verticals' },
    { label: 'Engagement Pricing', to: '/pricing', desc: 'Project & dedicated team models' },
  ],
  company: [
    { label: 'About Trust IT', to: '/about', desc: '12+ years journey & milestones' },
    { label: 'Leadership & Team', to: '/team', desc: 'Meet our 50+ engineering experts' },
    { label: 'Client Testimonials', to: '/testimonials', desc: 'Verified client outcomes' },
    { label: 'Open Careers', to: '/careers', desc: 'Join our Dhaka engineering center' },
    { label: 'Insights & Blog', to: '/blog', desc: 'Architecture & SEO guides' },
    { label: 'FAQ', to: '/faq', desc: 'Common project & SLA questions' },
  ],
};

export function PublicLayout() {
  const { settings } = useSiteSettings();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<keyof typeof megaMenus | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterStatus('loading');
    try {
      const res = await api.post<{ message: string }>('/newsletter', { email: newsletterEmail });
      setNewsletterStatus('success');
      setNewsletterMsg(res.message);
      setNewsletterEmail('');
    } catch (err: any) {
      setNewsletterStatus('error');
      setNewsletterMsg(err.message || 'Unable to subscribe right now.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Strict 3-Zone Single-Row Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-colors duration-200 ${
          scrolled
            ? 'bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs'
            : 'bg-white border-b border-slate-200/80'
        }`}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Official Brand Emblem + Wordmark */}
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-slate-950 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-blue-700 rounded"
          >
            <img
              src="/assets/aistudio/trust-it_2e09824d.jpg"
              alt="Trust IT — Social Media Solutions Logo"
              width={36}
              height={36}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-amber-500/60 shrink-0"
            />
            <span className="leading-none flex flex-col">
              <span>TRUST IT</span>
              <span className="text-[9px] font-semibold tracking-[0.14em] text-amber-700 uppercase mt-0.5">
                Social Media Solutions
              </span>
            </span>
          </Link>

          {/* Zone 2: 5 concise single-line navigation links */}
          <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setOpenMenu('services')}
                onClick={() => setOpenMenu(openMenu === 'services' ? null : 'services')}
                className="inline-flex items-center gap-1 py-2 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                aria-expanded={openMenu === 'services'}
              >
                <span>Services</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              </button>
            </div>

            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setOpenMenu('solutions')}
                onClick={() => setOpenMenu(openMenu === 'solutions' ? null : 'solutions')}
                className="inline-flex items-center gap-1 py-2 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                aria-expanded={openMenu === 'solutions'}
              >
                <span>Solutions</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              </button>
            </div>

            <Link
              to="/projects"
              onMouseEnter={() => setOpenMenu(null)}
              className="py-2 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0"
            >
              Portfolio
            </Link>

            <Link
              to="/case-studies"
              onMouseEnter={() => setOpenMenu(null)}
              className="py-2 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0"
            >
              Case Studies
            </Link>

            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setOpenMenu('company')}
                onClick={() => setOpenMenu(openMenu === 'company' ? null : 'company')}
                className="inline-flex items-center gap-1 py-2 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                aria-expanded={openMenu === 'company'}
              >
                <span>Company</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              </button>
            </div>
          </nav>

          {/* Zone 3: 1 Primary CTA on desktop + Mobile Menu Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0"
            >
              Get Started
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mega Menu Panel */}
        {openMenu && (
          <div className="hidden lg:block absolute left-0 right-0 top-16 bg-white border-b border-slate-200 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 gap-4">
              {megaMenus[openMenu].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpenMenu(null)}
                  className="p-3.5 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Slide Navigation */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white max-h-[80vh] overflow-y-auto px-6 py-5 space-y-5">
            <div className="grid grid-cols-2 gap-3 text-sm font-medium">
              <Link to="/" className="py-2 text-slate-800 hover:text-blue-700">Home</Link>
              <Link to="/about" className="py-2 text-slate-800 hover:text-blue-700">About Us</Link>
              <Link to="/services" className="py-2 text-slate-800 hover:text-blue-700">Services</Link>
              <Link to="/solutions" className="py-2 text-slate-800 hover:text-blue-700">Solutions</Link>
              <Link to="/industries" className="py-2 text-slate-800 hover:text-blue-700">Industries</Link>
              <Link to="/projects" className="py-2 text-slate-800 hover:text-blue-700">Portfolio</Link>
              <Link to="/case-studies" className="py-2 text-slate-800 hover:text-blue-700">Case Studies</Link>
              <Link to="/technologies" className="py-2 text-slate-800 hover:text-blue-700">Technologies</Link>
              <Link to="/team" className="py-2 text-slate-800 hover:text-blue-700">Team</Link>
              <Link to="/careers" className="py-2 text-slate-800 hover:text-blue-700">Careers</Link>
              <Link to="/blog" className="py-2 text-slate-800 hover:text-blue-700">Blog</Link>
              <Link to="/pricing" className="py-2 text-slate-800 hover:text-blue-700">Pricing</Link>
              <Link to="/faq" className="py-2 text-slate-800 hover:text-blue-700">FAQ</Link>
              <Link to="/search" className="py-2 text-slate-800 hover:text-blue-700 inline-flex items-center gap-1.5">
                <Search className="w-4 h-4" /> Search
              </Link>
            </div>
            <Link
              to="/contact"
              className="block w-full text-center px-4 py-3 text-sm font-semibold bg-blue-700 text-white rounded-lg"
            >
              Get a Free Consultation
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Enterprise Footer */}
      <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-slate-800/80">
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="inline-flex items-center gap-3 text-lg font-bold text-white">
                <img
                  src="/assets/aistudio/trust-it_2e09824d.jpg"
                  alt="Trust IT Logo"
                  width={42}
                  height={42}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-amber-500/60 shrink-0"
                />
                <span className="flex flex-col leading-none">
                  <span>TRUST IT</span>
                  <span className="text-[10px] font-semibold tracking-[0.14em] text-amber-400 uppercase mt-1">
                    Social Media Solutions
                  </span>
                </span>
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                {settings.tagline}. {settings.experienceYears}+ years delivering enterprise software, web platforms, cloud infrastructure, and digital solutions in Bangladesh and globally.
              </p>
              <form onSubmit={handleNewsletter} className="pt-2 space-y-2 max-w-sm">
                <label htmlFor="footer-newsletter" className="block text-xs font-medium text-slate-300">
                  Engineering & Strategy Newsletter
                </label>
                <div className="flex gap-2">
                  <input
                    id="footer-newsletter"
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="work@company.com"
                    className="flex-1 min-w-0 px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus === 'loading'}
                    className="px-4 py-2 text-xs font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
                  >
                    {newsletterStatus === 'loading' ? 'Joining...' : 'Subscribe'}
                  </button>
                </div>
                {newsletterMsg && (
                  <p className={`text-xs ${newsletterStatus === 'error' ? 'text-red-400' : 'text-sky-400'}`}>
                    {newsletterMsg}
                  </p>
                )}
              </form>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/team" className="hover:text-white transition-colors">Leadership & Team</Link></li>
                <li><Link to="/testimonials" className="hover:text-white transition-colors">Testimonials</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-white mb-4">Services</h3>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><Link to="/services/web-development" className="hover:text-white transition-colors">Web Development</Link></li>
                <li><Link to="/services/software-development" className="hover:text-white transition-colors">Software Development</Link></li>
                <li><Link to="/services/digital-marketing" className="hover:text-white transition-colors">Digital Marketing</Link></li>
                <li><Link to="/services/seo" className="hover:text-white transition-colors">SEO Services</Link></li>
                <li><Link to="/services/ecommerce-development" className="hover:text-white transition-colors">E-commerce Solutions</Link></li>
                <li><Link to="/services/cybersecurity" className="hover:text-white transition-colors">Cybersecurity</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-white mb-4">Solutions & Sectors</h3>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><Link to="/solutions/erp-solutions" className="hover:text-white transition-colors">ERP Solutions</Link></li>
                <li><Link to="/solutions/crm-solutions" className="hover:text-white transition-colors">CRM Solutions</Link></li>
                <li><Link to="/solutions/hospital-management" className="hover:text-white transition-colors">Hospital Management</Link></li>
                <li><Link to="/industries" className="hover:text-white transition-colors">Industries</Link></li>
                <li><Link to="/technologies" className="hover:text-white transition-colors">Technologies</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-white mb-4">Resources & Contact</h3>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><Link to="/projects" className="hover:text-white transition-colors">Portfolio</Link></li>
                <li><Link to="/case-studies" className="hover:text-white transition-colors">Case Studies</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog & Insights</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/search" className="hover:text-white transition-colors">Site Search</Link></li>
                <li className="pt-2 text-xs text-slate-400">{settings.phone}</li>
                <li className="text-xs text-slate-400">{settings.email}</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 {settings.companyName}. All Rights Reserved. · Banani, Dhaka, Bangladesh</p>
            <div className="flex flex-wrap items-center gap-5">
              <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="hover:text-slate-300 transition-colors">Terms & Conditions</Link>
              <Link to="/cookie-policy" className="hover:text-slate-300 transition-colors">Cookie Policy</Link>
              <Link to="/sitemap" className="hover:text-slate-300 transition-colors">Sitemap</Link>
              <Link to="/admin/login" className="hover:text-slate-300 transition-colors">Staff Portal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
