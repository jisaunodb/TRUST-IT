import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ExternalLink, Search } from 'lucide-react';
import { CtaSection, EmptyState, ErrorBanner, PageBanner, SkeletonGrid } from '../components/common/PagePrimitives';
import { SafeImage } from '../components/common/SafeImage';
import { useSeo } from '../hooks/useSeo';
import { api } from '../services/api';
import { PaginatedResponse, ProjectItem } from '../types';

export function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');
  const [tech, setTech] = useState('All');
  const [search, setSearch] = useState('');

  useSeo({
    title: 'Portfolio & Delivered Projects — 500+ Digital Builds | Trust IT',
    description:
      'Browse enterprise software, fintech portals, omnichannel e-commerce ERPs, and healthcare cloud projects built by Trust IT.',
    canonicalPath: '/projects',
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<PaginatedResponse<ProjectItem>>('/projects?limit=100');
      setProjects(res.items);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects]
  );

  const technologies = useMemo(
    () => ['All', ...Array.from(new Set(projects.flatMap((p) => p.technologies))).slice(0, 10)],
    [projects]
  );

  const filtered = projects.filter((p) => {
    if (category !== 'All' && p.category !== category) return false;
    if (tech !== 'All' && !p.technologies.includes(tech)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.industry.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      <PageBanner
        eyebrow="Selected Work"
        title="Software & Digital Systems Built for Impact"
        description="Explore production web, ERP, fintech, healthcare, and logistics platforms engineered by Trust IT across Bangladesh and global markets."
        breadcrumbs={[{ label: 'Portfolio' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      category === cat
                        ? 'bg-slate-950 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative w-full lg:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects..."
                  aria-label="Search projects"
                  className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
              <span className="text-xs font-medium text-slate-500 mr-1">Technology:</span>
              {technologies.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTech(t)}
                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                    tech === t
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <SkeletonGrid count={6} />
          ) : error ? (
            <ErrorBanner message={error} onRetry={load} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No matching projects"
              description="Clear your active category or technology filter to see all delivered builds."
              onReset={() => {
                setCategory('All');
                setTech('All');
                setSearch('');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project.slug}`}
                  className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-700/40 transition-colors flex flex-col"
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
                        {project.category} · {project.industry} · {project.completedYear}
                      </p>
                      <h2 className="text-lg font-bold text-slate-950 group-hover:text-blue-700 transition-colors">
                        {project.title}
                      </h2>
                      <p className="mt-2 text-sm text-slate-600 line-clamp-2">{project.shortDescription}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                      <span className="text-slate-500 font-normal truncate pr-2">{project.client}</span>
                      <span className="inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                        View Project <ArrowRight className="w-3.5 h-3.5" />
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

export function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSeo({
    title: `${project?.title || 'Project'} | Trust IT Portfolio`,
    description: project?.shortDescription || 'Enterprise software project delivered by Trust IT.',
    canonicalPath: `/projects/${slug}`,
  });

  useEffect(() => {
    setLoading(true);
    api
      .get<{ item: ProjectItem }>(`/projects/${slug}`)
      .then((res) => setProject(res.item))
      .catch((err: any) => setError(err.message || 'Project not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <SkeletonGrid count={2} cols={2} />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24">
        <EmptyState
          title="Project Not Found"
          description={error || 'The requested project could not be located.'}
          actionLabel="View All Projects"
          actionTo="/projects"
        />
      </div>
    );
  }

  return (
    <div>
      <PageBanner
        eyebrow={`${project.client} · ${project.industry} · ${project.completedYear}`}
        title={project.title}
        description={project.shortDescription}
        breadcrumbs={[{ label: 'Portfolio', to: '/projects' }, { label: project.title }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
              <SafeImage src={project.image?.secure_url} alt={project.image?.alt || project.title} />
            </div>

            <div className="lg:col-span-5 space-y-6">
              {project.metrics && project.metrics.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="bg-slate-950 text-white rounded-xl p-4">
                      <p className="text-xl font-bold tabular-nums">{m.value}</p>
                      <p className="text-xs text-slate-400 mt-1">{m.label}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
                <div>
                  <p className="text-xs text-slate-500">Client</p>
                  <p className="text-sm font-semibold text-slate-950">{project.client}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Category & Industry</p>
                  <p className="text-sm font-semibold text-slate-950">
                    {project.category} · {project.industry}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Technology Stack</p>
                  <p className="text-sm text-slate-700 mt-0.5">{project.technologies.join(' · ')}</p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                    >
                      Live Overview <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <Link
                    to={`/contact?service=${encodeURIComponent(project.category)}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border border-slate-300 text-slate-800 rounded-lg hover:bg-white"
                  >
                    Build Similar System
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-950 mb-3">Project Context</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{project.description}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-950 mb-3">Engineering Challenge</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{project.challenge}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-950 mb-3">Delivered Solution</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{project.solution}</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8">
            <h2 className="text-xl font-bold text-slate-950 mb-4">Verified Business Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {project.results.map((r) => (
                <div key={r} className="flex items-start gap-2.5 text-sm text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
