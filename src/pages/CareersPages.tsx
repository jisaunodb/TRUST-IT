import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Upload } from 'lucide-react';
import { CtaSection, EmptyState, ErrorBanner, PageBanner, SkeletonGrid } from '../components/common/PagePrimitives';
import { useSeo } from '../hooks/useSeo';
import { api } from '../services/api';
import { CareerItem, PaginatedResponse } from '../types';

export function CareersPage() {
  const [jobs, setJobs] = useState<CareerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSeo({
    title: 'Careers at Trust IT — Software Engineering & Cloud Jobs in Dhaka',
    description:
      'Build high-impact enterprise systems with 50+ engineers in Banani, Dhaka. Explore open full-stack, cloud, UI/UX, and QA positions.',
    canonicalPath: '/careers',
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<PaginatedResponse<CareerItem>>('/careers?limit=50');
      setJobs(res.items);
    } catch (err: any) {
      setError(err.message || 'Unable to load open positions.');
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
        eyebrow="Join Our Dhaka Engineering Center"
        title="Build Software That Powers Real Enterprises"
        description="We hire curious, accountable engineers, product designers, and QA specialists who care deeply about clean architecture and reliable systems."
        breadcrumbs={[{ label: 'Careers' }]}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-950">Open Positions</h2>
            <span className="text-sm text-slate-600 tabular-nums">{jobs.length} roles open</span>
          </div>

          {loading ? (
            <SkeletonGrid count={4} cols={2} />
          ) : error ? (
            <ErrorBanner message={error} onRetry={load} />
          ) : jobs.length === 0 ? (
            <EmptyState
              title="No Open Positions Currently"
              description="We are always glad to hear from experienced engineers. Send your resume via our contact page."
              actionLabel="Contact Talent Team"
              actionTo="/contact"
            />
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Link
                  key={job._id}
                  to={`/careers/${job.slug}`}
                  className="block bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-700/40 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1.5">
                        {job.department} · {job.employmentType} · {job.location}
                      </p>
                      <h3 className="text-xl font-bold text-slate-950">{job.title}</h3>
                      <p className="text-sm text-slate-600 mt-2">{job.summary}</p>
                    </div>
                    <div className="md:text-right shrink-0 space-y-2">
                      <p className="text-sm font-semibold text-slate-900 tabular-nums">{job.salaryRange}</p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                        View & Apply <ArrowRight className="w-3.5 h-3.5" />
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

export function CareerDetailPage() {
  const { slug } = useParams();
  const [job, setJob] = useState<CareerItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');

  useSeo({
    title: `${job?.title || 'Career'} | Trust IT Careers`,
    description: job?.summary || 'Apply for engineering roles at Trust IT in Dhaka, Bangladesh.',
    canonicalPath: `/careers/${slug}`,
    schema: job
      ? {
          '@context': 'https://schema.org',
          '@type': 'JobPosting',
          title: job.title,
          description: job.summary,
          employmentType: job.employmentType,
          datePosted: job.publishedAt,
          hiringOrganization: { '@type': 'Organization', name: 'Trust IT' },
          jobLocation: {
            '@type': 'Place',
            address: { '@type': 'PostalAddress', addressLocality: 'Dhaka', addressCountry: 'BD' },
          },
        }
      : undefined,
  });

  useEffect(() => {
    setLoading(true);
    api
      .get<{ item: CareerItem }>(`/careers/${slug}`)
      .then((res) => setJob(res.item))
      .catch((err: any) => setError(err.message || 'Position not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    if (!resumeFile) {
      setSubmitError('Please attach your resume (PDF, DOC, or DOCX).');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');
    try {
      const fd = new FormData();
      fd.append('careerId', job._id);
      fd.append('name', name);
      fd.append('email', email);
      fd.append('phone', phone);
      fd.append('linkedin', linkedin);
      fd.append('portfolio', portfolio);
      fd.append('coverLetter', coverLetter);
      fd.append('resume', resumeFile);

      const res = await api.post<{ message: string }>('/applications', fd);
      setSubmitSuccess(res.message);
      setName('');
      setEmail('');
      setPhone('');
      setLinkedin('');
      setPortfolio('');
      setCoverLetter('');
      setResumeFile(null);
    } catch (err: any) {
      setSubmitError(err.details?.join(', ') || err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20">
        <SkeletonGrid count={2} cols={2} />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24">
        <EmptyState
          title="Position Not Found"
          description={error || 'This career listing may have closed.'}
          actionLabel="View Open Positions"
          actionTo="/careers"
        />
      </div>
    );
  }

  return (
    <div>
      <PageBanner
        eyebrow={`${job.department} · ${job.employmentType} · ${job.location}`}
        title={job.title}
        description={job.summary}
        breadcrumbs={[{ label: 'Careers', to: '/careers' }, { label: job.title }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
              <div>
                <p className="text-xs text-slate-500">Compensation</p>
                <p className="font-bold text-slate-950 mt-0.5 tabular-nums">{job.salaryRange}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Experience</p>
                <p className="font-bold text-slate-950 mt-0.5">{job.experience}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Location</p>
                <p className="font-bold text-slate-950 mt-0.5">{job.location}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-950 mb-4">Responsibilities</h2>
              <ul className="space-y-2.5 text-sm text-slate-700">
                {job.responsibilities.map((r) => (
                  <li key={r} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-950 mb-4">Requirements</h2>
              <ul className="space-y-2.5 text-sm text-slate-700">
                {job.requirements.map((r) => (
                  <li key={r} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-950 mb-4">Benefits & Culture</h2>
              <ul className="space-y-2 text-sm text-slate-700">
                {job.benefits.map((b) => (
                  <li key={b}>· {b}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-7">
            <h2 className="text-xl font-bold text-slate-950 mb-1">Apply for This Role</h2>
            <p className="text-xs text-slate-500 mb-6">Submit your resume directly to our engineering hiring team.</p>

            {submitSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg p-5 text-sm space-y-2">
                <p className="font-bold">Application Submitted</p>
                <p>{submitSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                {submitError && (
                  <div role="alert" className="bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg p-3">
                    {submitError}
                  </div>
                )}

                <div>
                  <label htmlFor="apply-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="apply-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="apply-email" className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      id="apply-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="apply-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      id="apply-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="apply-linkedin" className="block text-xs font-semibold text-slate-700 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      id="apply-linkedin"
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="apply-portfolio" className="block text-xs font-semibold text-slate-700 mb-1">
                      Portfolio / GitHub
                    </label>
                    <input
                      id="apply-portfolio"
                      type="url"
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="apply-resume" className="block text-xs font-semibold text-slate-700 mb-1">
                    Resume / CV (PDF, DOC, DOCX · Max 8MB) *
                  </label>
                  <label
                    htmlFor="apply-resume"
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-slate-300 rounded-lg bg-white text-xs font-medium text-slate-700 hover:border-blue-700 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-blue-700" />
                    <span>{resumeFile ? resumeFile.name : 'Choose Resume File'}</span>
                    <input
                      id="apply-resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="sr-only"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>

                <div>
                  <label htmlFor="apply-cover" className="block text-xs font-semibold text-slate-700 mb-1">
                    Cover Letter *
                  </label>
                  <textarea
                    id="apply-cover"
                    rows={4}
                    required
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Share relevant projects or architecture experience..."
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 text-sm font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {submitting ? 'Uploading & Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
