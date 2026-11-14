import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Compass,
  RotateCcw,
  Search,
  ShoppingBag,
  Target,
  TrendingUp,
} from 'lucide-react';
import { ServiceItem } from '../../types';

interface QuizAnswers {
  businessType: string;
  goal: string;
  hasWebsite: string;
  runsAds: string;
  needsAutomation: string;
  timeline: string;
}

interface RecommendationResult {
  slug: string;
  title: string;
  reason: string;
}

export function ServiceRecommenderQuiz({ services }: { services: ServiceItem[] }) {
  const [answers, setAnswers] = useState<QuizAnswers>({
    businessType: 'sme',
    goal: 'leads',
    hasWebsite: 'outdated',
    runsAds: 'boost-only',
    needsAutomation: 'partial',
    timeline: '1-3months',
  });
  const [submitted, setSubmitted] = useState(false);

  const computeRecommendations = (): RecommendationResult[] => {
    const recs: RecommendationResult[] = [];

    if (answers.hasWebsite === 'none' || answers.hasWebsite === 'outdated' || answers.goal === 'website') {
      if (answers.businessType === 'ecommerce') {
        recs.push({
          slug: 'ecommerce-development',
          title: 'E-commerce Solutions',
          reason: 'A fast storefront with bKash, SSLCommerz, and courier automation removes checkout friction and boosts completed orders.',
        });
      } else {
        recs.push({
          slug: 'web-development',
          title: 'Web Development',
          reason: 'Upgrade to an SEO-engineered, mobile-first Next.js platform built for credibility, speed, and inquiry conversion.',
        });
      }
    }

    if (answers.goal === 'leads' || answers.runsAds === 'boost-only' || answers.runsAds === 'none') {
      recs.push({
        slug: 'digital-marketing',
        title: 'Digital Marketing',
        reason: 'Replace ad-hoc post boosting with structured Meta Ads, Google Ads, Pixel tracking, and conversion-tested lead funnels.',
      });
    }

    if (answers.goal === 'traffic' || answers.goal === 'leads') {
      recs.push({
        slug: 'seo',
        title: 'SEO',
        reason: 'Capture compounding high-intent organic Google search traffic in Dhaka and Bangladesh without permanent ad spend reliance.',
      });
    }

    if (answers.needsAutomation === 'yes' || answers.businessType === 'enterprise') {
      recs.push({
        slug: 'business-enterprise-solutions',
        title: 'Business & Enterprise Solutions',
        reason: 'Centralize inventory, accounting, HR, and approvals into a unified ERP/CRM architecture tailored for your operations.',
      });
    }

    if (answers.goal === 'mobile') {
      recs.push({
        slug: 'mobile-app-development',
        title: 'Mobile App Development',
        reason: 'Launch cross-platform Android and iOS apps powered by unified APIs and secure payment gateways.',
      });
    }

    if (answers.goal === 'security') {
      recs.push({
        slug: 'cybersecurity',
        title: 'Cybersecurity',
        reason: 'Conduct a thorough OWASP security review, harden APIs/authentication, and establish automated encrypted backups.',
      });
    }

    if (recs.length === 0) {
      recs.push({
        slug: 'it-consulting-support',
        title: 'IT Consulting & Support',
        reason: 'Start with an architectural audit and clear 6-month digital roadmap tailored to your exact business constraints.',
      });
    }

    return recs.slice(0, 3).map((r) => {
      const matched = services.find((s) => s.slug === r.slug);
      return matched ? { ...r, title: matched.title } : r;
    });
  };

  const recommendations = computeRecommendations();

  return (
    <section className="py-20 bg-white border-t border-slate-200" id="service-finder">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-semibold text-blue-700 inline-flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Interactive Service Finder
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 text-balance">
              Which Service Does Your Business Need?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Answer six quick operational questions and receive an immediate recommendation mapped to Trust IT’s engineering, design, SEO, and growth practices.
            </p>
            <div className="pt-2 space-y-2.5 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Tailored to startups, SMEs, e-commerce, and enterprises in Bangladesh</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Direct transition to custom consultation with pre-selected scope</span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8">
            {!submitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="q-btype" className="block text-xs font-semibold text-slate-800 mb-1.5">
                      1. Business Type
                    </label>
                    <select
                      id="q-btype"
                      value={answers.businessType}
                      onChange={(e) => setAnswers({ ...answers, businessType: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    >
                      <option value="startup">Startup / New Venture</option>
                      <option value="sme">Growing SME / Service Business</option>
                      <option value="ecommerce">Retail / E-commerce Brand</option>
                      <option value="enterprise">Large Enterprise / Institution</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="q-goal" className="block text-xs font-semibold text-slate-800 mb-1.5">
                      2. Primary 6-Month Goal
                    </label>
                    <select
                      id="q-goal"
                      value={answers.goal}
                      onChange={(e) => setAnswers({ ...answers, goal: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    >
                      <option value="leads">Generate Qualified Leads & Sales</option>
                      <option value="website">Launch or Rebuild Modern Website</option>
                      <option value="traffic">Rank Higher on Google (SEO)</option>
                      <option value="mobile">Launch Android / iOS Mobile App</option>
                      <option value="security">Audit Security & Cloud Uptime</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="q-web" className="block text-xs font-semibold text-slate-800 mb-1.5">
                      3. Current Website / Platform State
                    </label>
                    <select
                      id="q-web"
                      value={answers.hasWebsite}
                      onChange={(e) => setAnswers({ ...answers, hasWebsite: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    >
                      <option value="none">No website yet</option>
                      <option value="outdated">Slow or outdated website</option>
                      <option value="modern">Modern website, needs more traffic</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="q-ads" className="block text-xs font-semibold text-slate-800 mb-1.5">
                      4. Digital Marketing & Ads Usage
                    </label>
                    <select
                      id="q-ads"
                      value={answers.runsAds}
                      onChange={(e) => setAnswers({ ...answers, runsAds: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    >
                      <option value="none">Not running ads yet</option>
                      <option value="boost-only">Only using basic Facebook Boost</option>
                      <option value="managed">Running Meta/Google Ads, want better ROAS</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="q-auto" className="block text-xs font-semibold text-slate-800 mb-1.5">
                      5. Need Internal Software / ERP Automation?
                    </label>
                    <select
                      id="q-auto"
                      value={answers.needsAutomation}
                      onChange={(e) => setAnswers({ ...answers, needsAutomation: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    >
                      <option value="no">Not right now</option>
                      <option value="partial">Need CRM / Lead / Inventory tracking</option>
                      <option value="yes">Yes — full custom software or ERP needed</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="q-time" className="block text-xs font-semibold text-slate-800 mb-1.5">
                      6. Target Launch Window
                    </label>
                    <select
                      id="q-time"
                      value={answers.timeline}
                      onChange={(e) => setAnswers({ ...answers, timeline: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    >
                      <option value="immediate">Immediately (Within 2–4 weeks)</option>
                      <option value="1-3months">1 – 3 Months</option>
                      <option value="3plus">3+ Months Enterprise Rollout</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
                  >
                    <span>Show Recommended Services</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <p className="text-xs font-semibold text-blue-700">Recommended Roadmap</p>
                    <h3 className="text-lg font-bold text-slate-950">Best-Fit Trust IT Services</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Adjust Answers
                  </button>
                </div>

                <div className="space-y-3">
                  {recommendations.map((rec, idx) => (
                    <div
                      key={rec.slug}
                      className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-mono font-semibold text-blue-700">Priority 0{idx + 1}</p>
                        <h4 className="text-base font-bold text-slate-950">{rec.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{rec.reason}</p>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                        <Link
                          to={`/services/${rec.slug}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-950 text-white rounded-lg hover:bg-slate-800 whitespace-nowrap"
                        >
                          Learn More <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/contact?service=${encodeURIComponent(rec.title)}`}
                          className="text-xs font-semibold text-blue-700 hover:underline whitespace-nowrap"
                        >
                          Request Proposal
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const funnelStages = [
  { step: '01', name: 'Awareness', detail: 'Meta Reels, YouTube video & brand reach across Dhaka and target regions' },
  { step: '02', name: 'Engagement', detail: 'Educational posts, interactive carousels, and trust-building creatives' },
  { step: '03', name: 'Traffic', detail: 'High-intent Google Search Ads & targeted social clicks to fast landing pages' },
  { step: '04', name: 'Leads', detail: 'Conversion-focused Lead Forms, WhatsApp routing & CRM capture' },
  { step: '05', name: 'Conversions', detail: 'Retargeting warm audiences to complete purchases or booked consultations' },
  { step: '06', name: 'Customer Retention', detail: 'Email automation, lookalike expansion & repeat-purchase campaigns' },
];

const sampleCampaignMetrics = [
  { label: 'Reach', value: '485,200', note: 'Target audience impressions' },
  { label: 'Engagement', value: '28,450', note: 'Saves, shares & comments' },
  { label: 'CTR', value: '3.18%', note: 'Above regional baseline' },
  { label: 'CPC', value: '৳6.40', note: 'Cost per qualified click' },
  { label: 'Leads', value: '642', note: 'CRM-verified inquiries' },
  { label: 'Conversions', value: '118', note: 'Closed orders / deals' },
  { label: 'ROAS', value: '4.6x', note: 'Attributed ad return' },
];

export function DigitalMarketingShowcase() {
  return (
    <section className="py-16 bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Funnel Architecture */}
        <div>
          <div className="max-w-3xl mb-8">
            <p className="text-xs font-semibold text-sky-400 mb-2 inline-flex items-center gap-1.5">
              <Target className="w-4 h-4" /> Full-Funnel Growth Methodology
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              From Meta Ads & Strategic Facebook Boosting to Measurable Revenue
            </h2>
            <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
              We never treat social boosting as a standalone button click. Every campaign operates inside a structured conversion funnel backed by Meta Pixel, Conversion API (CAPI), and Google Analytics 4.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {funnelStages.map((stage) => (
              <div key={stage.step} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs text-sky-400 tabular-nums">{stage.step}.</span>
                  <h3 className="text-sm font-bold text-white mt-1.5">{stage.name}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{stage.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Campaign Reporting UI */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white inline-flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-sky-400" />
                Sample Campaign Metrics Reporting View
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Illustrative sample dashboard layout provided in monthly client reports — figures shown are example benchmarks, not guaranteed outcomes.
              </p>
            </div>
            <span className="text-xs font-mono text-sky-400 shrink-0">
              Sample Reporting Preview
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {sampleCampaignMetrics.map((m) => (
              <div key={m.label} className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <p className="text-xs text-slate-400">{m.label}</p>
                <p className="text-xl font-bold text-white tabular-nums mt-1">{m.value}</p>
                <p className="text-[11px] text-slate-500 mt-1">{m.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const seoPipeline = [
  { step: '01', name: 'Audit', detail: 'Crawl diagnostics, Core Web Vitals, broken links & indexability checks' },
  { step: '02', name: 'Strategy', detail: 'High-intent Bangladeshi & global keyword mapping by buyer journey' },
  { step: '03', name: 'Optimization', detail: 'Title tags, H1-H3 hierarchy, Schema.org JSON-LD & internal links' },
  { step: '04', name: 'Content', detail: 'Authoritative service guides, comparison pages & E-E-A-T editorial briefs' },
  { step: '05', name: 'Authority', detail: 'Ethical digital PR, local Dhaka citations & editorial backlink outreach' },
  { step: '06', name: 'Monitoring', detail: 'Google Search Console & GA4 tracking for impressions, clicks & leads' },
  { step: '07', name: 'Growth', detail: 'Quarterly content refreshes & conversion optimization on ranking pages' },
];

const sampleSeoMetrics = [
  { label: 'Organic Traffic', value: '+142%', note: 'Sample 6-mo YoY baseline' },
  { label: 'Keyword Growth', value: '86 Terms', note: 'Target page-1 commercial terms' },
  { label: 'Click-Through Rate', value: '4.8%', note: 'Snippet & schema uplift' },
  { label: 'Domain Authority', value: '38 → 51', note: 'White-hat editorial growth' },
  { label: 'Conversions', value: '310 Leads', note: 'Tracked organic form/call goals' },
];

export function SeoShowcase() {
  return (
    <section className="py-16 bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div>
          <div className="max-w-3xl mb-8">
            <p className="text-xs font-semibold text-sky-400 mb-2 inline-flex items-center gap-1.5">
              <Search className="w-4 h-4" /> Sustainable Organic Search Engineering
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Seven-Stage White-Hat SEO Growth Process
            </h2>
            <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
              Ethical SEO compounds over time without spam links or algorithmic risk. We align clean technical architecture with search intent—never making unrealistic overnight ranking guarantees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {seoPipeline.map((stage) => (
              <div key={stage.step} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <span className="font-mono text-xs text-sky-400 tabular-nums">{stage.step}.</span>
                <h3 className="text-sm font-bold text-white mt-1.5">{stage.name}</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{stage.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white inline-flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-sky-400" />
                Sample SEO Audit & Search Reporting UI
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Illustrative sample dashboard from our monthly Search Console reporting — example metrics only; organic search growth depends on competition and site history.
              </p>
            </div>
            <span className="text-xs font-mono text-sky-400 shrink-0">
              Sample Audit Preview
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {sampleSeoMetrics.map((m) => (
              <div key={m.label} className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <p className="text-xs text-slate-400">{m.label}</p>
                <p className="text-xl font-bold text-white tabular-nums mt-1">{m.value}</p>
                <p className="text-[11px] text-slate-500 mt-1">{m.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const ecommerceLifecycle = [
  { step: '01', title: 'Store & Catalog Architecture', desc: 'SKU variants, multi-warehouse stock logic, and fast faceted filtering.' },
  { step: '02', title: 'High-Conversion Storefront UX', desc: 'Mobile-first product galleries, trust badges, and friction-free cart drawers.' },
  { step: '03', title: 'Local & Global Payment Integration', desc: 'bKash, Nagad, SSLCommerz, Cash on Delivery & international Visa/Mastercard.' },
  { step: '04', title: 'Courier & ERP Order Sync', desc: 'Automated Pathao, Steadfast, and RedX waybill generation + SMS tracking.' },
  { step: '05', title: 'Flash-Sale Speed & SEO Setup', desc: 'Image compression, CDN edge caching & structured Product JSON-LD markup.' },
  { step: '06', title: 'Retention, Pixel & Growth Loops', desc: 'Meta CAPI purchase events, abandoned cart recovery & loyalty points.' },
];

export function EcommerceLifecycleShowcase() {
  return (
    <section className="py-16 bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold text-sky-400 mb-2 inline-flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4" /> End-to-End Commerce Engineering
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            E-commerce Development & Conversion Lifecycle
          </h2>
          <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
            Built for Bangladeshi consumer behavior—fast mobile checkout, bKash/SSLCommerz reliability, and real-time courier dispatch automation during peak Eid and seasonal campaigns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ecommerceLifecycle.map((item) => (
            <div key={item.step} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <span className="font-mono text-xs text-sky-400 tabular-nums">{item.step}.</span>
              <h3 className="text-base font-bold text-white mt-2">{item.title}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
