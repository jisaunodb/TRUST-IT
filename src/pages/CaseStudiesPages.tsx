import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { CtaSection, EmptyState, ErrorBanner, PageBanner, SkeletonGrid } from '../components/common/PagePrimitives';
import { SafeImage } from '../components/common/SafeImage';
import { useSeo } from '../hooks/useSeo';
import { api } from '../services/api';
import { CaseStudyItem, PaginatedResponse } from '../types';

export function CaseStudiesPage() {
  const [items, setItems] = useState<CaseStudyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSeo({
    title: 'Case Studies — Enterprise Software & Cloud Transformations | Trust IT',
    description:
      'In-depth case studies detailing how Trust IT solved complex retail, fintech, and healthcare technology challenges in Bangladesh.',
    canonicalPath: '/case-studies',
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<PaginatedResponse<CaseStudyItem>>('/case-studies?limit=50');
      setItems(res.items);
    } catch (err: any) {
      setError(err.message || 'Unable to load case studies.');
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
        eyebrow="Engineering Case Studies"
        title="How We Solve Complex Operational Bottlenecks"
        description="Deep architectural breakdowns from problem discovery and research through production rollout and measurable business impact."
        breadcrumbs={[{ label: 'Case Studies' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <SkeletonGrid count={3} cols={2} />
          ) : error ? (
            <ErrorBanner message={error} onRetry={load} />
          ) : (
            <div className="space-y-8">
              {items.map((cs) => (
                <Link
                  key={cs._id}
                  to={`/case-studies/${cs.slug}`}
                  className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-700/40 transition-colors grid grid-cols-1 lg:grid-cols-12 items-stretch"
                >
                  <div className="lg:col-span-5 min-h-[260px] bg-slate-900 overflow-hidden">
                    <SafeImage
                      src={cs.image?.secure_url}
                      alt={cs.image?.alt || cs.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                  <div className="lg:col-span-7 p-8 flex flex-col justify-between space-y-6">
                    <div>
                      <p className="text-xs text-slate-500 mb-2">
                        {cs.client} · {cs.industry}
                      </p>
                      <h2 className="text-2xl font-bold text-slate-950 group-hover:text-blue-700 transition-colors">
                        {cs.title}
                      </h2>
                      <p className="mt-3 text-sm text-slate-600 leading-relaxed">{cs.summary}</p>
                    </div>
                    <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-6">
                        {cs.metrics.map((m) => (
                          <div key={m.label}>
                            <p className="text-lg font-bold text-slate-950 tabular-nums">{m.value}</p>
                            <p className="text-xs text-slate-500">{m.label}</p>
                          </div>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700">
                        Read Case Study <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
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

export function CaseStudyDetailPage() {
  const { slug } = useParams();
  const [cs, setCs] = useState<CaseStudyItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSeo({
    title: `${cs?.title || 'Case Study'} | Trust IT`,
    description: cs?.summary || 'Enterprise digital transformation case study by Trust IT.',
    canonicalPath: `/case-studies/${slug}`,
  });

  useEffect(() => {
    setLoading(true);
    api
      .get<{ item: CaseStudyItem }>(`/case-studies/${slug}`)
      .then((res) => setCs(res.item))
      .catch((err: any) => setError(err.message || 'Case study not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <SkeletonGrid count={2} cols={2} />
      </div>
    );
  }

  if (error || !cs) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24">
        <EmptyState
          title="Case Study Not Found"
          description={error || 'The requested case study was not found.'}
          actionLabel="All Case Studies"
          actionTo="/case-studies"
        />
      </div>
    );
  }

  const sections = [
    { label: '01. Business Problem', body: cs.problem },
    { label: '02. Technical Challenge', body: cs.challenge },
    { label: '03. Discovery & Research', body: cs.research },
    { label: '04. Engineering Strategy', body: cs.strategy },
    { label: '05. Delivered Solution', body: cs.solution },
    { label: '06. Phased Implementation', body: cs.implementation },
  ];

  return (
    <div>
      <PageBanner
        eyebrow={`${cs.client} · ${cs.industry}`}
        title={cs.title}
        description={cs.summary}
        breadcrumbs={[{ label: 'Case Studies', to: '/case-studies' }, { label: cs.client }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-8 aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
              <SafeImage src={cs.image?.secure_url} alt={cs.image?.alt || cs.title} />
            </div>
            <div className="lg:col-span-4 bg-slate-950 text-white rounded-xl p-7 flex flex-col justify-between space-y-6">
              <div>
                <p className="text-xs font-semibold text-sky-400 mb-4">Quantified Impact</p>
                <div className="space-y-4">
                  {cs.metrics.map((m) => (
                    <div key={m.label} className="pb-3 border-b border-slate-800 last:border-none last:pb-0">
                      <p className="text-2xl font-bold tabular-nums">{m.value}</p>
                      <p className="text-xs text-slate-400">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Technology Stack</p>
                <p className="text-xs text-slate-200 leading-relaxed">{cs.technologies.join(' · ')}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((s) => (
              <div key={s.label} className="border border-slate-200 rounded-xl p-7 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-950 mb-3">{s.label}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-8 space-y-4">
              <h2 className="text-xl font-bold text-slate-950">Results & Business Impact</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{cs.businessImpact}</p>
              <ul className="space-y-2.5 pt-2">
                {cs.results.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-sm text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {cs.clientFeedback?.quote && (
              <div className="lg:col-span-5 bg-slate-950 text-white rounded-xl p-8 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-sky-400 mb-4">Client Feedback</p>
                  <p className="text-base text-slate-200 leading-relaxed">
                    &ldquo;{cs.clientFeedback.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800">
                  <p className="text-sm font-bold">{cs.clientFeedback.author}</p>
                  <p className="text-xs text-slate-400">{cs.clientFeedback.role}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
