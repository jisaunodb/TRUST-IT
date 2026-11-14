import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { LucideIcon } from '../components/common/LucideIcon';
import { CtaSection, EmptyState, ErrorBanner, PageBanner, SkeletonGrid } from '../components/common/PagePrimitives';
import { SafeImage } from '../components/common/SafeImage';
import { useSeo } from '../hooks/useSeo';
import { api } from '../services/api';
import { PaginatedResponse, SolutionItem } from '../types';

export function SolutionsPage() {
  const [solutions, setSolutions] = useState<SolutionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSeo({
    title: 'Business Software Solutions — ERP, CRM, HRMS, POS & Custom SaaS | Trust IT',
    description:
      'Explore 12 enterprise software solutions from Trust IT Bangladesh: ERP, CRM, HR Management, School, Hospital, Inventory, POS, and Custom SaaS.',
    canonicalPath: '/solutions',
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<PaginatedResponse<SolutionItem>>('/solutions?limit=50');
      setSolutions(res.items);
    } catch (err: any) {
      setError(err.message || 'Unable to load solutions.');
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
        eyebrow="Enterprise Product Suites"
        title="Configurable Business Solutions Built for Scale"
        description="Accelerate digital transformation with proven software suites tailored to Bangladeshi compliance, multi-branch operations, and local payments."
        breadcrumbs={[{ label: 'Solutions' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <SkeletonGrid count={6} />
          ) : error ? (
            <ErrorBanner message={error} onRetry={load} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solutions.map((sol) => (
                <Link
                  key={sol._id}
                  to={`/solutions/${sol.slug}`}
                  className="group bg-white border border-slate-200 rounded-xl p-7 hover:border-blue-700/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 text-blue-700 flex items-center justify-center">
                        <LucideIcon name={sol.icon} className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-slate-500">{sol.targetAudience[0]}</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-950 group-hover:text-blue-700 transition-colors">
                      {sol.title}
                    </h2>
                    <p className="mt-1 text-xs font-medium text-blue-700">{sol.tagline}</p>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">{sol.shortDescription}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                    <span className="text-slate-500 font-normal">{sol.modules.length} Core Modules</span>
                    <span className="inline-flex items-center gap-1">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </span>
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

export function SolutionDetailPage() {
  const { slug } = useParams();
  const [solution, setSolution] = useState<SolutionItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSeo({
    title: `${solution?.title || 'Solution'} | Trust IT Bangladesh`,
    description: solution?.shortDescription || 'Enterprise business software solution by Trust IT.',
    canonicalPath: `/solutions/${slug}`,
  });

  useEffect(() => {
    setLoading(true);
    api
      .get<{ item: SolutionItem }>(`/solutions/${slug}`)
      .then((res) => setSolution(res.item))
      .catch((err: any) => setError(err.message || 'Solution not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <SkeletonGrid count={3} />
      </div>
    );
  }

  if (error || !solution) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24">
        <EmptyState
          title="Solution Not Found"
          description={error || 'The requested solution page does not exist.'}
          actionLabel="Explore All Solutions"
          actionTo="/solutions"
        />
      </div>
    );
  }

  return (
    <div>
      <PageBanner
        eyebrow={solution.tagline}
        title={solution.title}
        description={solution.shortDescription}
        breadcrumbs={[{ label: 'Solutions', to: '/solutions' }, { label: solution.title }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-950 mb-4">Platform Architecture</h2>
              <p className="text-slate-600 leading-relaxed">{solution.detailedDescription}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-950 mb-4">Included Software Modules</h3>
              <div className="space-y-4">
                {solution.modules.map((mod) => (
                  <div key={mod.title} className="border border-slate-200 rounded-xl p-5 bg-slate-50">
                    <h4 className="text-base font-bold text-slate-950">{mod.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{mod.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-950 mb-4">Measurable Advantages</h3>
              <ul className="space-y-2.5">
                {solution.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
              <SafeImage src={solution.image?.secure_url} alt={solution.image?.alt || solution.title} />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-500">Designed For</p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {solution.targetAudience.join(' · ')}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Technology Foundation</p>
                <p className="text-sm text-slate-700 mt-1">{solution.technologies.join(' · ')}</p>
              </div>
              <Link
                to={`/contact?service=${encodeURIComponent(solution.title)}`}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                Book a Live Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
