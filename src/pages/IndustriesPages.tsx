import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { LucideIcon } from '../components/common/LucideIcon';
import { CtaSection, EmptyState, ErrorBanner, PageBanner, SkeletonGrid } from '../components/common/PagePrimitives';
import { SafeImage } from '../components/common/SafeImage';
import { useSeo } from '../hooks/useSeo';
import { api } from '../services/api';
import { IndustryItem, PaginatedResponse } from '../types';

export function IndustriesPage() {
  const [industries, setIndustries] = useState<IndustryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSeo({
    title: 'Industries We Serve — Healthcare, Finance, Retail, Education & More | Trust IT',
    description:
      'Discover how Trust IT engineers domain-specific software and cloud platforms across 11 key industries in Bangladesh and globally.',
    canonicalPath: '/industries',
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<PaginatedResponse<IndustryItem>>('/industries?limit=50');
      setIndustries(res.items);
    } catch (err: any) {
      setError(err.message || 'Unable to load industries.');
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
        eyebrow="Domain Expertise"
        title="Software Engineered for Industry Realities"
        description="Across 12+ years, we have mastered the operational, regulatory, and compliance requirements of 11 vital economic sectors."
        breadcrumbs={[{ label: 'Industries' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <SkeletonGrid count={6} />
          ) : error ? (
            <ErrorBanner message={error} onRetry={load} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industries.map((ind) => (
                <Link
                  key={ind._id}
                  to={`/industries/${ind.slug}`}
                  className="group bg-white border border-slate-200 rounded-xl p-7 hover:border-blue-700/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-blue-700 flex items-center justify-center mb-4">
                      <LucideIcon name={ind.icon} className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-950 group-hover:text-blue-700 transition-colors">
                      {ind.title}
                    </h2>
                    <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{ind.shortDescription}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                    <span className="text-slate-500 font-normal">
                      {ind.metrics[0] ? `${ind.metrics[0].label}: ${ind.metrics[0].value}` : 'Sector Solutions'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaSection />
    </div>
  );
}

export function IndustryDetailPage() {
  const { slug } = useParams();
  const [industry, setIndustry] = useState<IndustryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSeo({
    title: `${industry?.title || 'Industry'} IT Solutions | Trust IT Bangladesh`,
    description: industry?.shortDescription || 'Domain-focused IT solutions by Trust IT.',
    canonicalPath: `/industries/${slug}`,
  });

  useEffect(() => {
    setLoading(true);
    api
      .get<{ item: IndustryItem }>(`/industries/${slug}`)
      .then((res) => setIndustry(res.item))
      .catch((err: any) => setError(err.message || 'Industry not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <SkeletonGrid count={3} />
      </div>
    );
  }

  if (error || !industry) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24">
        <EmptyState
          title="Industry Not Found"
          description={error || 'The requested industry page does not exist.'}
          actionLabel="View All Industries"
          actionTo="/industries"
        />
      </div>
    );
  }

  return (
    <div>
      <PageBanner
        eyebrow="Industry Practice"
        title={`${industry.title} Technology Solutions`}
        description={industry.shortDescription}
        breadcrumbs={[{ label: 'Industries', to: '/industries' }, { label: industry.title }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-950 mb-3">Sector Overview</h2>
              <p className="text-slate-600 leading-relaxed">{industry.overview}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
                <h3 className="text-base font-bold text-slate-950 mb-4">Common Sector Challenges</h3>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  {industry.challenges.map((c) => (
                    <li key={c}>· {c}</li>
                  ))}
                </ul>
              </div>
              <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
                <h3 className="text-base font-bold text-slate-950 mb-4">How Trust IT Solves Them</h3>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  {industry.solutions.map((s) => (
                    <li key={s} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200">
              <SafeImage src={industry.image?.secure_url} alt={industry.title} />
            </div>

            {industry.metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {industry.metrics.map((m) => (
                  <div key={m.label} className="bg-slate-950 text-white rounded-xl p-5">
                    <p className="text-2xl font-bold tabular-nums">{m.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{m.label}</p>
                  </div>
                ))}
              </div>
            )}

            <Link
              to={`/contact?service=${encodeURIComponent(industry.title + ' Solutions')}`}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              Discuss Your {industry.title} Project
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
