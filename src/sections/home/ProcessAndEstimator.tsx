import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const processSteps = [
  {
    num: '01',
    title: 'Discover',
    duration: 'Week 1',
    summary: 'Stakeholder interviews, business workflow mapping, and legacy system audit.',
    deliverables: ['Technical Discovery Brief', 'Risk & Dependency Matrix', 'Success KPIs'],
  },
  {
    num: '02',
    title: 'Plan',
    duration: 'Week 1–2',
    summary: 'System architecture blueprint, database schema modeling, and sprint roadmap.',
    deliverables: ['Architecture Diagram', 'Milestone Schedule', 'Fixed or Dedicated Budget'],
  },
  {
    num: '03',
    title: 'Design',
    duration: 'Week 2–3',
    summary: 'Information architecture, accessible Figma wireframes, and reusable UI tokens.',
    deliverables: ['Interactive Prototype', 'WCAG Contrast Audit', 'Component System'],
  },
  {
    num: '04',
    title: 'Develop',
    duration: 'Sprints 1–N',
    summary: 'Clean TypeScript frontend, REST APIs, database indexing, and bi-weekly demos.',
    deliverables: ['Staging Previews', 'Automated Unit & API Tests', 'Peer-Reviewed PRs'],
  },
  {
    num: '05',
    title: 'Test',
    duration: 'Pre-Launch',
    summary: 'End-to-end QA, OWASP security checks, mobile 4G throttling, and load verification.',
    deliverables: ['QA Sign-Off Report', 'Security Hardening Checklist', 'Core Web Vitals Check'],
  },
  {
    num: '06',
    title: 'Launch',
    duration: 'Go-Live',
    summary: 'Zero-downtime cloud deployment, DNS/SSL verification, and team training.',
    deliverables: ['Production Cutover', 'Staff Onboarding Workshop', 'Runbook Handover'],
  },
  {
    num: '07',
    title: 'Support',
    duration: 'Ongoing SLA',
    summary: '24/7 uptime monitoring, automated backups, security patches, and iterative scaling.',
    deliverables: ['Monthly Health Report', 'Guaranteed SLA Response', 'Roadmap Enhancements'],
  },
];

const techCategories: Record<string, { name: string; role: string }[]> = {
  Frontend: [
    { name: 'Next.js', role: 'SSR, App Router & SEO' },
    { name: 'React', role: 'Component UI Architecture' },
    { name: 'TypeScript', role: 'End-to-End Type Safety' },
    { name: 'Tailwind CSS', role: 'Design System Styling' },
    { name: 'Vue', role: 'Progressive Web Interfaces' },
    { name: 'HTML / CSS', role: 'Semantic Accessible Markup' },
  ],
  Backend: [
    { name: 'Node.js', role: 'High-Throughput Runtime' },
    { name: 'Express.js', role: 'Modular REST APIs' },
    { name: 'Python', role: 'Automation & Data Pipelines' },
    { name: 'Laravel', role: 'Rapid Enterprise Backends' },
    { name: 'PHP', role: 'Legacy Modernization' },
  ],
  Database: [
    { name: 'MongoDB', role: 'Flexible Document Store' },
    { name: 'PostgreSQL', role: 'ACID Financial Ledgers' },
    { name: 'MySQL', role: 'Relational Web Workloads' },
    { name: 'Redis', role: 'Sub-ms Caching & Queues' },
  ],
  Cloud: [
    { name: 'AWS', role: 'ECS, RDS, S3 & CloudFront' },
    { name: 'Google Cloud', role: 'Cloud Run & BigQuery' },
    { name: 'Azure', role: 'Enterprise Active Directory' },
    { name: 'Cloudinary', role: 'Responsive Media CDN' },
  ],
  DevOps: [
    { name: 'Docker', role: 'Reproducible Containers' },
    { name: 'GitHub Actions', role: 'Automated CI/CD Pipelines' },
    { name: 'CI/CD', role: 'Zero-Downtime Rollouts' },
    { name: 'Linux', role: 'Hardened Server Operations' },
  ],
  Mobile: [
    { name: 'React Native', role: 'Shared iOS & Android Core' },
    { name: 'Flutter', role: 'High-FPS Native Interfaces' },
  ],
};

const recommendationMatrix: Record<
  string,
  { service: string; slug: string; timeline: string; stack: string; outcome: string }
> = {
  'growth-web': {
    service: 'Web Development & Technical SEO',
    slug: '/services/web-development',
    timeline: '5–8 Weeks',
    stack: 'Next.js, TypeScript, Node.js, Cloudinary',
    outcome: 'Fast, search-indexed digital presence engineered to convert B2B and retail traffic.',
  },
  'operations-erp': {
    service: 'Custom Software & ERP Solutions',
    slug: '/solutions/erp-solutions',
    timeline: '10–16 Weeks',
    stack: 'React, Node.js, MongoDB / PostgreSQL, Redis',
    outcome: 'Unified branch inventory, VAT-ready accounting, and automated management approvals.',
  },
  'commerce-scale': {
    service: 'Omnichannel E-commerce & POS',
    slug: '/services/ecommerce-development',
    timeline: '6–10 Weeks',
    stack: 'Next.js, Express, MongoDB, bKash/SSLCommerz, Courier APIs',
    outcome: 'Synchronized web and outlet inventory with automated Pathao/Steadfast dispatch.',
  },
  'cloud-security': {
    service: 'Cloud Modernization & Cybersecurity',
    slug: '/services/cloud-solutions',
    timeline: '4–8 Weeks',
    stack: 'AWS / GCP, Docker, Terraform, OWASP Hardening',
    outcome: '99.95% SLA uptime, automated backups, and 30–35% infrastructure cost efficiency.',
  },
};

