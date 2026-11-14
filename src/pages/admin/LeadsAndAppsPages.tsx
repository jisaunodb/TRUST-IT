import { useCallback, useEffect, useState } from 'react';
import { ExternalLink, Eye, Search, Trash2, X } from 'lucide-react';
import { ConfirmDialog, useToast } from '../../components/admin/AdminUi';
import { api } from '../../services/api';
import { ContactMessageItem, JobApplicationItem, PaginatedResponse } from '../../types';

export function AdminMessagesPage() {
  const { notify } = useToast();
  const [items, setItems] = useState<ContactMessageItem[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessageItem | null>(null);
  const [notes, setNotes] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (search.trim()) params.set('q', search.trim());
      const res = await api.get<PaginatedResponse<ContactMessageItem>>(`/contact?${params.toString()}`);
      setItems(res.items);
    } catch (err: any) {
      notify('error', err.message || 'Failed to load messages.');
    } finally {
      setLoading(false);
    }
  }, [notify, search, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: ContactMessageItem['status'], customNotes?: string) => {
    try {
      await api.patch(`/contact/${id}`, { status, ...(customNotes !== undefined ? { notes: customNotes } : {}) });
      notify('success', `Lead marked as ${status}.`);
      await load();
      if (selected && selected._id === id) {
        setSelected({ ...selected, status, notes: customNotes ?? selected.notes });
      }
    } catch (err: any) {
      notify('error', err.message || 'Failed to update lead status.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/contact/${deleteId}`);
      notify('success', 'Inquiry deleted.');
      setDeleteId(null);
      await load();
    } catch (err: any) {
      notify('error', err.message || 'Delete failed.');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Contact Messages & Leads</h1>
        <p className="text-xs text-slate-500 mt-0.5">Track consultation requests from new inquiry through project kickoff.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, email, company, service..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                statusFilter === s ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-xs text-slate-500">Loading inquiries...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No contact inquiries match this filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Service & Budget</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-950">{m.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {m.email} · {m.phone}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-800">{m.service}</p>
                      <p className="text-[11px] text-slate-500">{m.budget}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={m.status}
                        onChange={(e) => updateStatus(m._id, e.target.value as any)}
                        aria-label={`Status for ${m.name}`}
                        className="px-2.5 py-1 text-xs font-semibold border border-slate-200 rounded bg-white"
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 tabular-nums">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(m);
                          setNotes(m.notes || '');
                        }}
                        className="p-1.5 text-slate-600 hover:text-blue-700 cursor-pointer"
                        aria-label="Inspect inquiry"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(m._id)}
                        className="p-1.5 text-slate-600 hover:text-red-600 cursor-pointer"
                        aria-label="Delete inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-950">Inquiry from {selected.name}</h2>
              <button type="button" onClick={() => setSelected(null)} className="text-slate-500 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <p>Email: {selected.email} · Phone: {selected.phone}</p>
              {selected.company && <p>Company: {selected.company}</p>}
              <p>Service: {selected.service} · Budget: {selected.budget}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-800 whitespace-pre-wrap">
              {selected.message}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Internal Follow-Up Notes</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => updateStatus(selected._id, selected.status, notes)}
                className="px-4 py-2 text-xs font-semibold bg-blue-700 text-white rounded-lg cursor-pointer"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Contact Message"
        description="Are you sure you want to permanently remove this lead inquiry?"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export function AdminApplicationsPage() {
  const { notify } = useToast();
  const [items, setItems] = useState<JobApplicationItem[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (search.trim()) params.set('q', search.trim());
      const res = await api.get<PaginatedResponse<JobApplicationItem>>(`/applications?${params.toString()}`);
      setItems(res.items);
    } catch (err: any) {
      notify('error', err.message || 'Failed to load job applications.');
    } finally {
      setLoading(false);
    }
  }, [notify, search, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: JobApplicationItem['status']) => {
    try {
      await api.patch(`/applications/${id}`, { status });
      notify('success', `Applicant marked as ${status}.`);
      await load();
    } catch (err: any) {
      notify('error', err.message || 'Failed to update status.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/applications/${deleteId}`);
      notify('success', 'Application deleted.');
      setDeleteId(null);
      await load();
    } catch (err: any) {
      notify('error', err.message || 'Failed to delete.');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Job Applications</h1>
        <p className="text-xs text-slate-500 mt-0.5">Review candidate resumes and manage hiring pipeline stages.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by applicant name, email, or role..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'NEW', 'REVIEWING', 'SHORTLISTED', 'REJECTED'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                statusFilter === s ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-xs text-slate-500">Loading applications...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No job applications found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="px-5 py-3 font-semibold">Candidate</th>
                  <th className="px-5 py-3 font-semibold">Position</th>
                  <th className="px-5 py-3 font-semibold">Resume</th>
                  <th className="px-5 py-3 font-semibold">Stage</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-950">{a.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {a.email} · {a.phone}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{a.careerTitle}</td>
                    <td className="px-5 py-3.5">
                      {a.resume?.secure_url ? (
                        <a
                          href={a.resume.secure_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-700 font-semibold hover:underline"
                        >
                          Open Resume <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={a.status}
                        onChange={(e) => updateStatus(a._id, e.target.value as any)}
                        aria-label={`Stage for ${a.name}`}
                        className="px-2.5 py-1 text-xs font-semibold border border-slate-200 rounded bg-white"
                      >
                        <option value="NEW">NEW</option>
                        <option value="REVIEWING">REVIEWING</option>
                        <option value="SHORTLISTED">SHORTLISTED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setDeleteId(a._id)}
                        className="p-1.5 text-slate-600 hover:text-red-600 cursor-pointer"
                        aria-label="Delete application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Job Application"
        description="Permanently delete this candidate application record?"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
