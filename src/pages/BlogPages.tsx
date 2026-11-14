import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { CtaSection, EmptyState, ErrorBanner, PageBanner, SkeletonGrid } from '../components/common/PagePrimitives';
import { SafeImage } from '../components/common/SafeImage';
import { useSeo } from '../hooks/useSeo';
import { api } from '../services/api';
import { BlogPostItem, PaginatedResponse } from '../types';

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useSeo({
    title: 'Engineering Blog & Technology Insights | Trust IT Bangladesh',
    description:
      'Articles on Next.js web architecture, cloud cost control, cybersecurity, custom ERP, and technical SEO from Trust IT engineers.',
    canonicalPath: '/blog',
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<PaginatedResponse<BlogPostItem>>('/blog?limit=100');
      setPosts(res.items);
    } catch (err: any) {
      setError(err.message || 'Failed to load blog posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(posts.map((p) => p.category)))],
    [posts]
  );

  const filtered = posts.filter((p) => {
    if (category !== 'All' && p.category !== category) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div>
      <PageBanner
        eyebrow="Engineering & Strategy Blog"
        title="Insights From 12+ Years of Software Delivery"
        description="Technical guides, architecture decisions, and digital growth strategies written by Trust IT’s principal engineers and designers."
        breadcrumbs={[{ label: 'Blog' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    category === c ? 'bg-slate-950 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                aria-label="Search articles"
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          {loading ? (
            <SkeletonGrid count={6} />
          ) : error ? (
            <ErrorBanner message={error} onRetry={load} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No matching articles"
              description="Clear your search or category filter to read all published insights."
              onReset={() => {
                setCategory('All');
                setSearch('');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <Link
                  key={post._id}
                  to={`/blog/${post.slug}`}
                  className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-700/40 transition-colors flex flex-col"
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
                        {post.category} · {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {post.readingTime}
                      </p>
                      <h2 className="text-lg font-bold text-slate-950 group-hover:text-blue-700 transition-colors leading-snug">
                        {post.title}
                      </h2>
                      <p className="mt-2.5 text-sm text-slate-600 line-clamp-3">{post.excerpt}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{post.author}</span>
                      <span className="font-semibold text-blue-700 inline-flex items-center gap-1">
                        Read <ArrowRight className="w-3.5 h-3.5" />
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

export function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostItem | null>(null);
  const [related, setRelated] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSeo({
    title: post?.seoTitle || `${post?.title || 'Article'} | Trust IT Blog`,
    description: post?.seoDescription || post?.excerpt || 'Engineering insights from Trust IT.',
    canonicalPath: `/blog/${slug}`,
    schema: post
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          author: { '@type': 'Person', name: post.author },
          publisher: { '@type': 'Organization', name: 'Trust IT' },
        }
      : undefined,
  });

  useEffect(() => {
    setLoading(true);
    api
      .get<{ item: BlogPostItem }>(`/blog/${slug}`)
      .then((res) => {
        setPost(res.item);
        return api.get<PaginatedResponse<BlogPostItem>>(`/blog?limit=4`);
      })
      .then((list) => {
        setRelated(list.items.filter((p) => p.slug !== slug).slice(0, 3));
      })
      .catch((err: any) => setError(err.message || 'Article not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20">
        <SkeletonGrid count={2} cols={2} />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24">
        <EmptyState
          title="Article Not Found"
          description={error || 'This article is unavailable.'}
          actionLabel="Back to Blog"
          actionTo="/blog"
        />
      </div>
    );
  }

  const paragraphs = post.content.split('\n\n').filter(Boolean);

  return (
    <div>
      <PageBanner
        eyebrow={`${post.category} · ${post.readingTime}`}
        title={post.title}
        description={post.excerpt}
        breadcrumbs={[{ label: 'Blog', to: '/blog' }, { label: post.category }]}
      />

      <article className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 text-sm text-slate-600">
            <div>
              <p className="font-bold text-slate-950">{post.author}</p>
              <p className="text-xs text-slate-500">{post.authorRole}</p>
            </div>
            <p className="text-xs text-slate-500">
              Published {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
            <SafeImage src={post.featuredImage?.secure_url} alt={post.featuredImage?.alt || post.title} />
          </div>

          <div className="space-y-5 text-slate-700 leading-relaxed text-base">
            {paragraphs.map((block, i) => {
              if (block.startsWith('## ')) {
                return (
                  <h2 key={i} className="text-2xl font-bold text-slate-950 pt-4">
                    {block.replace(/^##\s+/, '')}
                  </h2>
                );
              }
              if (block.startsWith('### ')) {
                return (
                  <h3 key={i} className="text-xl font-bold text-slate-950 pt-3">
                    {block.replace(/^###\s+/, '')}
                  </h3>
                );
              }
              if (block.startsWith('- ')) {
                const lines = block.split('\n').map((l) => l.replace(/^-\s+/, ''));
                return (
                  <ul key={i} className="list-disc pl-6 space-y-2">
                    {lines.map((l, idx) => (
                      <li key={idx}>{l}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={i}>{block}</p>;
            })}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-200 text-xs text-slate-500">
              Topics: <span className="text-slate-800 font-medium">{post.tags.join(' · ')}</span>
            </div>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-slate-950 mb-8">Related Engineering Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r._id}
                  to={`/blog/${r.slug}`}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-700/40 transition-colors"
                >
                  <p className="text-xs text-slate-500 mb-2">
                    {r.category} · {r.readingTime}
                  </p>
                  <h3 className="text-base font-bold text-slate-950">{r.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection />
    </div>
  );
}
