import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CtaSection, PageBanner } from '../components/common/PagePrimitives';
import { SafeImage } from '../components/common/SafeImage';
import { useSeo } from '../hooks/useSeo';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { api } from '../services/api';
import { PaginatedResponse, TeamMemberItem } from '../types';

const milestones = [
  { year: '2020', title: 'Founded in Dhaka', detail: 'Started as a 6-engineer web and custom software studio delivering corporate systems in Dhaka.' },
  { year: '2021', title: 'Enterprise ERP & Retail Practice', detail: 'Launched our multi-branch inventory and POS suite serving nationwide retail chains.' },
  { year: '2023', title: 'Cloud & DevOps Expansion', detail: 'Established dedicated AWS/GCP infrastructure, CI/CD automation, and 24/7 SLA monitoring.' },
  { year: '2024', title: '300+ Active Clients & Global Delivery', detail: 'Expanded engineering partnerships to the UK, Middle East, and Southeast Asia.' },
  { year: '2026', title: '50+ Engineers & 500+ Projects', detail: 'Operating as a full-spectrum Bangladeshi enterprise IT partner across 11 core industries.' },
];

const coreValues = [
  { title: 'Engineering Integrity', desc: 'We write maintainable, documented systems and never cut corners on security or automated testing.' },
  { title: 'Transparent Delivery', desc: 'Clear sprint milestones, honest timelines, and direct communication with senior architects.' },
  { title: 'Long-Term Stewardship', desc: 'Our client relationships span years—we stay accountable well beyond initial deployment.' },
  { title: 'Practical Innovation', desc: 'We choose proven, scalable technologies tailored to real business ROI rather than hype.' },
];

export function AboutPage() {
  const { settings } = useSiteSettings();
  const [leadership, setLeadership] = useState<TeamMemberItem[]>([]);

  useSeo({
    title: 'About Trust IT — 6+ Years of Software & IT Excellence in Bangladesh',
    description:
      'Learn about Trust IT’s 6+ year journey in Dhaka, Bangladesh—our mission, leadership team, milestones, and commitment to reliable enterprise software.',
    canonicalPath: '/about',
  });

  useEffect(() => {
    api
      .get<PaginatedResponse<TeamMemberItem>>('/team?limit=6')
      .then((res) => setLeadership(res.items.filter((m) => m.isLeadership).slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div>
      <PageBanner
        eyebrow="About Trust IT"
        title="6+ Years of Turning Ideas Into Reliable Digital Solutions"
        description="Founded in Dhaka in 2020, Trust IT is an established Bangladeshi IT company delivering enterprise software, web platforms, cloud infrastructure, and cybersecurity."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-6 space-y-5 flex flex-col justify-center">
            <p className="text-xs font-semibold text-blue-700">Our Story</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
              Built in Bangladesh for Organizations That Cannot Afford Fragile Software
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We started Trust IT with a clear conviction: Bangladeshi businesses deserve software engineered with the same architectural rigor, security discipline, and long-term accountability found in top global technology firms.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Over the past {settings.experienceYears}+ years, our team has grown to {settings.stats.professionals}+ engineers, designers, cloud architects, and QA specialists—delivering {settings.stats.projectsCompleted}+ projects for {settings.stats.happyClients}+ clients across Bangladesh and international markets.
            </p>
          </div>
          <div className="lg:col-span-6 min-h-[300px]">
            <div className="h-full rounded-xl overflow-hidden border border-slate-200">
              <SafeImage
                src="/src/assets/images/about_team_office_1794679591380.jpg"
                alt="Trust IT Leadership Planning Session in Dhaka"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 rounded-xl p-8">
            <p className="text-xs font-semibold text-blue-700 mb-2">Our Mission</p>
            <h3 className="text-xl font-bold text-slate-950 mb-3">
              Empower Growth Through Dependable Technology
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To design, build, and support secure web, software, and cloud systems that eliminate operational friction and create measurable competitive advantage for our clients.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-8">
            <p className="text-xs font-semibold text-blue-700 mb-2">Our Vision</p>
            <h3 className="text-xl font-bold text-slate-950 mb-3">
              Bangladesh&apos;s Most Trusted Long-Term Engineering Partner
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To set the regional benchmark for enterprise software reliability, transparent governance, and engineering craft across South Asia and global partner markets.
            </p>
          </div>
        </div>
      </section>

      {/* 6+ Years Visual Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold text-blue-700 mb-2">Company Milestones</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">Our 6+ Year Journey</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {milestones.map((m) => (
              <div key={m.year} className="border border-slate-200 rounded-xl p-6 bg-slate-50 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-2xl font-bold text-blue-700 tabular-nums">{m.year}</span>
                  <h3 className="text-base font-bold text-slate-950 mt-3">{m.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{m.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold text-sky-400 mb-2">How We Operate</p>
            <h2 className="text-3xl font-bold tracking-tight">Core Engineering Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((v, i) => (
              <div key={v.title} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <p className="font-mono text-xs text-sky-400 mb-3">0{i + 1}.</p>
                <h3 className="text-lg font-bold text-white">{v.title}</h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Certifications */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-semibold text-blue-700 mb-2">Executive Leadership</p>
                <h2 className="text-3xl font-bold tracking-tight text-slate-950">Guided by Hands-On Architects</h2>
              </div>
              <Link to="/team" className="text-sm font-semibold text-blue-700 inline-flex items-center gap-1.5">
                Meet Full Team <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {leadership.map((m) => (
                <div key={m._id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <div className="aspect-square bg-slate-200">
                    <SafeImage src={m.image?.secure_url} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-950">{m.name}</h3>
                    <p className="text-xs font-semibold text-blue-700 mt-0.5">{m.position}</p>
                    <p className="text-sm text-slate-600 mt-3">{m.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
              <Award className="w-6 h-6 text-blue-700 mb-3" />
              <h3 className="text-base font-bold text-slate-950">BASIS & Cloud Partner Ecosystem</h3>
              <p className="text-sm text-slate-600 mt-1.5">
                Aligned with national software industry standards and AWS/Google Cloud partner best practices (Placeholder Certification).
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
              <ShieldCheck className="w-6 h-6 text-blue-700 mb-3" />
              <h3 className="text-base font-bold text-slate-950">ISO 27001 & OWASP Aligned Workflows</h3>
              <p className="text-sm text-slate-600 mt-1.5">
                Structured access control, encrypted backups, and pre-release vulnerability verification across client systems.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
              <CheckCircle2 className="w-6 h-6 text-blue-700 mb-3" />
              <h3 className="text-base font-bold text-slate-950">98% Client Retention Over 6+ Years</h3>
              <p className="text-sm text-slate-600 mt-1.5">
                Long-term retainers and repeat modernization mandates from leading Bangladeshi enterprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
