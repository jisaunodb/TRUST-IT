import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../../services/api';
import { ContactMessageItem, JobApplicationItem } from '../../types';

interface DashboardData {
  counts: {
    totalProjects: number;
    totalServices: number;
    totalSolutions: number;
    totalIndustries: number;
    totalCaseStudies: number;
    totalBlogPosts: number;
    totalTeamMembers: number;
    totalContactMessages: number;
    newContactMessages: number;
    totalJobApplications: number;
    totalTestimonials: number;
    totalCareers: number;
  };
  charts: {
    contentDistribution: { name: string; count: number }[];
    leadStatusBreakdown: { status: string; count: number }[];
  };
  recentMessages: ContactMessageItem[];
  recentApplications: JobApplicationItem[];
}

export function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<DashboardData>('/admin/dashboard')
      .then(setData)
      .catch((err: any) => setError(err.message || 'Failed to load dashboard metrics.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 bg-white border border-slate-200 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 text-sm">
        {error || 'Dashboard unavailable.'}
      </div>
    );
  }

  const kpis = [
    { label: 'Total Projects', value: data.counts.totalProjects, to: '/admin/projects' },
    { label: 'Total Services', value: data.counts.totalServices, to: '/admin/services' },
    { label: 'Blog Posts', value: data.counts.totalBlogPosts, to: '/admin/blog' },
    { label: 'Team Members', value: data.counts.totalTeamMembers, to: '/admin/team' },
    { label: 'Contact Messages', value: data.counts.totalContactMessages, sub: `${data.counts.newContactMessages} new`, to: '/admin/messages' },
    { label: 'Job Applications', value: data.counts.totalJobApplications, to: '/admin/applications' },
    { label: 'Testimonials', value: data.counts.totalTestimonials, to: '/admin/testimonials' },
    { label: 'Open Careers', value: data.counts.totalCareers, to: '/admin/careers' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Executive CMS Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">Live metrics across Trust IT content, client inquiries, and recruitment.</p>
        </div>
        <Link
          to="/admin/blog"
          className="px-4 py-2 text-xs font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 whitespace-nowrap shrink-0 w-fit"
        >
          Manage Blog & Content
        </Link>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Link
            key={k.label}
            to={k.to}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-700/40 transition-colors"
          >
            <p className="text-xs text-slate-500">{k.label}</p>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <p className="text-2xl font-bold text-slate-950 tabular-nums">{k.value}</p>
              {k.sub && <span className="text-xs font-semibold text-blue-700 tabular-nums">{k.sub}</span>}
            </div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-sm font-bold text-slate-950 mb-4">Published Content Inventory</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts.contentDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-sm font-bold text-slate-950 mb-4">Contact Lead Pipeline</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts.leadStatusBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0F172A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-950">Recent Contact Inquiries</h2>
            <Link to="/admin/messages" className="text-xs font-semibold text-blue-700 hover:underline">
              View All
            </Link>
          </div>
          {data.recentMessages.length === 0 ? (
            <p className="p-6 text-xs text-slate-500">No contact inquiries submitted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Client</th>
                    <th className="px-4 py-2.5 font-semibold">Service</th>
                    <th className="px-4 py-2.5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.recentMessages.map((m) => (
                    <tr key={m._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {m.name}
                        <span className="block text-[11px] text-slate-500 font-normal">{m.email}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{m.service}</td>
                      <td className="px-4 py-3 font-mono text-[11px] font-semibold text-blue-700">{m.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-950">Recent Job Applications</h2>
            <Link to="/admin/applications" className="text-xs font-semibold text-blue-700 hover:underline">
              View All
            </Link>
          </div>
          {data.recentApplications.length === 0 ? (
            <p className="p-6 text-xs text-slate-500">No job applications received yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Applicant</th>
                    <th className="px-4 py-2.5 font-semibold">Position</th>
                    <th className="px-4 py-2.5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.recentApplications.map((a) => (
                    <tr key={a._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {a.name}
                        <span className="block text-[11px] text-slate-500 font-normal">{a.email}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 truncate max-w-[180px]">{a.careerTitle}</td>
                      <td className="px-4 py-3 font-mono text-[11px] font-semibold text-slate-700">{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