export function InteractiveProcessSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = processSteps[activeIdx];

  return (
    <section className="py-20 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold text-blue-700 mb-2">Delivery Methodology</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 text-balance">
            How We Engineer Predictable Software Outcomes
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Every Trust IT engagement follows a transparent seven-stage lifecycle refined over 12+ years and 500+ production launches.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-8" role="tablist" aria-label="Software delivery process steps">
          {processSteps.map((step, idx) => {
            const active = idx === activeIdx;
            return (
              <button
                key={step.num}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveIdx(idx)}
                className={`text-left px-4 py-3.5 rounded-lg border transition-colors cursor-pointer ${
                  active
                    ? 'bg-slate-950 text-white border-slate-950'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className={`block font-mono text-xs tabular-nums ${active ? 'text-sky-400' : 'text-slate-400'}`}>
                  {step.num}
                </span>
                <span className="block text-sm font-semibold mt-0.5 whitespace-nowrap">{step.title}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-3 text-xs font-mono text-slate-500 tabular-nums">
              <span>Stage {current.num}</span>
              <span aria-hidden="true">·</span>
              <span>{current.duration}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-950">{current.title}</h3>
            <p className="text-slate-600 leading-relaxed">{current.summary}</p>
          </div>
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6">
            <p className="text-xs font-semibold text-slate-500 mb-3">Verified Stage Deliverables</p>
            <ul className="space-y-2.5">
              {current.deliverables.map((d) => (
                <li key={d} className="flex items-center gap-2.5 text-sm text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function InteractiveTechStackSection() {
  const categories = Object.keys(techCategories);
  const [selectedCat, setSelectedCat] = useState(categories[0]);

  return (
    <section className="py-20 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-sky-400 mb-2">Technology Expertise</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance">
              Modern, Battle-Tested Engineering Stack
            </h2>
          </div>
          <Link
            to="/technologies"
            className="inline-flex items-center gap-2 text-sm font-medium text-sky-400 hover:text-sky-300 whitespace-nowrap shrink-0"
          >
            View Full Stack Matrix
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-lg w-fit mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCat === cat
                  ? 'bg-blue-700 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {techCategories[selectedCat].map((tech) => (
            <div
              key={tech.name}
              className="bg-slate-900/90 border border-slate-800 rounded-lg p-5 flex items-center justify-between gap-4"
            >
              <div>
                <h3 className="text-base font-semibold text-white">{tech.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{tech.role}</p>
              </div>
              <span className="font-mono text-xs text-sky-400">{selectedCat}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SolutionRecommenderSection() {
  const [goal, setGoal] = useState<'growth-web' | 'operations-erp' | 'commerce-scale' | 'cloud-security'>('operations-erp');
  const [orgSize, setOrgSize] = useState<'Startup' | 'Growing SME' | 'Enterprise'>('Growing SME');
  const rec = recommendationMatrix[goal];

  const adjustedTimeline =
    orgSize === 'Enterprise' ? '12–20 Weeks (Phased Rollout)' : orgSize === 'Startup' ? '4–8 Weeks (Rapid Launch)' : rec.timeline;

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white border border-slate-200 rounded-xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <p className="text-xs font-semibold text-blue-700 mb-2">Interactive Architecture Advisor</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 text-balance">
                Find the Right Digital Solution for Your Stage
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Select your primary business priority and organization scale to preview our recommended architecture and timeline.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-700">1. Primary Objective</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'operations-erp', label: 'Automate ERP & Operations' },
                  { id: 'growth-web', label: 'Launch High-Speed Web & SEO' },
                  { id: 'commerce-scale', label: 'Scale Omnichannel E-commerce' },
                  { id: 'cloud-security', label: 'Modernize Cloud & Security' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setGoal(opt.id as any)}
                    className={`text-left px-4 py-3 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      goal === opt.id
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-700">2. Organization Scale</p>
              <div className="flex flex-wrap gap-2">
                {(['Startup', 'Growing SME', 'Enterprise'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setOrgSize(sz)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      orgSize === sz
                        ? 'bg-slate-950 text-white border-slate-950'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-950 text-white rounded-xl p-8 space-y-5">
            <p className="text-xs font-medium text-sky-400">Recommended Blueprint · {orgSize}</p>
            <h3 className="text-2xl font-bold tracking-tight">{rec.service}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{rec.outcome}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div>
                <p className="text-xs text-slate-400">Estimated Delivery</p>
                <p className="text-sm font-semibold text-white mt-1 tabular-nums">{adjustedTimeline}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Core Technologies</p>
                <p className="text-sm font-semibold text-white mt-1">{rec.stack}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to={`/contact?service=${encodeURIComponent(rec.service)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                Scope This Solution
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={rec.slug}
                className="inline-flex items-center px-5 py-2.5 text-sm font-semibold border border-slate-700 text-slate-200 rounded-lg hover:bg-slate-900 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
