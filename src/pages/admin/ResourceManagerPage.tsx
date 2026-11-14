import React, { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { CloudinaryImageField, ConfirmDialog, useToast } from '../../components/admin/AdminUi';
import { api } from '../../services/api';
import { PaginatedResponse } from '../../types';
import { resourceConfigs } from './ResourceConfigs';

export function ResourceManagerPage({ resourceKey }: { resourceKey: string }) {
  const config = resourceConfigs[resourceKey];
  const { notify } = useToast();

  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        includeDrafts: 'true',
        page: String(page),
        limit: '12',
      });
      if (search.trim()) params.set('q', search.trim());
      if (statusFilter !== 'ALL' && config.publishMode?.field === 'status') {
        params.set('status', statusFilter);
      }
      const res = await api.get<PaginatedResponse<any>>(`${config.endpoint}?${params.toString()}`);
      setItems(res.items);
      setTotal(res.total);
      setPages(res.pages);
    } catch (err: any) {
      notify('error', err.message || `Failed to load ${config.title}`);
    } finally {
      setLoading(false);
    }
  }, [config.endpoint, config.publishMode?.field, config.title, notify, page, search, statusFilter]);

  useEffect(() => {
    setPage(1);
    setSearch('');
    setStatusFilter('ALL');
  }, [resourceKey]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setFormData(structuredClone(config.defaultPayload));
    setModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item._id);
    setFormData({ ...structuredClone(config.defaultPayload), ...structuredClone(item) });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`${config.endpoint}/${editingId}`, formData);
        notify('success', `${config.title} record updated.`);
      } else {
        await api.post(config.endpoint, formData);
        notify('success', `${config.title} record created.`);
      }
      setModalOpen(false);
      await load();
    } catch (err: any) {
      notify('error', err.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (item: any) => {
    if (!config.publishMode) return;
    const { field, onValue, offValue } = config.publishMode;
    const nextVal = item[field] === onValue ? offValue : onValue;
    try {
      await api.patch(`${config.endpoint}/${item._id}`, { [field]: nextVal });
      notify('success', `Updated status to ${String(nextVal)}.`);
      await load();
    } catch (err: any) {
      notify('error', err.message || 'Unable to change status.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`${config.endpoint}/${deleteId}`);
      notify('success', 'Record deleted permanently.');
      setDeleteId(null);
      await load();
    } catch (err: any) {
      notify('error', err.message || 'Failed to delete record.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredLocal =
    statusFilter !== 'ALL' && config.publishMode?.field === 'published'
      ? items.filter((item) =>
          statusFilter === 'PUBLISHED' ? item.published === true : item.published === false
        )
      : items;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">{config.title}</h1>
          <p className="text-xs text-slate-500 tabular-nums mt-0.5">{total} total records</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 whitespace-nowrap shrink-0 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder={`Search ${config.title.toLowerCase()}...`}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
          />
        </div>
        {config.publishMode && (
          <div className="flex items-center gap-1.5">
            {['ALL', String(config.publishMode.onValue), String(config.publishMode.offValue)].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setStatusFilter(opt)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                  statusFilter === opt ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {opt === 'true' ? 'Published' : opt === 'false' ? 'Unpublished' : opt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        ) : filteredLocal.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-900">No records found</p>
            <p className="text-xs text-slate-500">Create a new entry or clear your current search filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="px-5 py-3 font-semibold">Title / Name</th>
                  {config.secondaryField && <th className="px-5 py-3 font-semibold">Details</th>}
                  {config.publishMode && <th className="px-5 py-3 font-semibold">Visibility</th>}
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLocal.map((item) => {
                  const isPub = config.publishMode
                    ? item[config.publishMode.field] === config.publishMode.onValue
                    : true;
                  return (
                    <tr key={item._id} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5 font-semibold text-slate-900 max-w-xs truncate">
                        {item[config.primaryField]}
                      </td>
                      {config.secondaryField && (
                        <td className="px-5 py-3.5 text-slate-600 max-w-sm truncate">
                          {item[config.secondaryField]}
                        </td>
                      )}
                      {config.publishMode && (
                        <td className="px-5 py-3.5">
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(item)}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                              isPub
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {isPub ? String(config.publishMode.onValue === true ? 'Published' : config.publishMode.onValue) : String(config.publishMode.offValue === false ? 'Draft' : config.publishMode.offValue)}
                          </button>
                        </td>
                      )}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 rounded hover:bg-blue-50 cursor-pointer"
                            aria-label={`Edit ${item[config.primaryField]}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(item._id)}
                            className="p-1.5 text-slate-600 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
                            aria-label={`Delete ${item[config.primaryField]}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span className="tabular-nums">
              Page {page} of {pages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border border-slate-200 rounded disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border border-slate-200 rounded disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-slate-950">
                {editingId ? `Edit ${config.title}` : `Create ${config.title}`}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
              {config.fields.map((field) => {
                if (field.type === 'image') {
                  return (
                    <CloudinaryImageField
                      key={field.name}
                      label={field.label}
                      folder={field.folder || 'trust-it'}
                      value={formData[field.name]}
                      onChange={(asset) => setFormData({ ...formData, [field.name]: asset })}
                    />
                  );
                }

                if (field.type === 'checkbox') {
                  return (
                    <label key={field.name} className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(formData[field.name])}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
                        className="rounded border-slate-300 text-blue-700"
                      />
                      <span>{field.label}</span>
                    </label>
                  );
                }

                if (field.type === 'select') {
                  return (
                    <div key={field.name}>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{field.label}</label>
                      <select
                        value={formData[field.name] ?? ''}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                      >
                        {(field.options || []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                if (field.type === 'tags') {
                  const strVal = Array.isArray(formData[field.name]) ? formData[field.name].join(', ') : '';
                  return (
                    <div key={field.name}>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{field.label}</label>
                      <input
                        type="text"
                        value={strVal}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.name]: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="Item 1, Item 2, Item 3"
                        className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>
                  );
                }

                if (field.type === 'textarea' || field.type === 'markdown') {
                  return (
                    <div key={field.name}>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{field.label}</label>
                      <textarea
                        rows={field.type === 'markdown' ? 7 : 3}
                        required={field.required}
                        value={formData[field.name] ?? ''}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg font-sans"
                      />
                    </div>
                  );
                }

                return (
                  <div key={field.name}>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{field.label}</label>
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      required={field.required}
                      value={formData[field.name] ?? ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
                    />
                  </div>
                );
              })}

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 cursor-pointer disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Record' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title={`Delete ${config.title} Item`}
        description="This action permanently removes the record from the database. Are you sure?"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        busy={deleting}
      />
    </div>
  );
}
