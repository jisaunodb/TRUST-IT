import { ReactNode } from 'react';
import { AlertCircle, ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function PageBanner({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: ReactNode;
}) {
  return (
    <section className="bg-slate-950 text-white border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            {breadcrumbs.map((b, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
                {b.to ? (
                  <Link to={b.to} className="hover:text-white transition-colors">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-slate-200">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <p className="text-xs font-medium text-sky-400 tracking-wide mb-3">{eyebrow}</p>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white max-w-3xl text-balance">
          {title}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          {description}
        </p>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}

export function SkeletonGrid({ count = 6, cols = 3 }: { count?: number; cols?: 2 | 3 }) {
  const gridClass = cols === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  return (
    <div className={`grid ${gridClass} gap-6`} aria-busy="true" aria-label="Loading content">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 animate-pulse space-y-4">
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-6 w-3/4 bg-slate-200 rounded" />
          <div className="space-y-2">
            <div className="h-3.5 w-full bg-slate-100 rounded" />
            <div className="h-3.5 w-5/6 bg-slate-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
  onReset,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onReset?: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-lg mx-auto">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-5 px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Clear Filters
        </button>
      )}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center gap-2 mt-5 px-4 py-2 text-sm font-medium bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          {actionLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="bg-red-50 border border-red-200 text-red-900 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold">Unable to load data</p>
          <p className="text-sm text-red-700 mt-0.5">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-xs font-medium bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function CtaSection() {
  return (
    <section className="bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-sky-400 mb-3">12+ Years of Engineering Delivery</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance">
            Have an idea? Let&apos;s build it together.
          </h2>
          <p className="mt-4 text-slate-300 text-base leading-relaxed">
            Speak directly with a Trust IT principal architect in Dhaka to scope your software, web, or cloud roadmap.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0"
          >
            Start a Project
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact?intent=expert"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border border-slate-700 text-slate-100 rounded-lg hover:bg-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Talk to an Expert
          </Link>
        </div>
      </div>
    </section>
  );
}
