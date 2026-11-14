import React, { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Search, Star, Trash2, X } from 'lucide-react';
import { CloudinaryImageField, ConfirmDialog, useToast } from '../../components/admin/AdminUi';
import { api } from '../../services/api';
import {
  MediaAsset,
  PaginatedResponse,
  ServiceCategoryItem,
  ServiceItem,
  ServicePackageItem,
} from '../../types';

const FILTER_GROUPS = [
  'Development',
  'Design',
  'Marketing',
  'SEO',
  'E-commerce',
  'Business Solutions',
  'Cloud & DevOps',
  'Cybersecurity',
  'Consulting',
];

const CLOUDINARY_SERVICE_FOLDERS = [
  'trust-it/services',
  'trust-it/services/web-development',
  'trust-it/services/digital-marketing',
  'trust-it/services/seo',
  'trust-it/services/design',
];

const emptyServicePayload = (): Partial<ServiceItem> => ({
  title: '',
  slug: '',
  category: 'Web & Software Development',
  filterGroup: 'Development',
  icon: 'Globe',
  startingPrice: '৳120,000',
  shortDescription: '',
  description: '',
  problemsSolved: [],
  ourSolution: '',
  subServices: [],
  features: [],
  benefits: [],
  technologies: [],
  process: [
    { step: '01', title: 'Discovery & Audit', description: 'Requirements and technical baseline review.' },
    { step: '02', title: 'Strategy & Design', description: 'Architecture and milestone blueprint.' },
    { step: '03', title: 'Execution & QA', description: 'Iterative build with staging validation.' },
    { step: '04', title: 'Launch & Support', description: 'Production rollout and SLA monitoring.' },
  ],
  packages: [
    {
      name: 'Starter',
      price: '৳120,000',
      billingType: 'one-time',
      deliveryTime: '3 Weeks',
      revisions: '2 Rounds',
      support: '30 Days',
      features: ['Core responsive deliverable', 'SEO foundation setup', 'Admin training'],
      highlighted: false,
    },
  ],
  faqs: [{ question: '', answer: '' }],
  relatedServices: [],
  featuredImage: { public_id: '', secure_url: '', alt: '' },
  gallery: [],
  seo: { metaTitle: '', metaDescription: '', keywords: [] },
  isFeatured: false,
  status: 'PUBLISHED',
  order: 10,
});

const emptyCategoryPayload = (): Partial<ServiceCategoryItem> => ({
  name: '',
  slug: '',
  filterGroup: 'Development',
  description: '',
  icon: 'Layers',
  order: 10,
  published: true,
});

export function AdminServicesPage() {
  const { notify } = useToast();
  const [activeTab, setActiveTab] = useState<'services' | 'categories'>('services');

  // Services state
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<ServiceCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');

  // Service modal state
  const [srvModalOpen, setSrvModalOpen] = useState(false);
  const [editingSrvId, setEditingSrvId] = useState<string | null>(null);
  const [srvForm, setSrvForm] = useState<Partial<ServiceItem>>(emptyServicePayload());
  const [uploadFolder, setUploadFolder] = useState<string>('trust-it/services');
  const [modalSection, setModalSection] = useState<'general' | 'details' | 'packages' | 'seo'>('general');
  const [savingSrv, setSavingSrv] = useState(false);
  const [deleteSrvId, setDeleteSrvId] = useState<string | null>(null);

  // Category modal state
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catForm, setCatForm] = useState<Partial<ServiceCategoryItem>>(emptyCategoryPayload());
  const [savingCat, setSavingCat] = useState(false);
  const [deleteCatId, setDeleteCatId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [srvRes, catRes] = await Promise.all([
        api.get<PaginatedResponse<ServiceItem>>('/services?includeDrafts=true&limit=100'),
        api.get<PaginatedResponse<ServiceCategoryItem>>('/service-categories?includeDrafts=true&limit=50'),
      ]);
      setServices(srvRes.items);
      setCategories(catRes.items);
    } catch (err: any) {
      notify('error', err.message || 'Failed to load services catalog.');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Service handlers
  const openCreateService = () => {
    setEditingSrvId(null);
    setSrvForm(emptyServicePayload());
    setUploadFolder('trust-it/services');
    setModalSection('general');
    setSrvModalOpen(true);
  };

  const openEditService = (srv: ServiceItem) => {
    setEditingSrvId(srv._id);
    setSrvForm({
      ...emptyServicePayload(),
      ...structuredClone(srv),
      featuredImage: srv.featuredImage || srv.image || { public_id: '', secure_url: '', alt: '' },
      seo: srv.seo || { metaTitle: srv.seoTitle || '', metaDescription: srv.seoDescription || '', keywords: [] },
    });
    if (srv.filterGroup === 'Marketing') setUploadFolder('trust-it/services/digital-marketing');
    else if (srv.filterGroup === 'SEO') setUploadFolder('trust-it/services/seo');
    else if (srv.filterGroup === 'Design') setUploadFolder('trust-it/services/design');
    else setUploadFolder('trust-it/services/web-development');
    setModalSection('general');
    setSrvModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSrv(true);
    try {
      const payload = {
        ...srvForm,
        faqs: (srvForm.faqs || []).filter((f) => f.question.trim() && f.answer.trim()),
        subServices: (srvForm.subServices || []).filter((s) => s.title.trim()),
      };
      if (editingSrvId) {
        await api.put(`/services/${editingSrvId}`, payload);
        notify('success', 'Service updated cleanly.');
      } else {
        await api.post('/services', payload);
        notify('success', 'New service created.');
      }
      setSrvModalOpen(false);
      await loadData();
    } catch (err: any) {
      notify('error', err.message || 'Unable to save service.');
    } finally {
      setSavingSrv(false);
    }
  };

  const handleToggleStatus = async (srv: ServiceItem) => {
    const nextStatus = srv.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await api.patch(`/services/${srv._id}`, { status: nextStatus });
      notify('success', `Service marked as ${nextStatus}.`);
      await loadData();
    } catch (err: any) {
      notify('error', err.message || 'Status update failed.');
    }
  };

  const handleToggleFeatured = async (srv: ServiceItem) => {
    try {
      await api.patch(`/services/${srv._id}`, { isFeatured: !srv.isFeatured });
      notify('success', srv.isFeatured ? 'Removed from featured services.' : 'Marked as featured service.');
      await loadData();
    } catch (err: any) {
      notify('error', err.message || 'Unable to toggle featured flag.');
    }
  };

  const handleDeleteService = async () => {
    if (!deleteSrvId) return;
    setDeleting(true);
    try {
      await api.delete(`/services/${deleteSrvId}`);
      notify('success', 'Service deleted permanently.');
      setDeleteSrvId(null);
      await loadData();
    } catch (err: any) {
      notify('error', err.message || 'Delete failed.');
    } finally {
      setDeleting(false);
    }
  };

  // Category handlers
  const openCreateCategory = () => {
    setEditingCatId(null);
    setCatForm(emptyCategoryPayload());
    setCatModalOpen(true);
  };

  const openEditCategory = (cat: ServiceCategoryItem) => {
    setEditingCatId(cat._id);
    setCatForm(structuredClone(cat));
    setCatModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCat(true);
    try {
      if (editingCatId) {
        await api.put(`/service-categories/${editingCatId}`, catForm);
        notify('success', 'Service category updated.');
      } else {
        await api.post('/service-categories', catForm);
        notify('success', 'Service category created.');
      }
      setCatModalOpen(false);
      await loadData();
    } catch (err: any) {
      notify('error', err.message || 'Unable to save category.');
    } finally {
      setSavingCat(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCatId) return;
    setDeleting(true);
    try {
      await api.delete(`/service-categories/${deleteCatId}`);
      notify('success', 'Service category deleted.');
      setDeleteCatId(null);
      await loadData();
    } catch (err: any) {
      notify('error', err.message || 'Unable to delete category.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredServices = services.filter((s) => {
    if (groupFilter !== 'All' && s.filterGroup !== groupFilter) return false;
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        (s.category || '').toLowerCase().includes(q) ||
        (s.shortDescription || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Dynamic field helpers for packages, sub-services, process, faqs
  const updatePackage = (idx: number, patch: Partial<ServicePackageItem>) => {
    const next = [...(srvForm.packages || [])];
    next[idx] = { ...next[idx], ...patch };
    setSrvForm({ ...srvForm, packages: next });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Services &amp; Categories Management</h1>
          <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
            {services.length} services · {categories.length} main categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex bg-white border border-slate-200 rounded-lg p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`px-3 py-1.5 rounded-md cursor-pointer ${
                activeTab === 'services' ? 'bg-slate-950 text-white' : 'text-slate-600'
              }`}
            >
              Services ({services.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 rounded-md cursor-pointer ${
                activeTab === 'categories' ? 'bg-slate-950 text-white' : 'text-slate-600'
              }`}
            >
              Categories ({categories.length})
            </button>
          </div>

          <button
            type="button"
            onClick={activeTab === 'services' ? openCreateService : openCreateCategory}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'services' ? 'New Service' : 'New Category'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'services' ? (
        <>
          {/* Search & Filters */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search services by name or category..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>

              <div className="flex items-center gap-1.5">
                {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                      statusFilter === st ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
              {['All', ...FILTER_GROUPS].map((grp) => (
                <button
                  key={grp}
                  type="button"
                  onClick={() => setGroupFilter(grp)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border cursor-pointer ${
                    groupFilter === grp
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {grp}
                </button>
              ))}
            </div>
          </div>

          {/* Services Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />
                ))}
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">No services match your filter.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Order</th>
                      <th className="px-4 py-3 font-semibold">Service Title &amp; Slug</th>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold">Starting Price</th>
                      <th className="px-4 py-3 font-semibold">Packages</th>
                      <th className="px-4 py-3 font-semibold">Featured</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredServices.map((srv) => (
                      <tr key={srv._id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono text-slate-500 tabular-nums">{srv.order}</td>
                        <td className="px-4 py-3 max-w-xs">
                          <p className="font-semibold text-slate-950 truncate">{srv.title}</p>
                          <p className="text-[11px] font-mono text-slate-400 truncate">/services/{srv.slug}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          <p className="font-medium">{srv.filterGroup}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{srv.category}</p>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-800 tabular-nums">
                          {srv.startingPrice || '—'}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-700 tabular-nums">
                          {srv.packages?.length || 0}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(srv)}
                            className={`p-1.5 rounded cursor-pointer ${
                              srv.isFeatured ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500'
                            }`}
                            aria-label="Toggle featured"
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(srv)}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                              srv.status === 'PUBLISHED'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {srv.status}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditService(srv)}
                              className="p-1.5 text-slate-600 hover:text-blue-700 rounded hover:bg-blue-50 cursor-pointer"
                              aria-label={`Edit ${srv.title}`}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteSrvId(srv._id)}
                              className="p-1.5 text-slate-600 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
                              aria-label={`Delete ${srv.title}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Categories Table */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Category Name</th>
                  <th className="px-4 py-3 font-semibold">Filter Group</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold">Published</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-slate-500 tabular-nums">{cat.order}</td>
                    <td className="px-4 py-3 font-semibold text-slate-950">{cat.name}</td>
                    <td className="px-4 py-3 font-medium text-blue-700">{cat.filterGroup}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-md truncate">{cat.description}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                          cat.published
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {cat.published ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditCategory(cat)}
                          className="p-1.5 text-slate-600 hover:text-blue-700 rounded hover:bg-blue-50 cursor-pointer"
                          aria-label={`Edit ${cat.name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteCatId(cat._id)}
                          className="p-1.5 text-slate-600 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
                          aria-label={`Delete ${cat.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT SERVICE MODAL */}
      {srvModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white border border-slate-200 rounded-xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  {editingSrvId ? `Edit Service: ${srvForm.title}` : 'Create New Service'}
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    { id: 'general', label: '1. Core & Copy' },
                    { id: 'details', label: '2. Sub-Services, Process & FAQs' },
                    { id: 'packages', label: '3. Service Packages' },
                    { id: 'seo', label: '4. Media, Related & SEO' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setModalSection(tab.id as any)}
                      className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                        modalSection === tab.id
                          ? 'bg-slate-950 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSrvModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900 cursor-pointer"
                aria-label="Close service editor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="p-6 overflow-y-auto space-y-5 text-xs">
              {modalSection === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Service Title *</label>
                      <input
                        type="text"
                        required
                        value={srvForm.title || ''}
                        onChange={(e) => setSrvForm({ ...srvForm, title: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">URL Slug (auto if blank)</label>
                      <input
                        type="text"
                        value={srvForm.slug || ''}
                        onChange={(e) => setSrvForm({ ...srvForm, slug: e.target.value })}
                        placeholder="e.g. digital-marketing"
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                      <select
                        value={srvForm.category || ''}
                        onChange={(e) => setSrvForm({ ...srvForm, category: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                      >
                        {categories.map((c) => (
                          <option key={c._id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Filter Group *</label>
                      <select
                        value={srvForm.filterGroup || 'Development'}
                        onChange={(e) => setSrvForm({ ...srvForm, filterGroup: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                      >
                        {FILTER_GROUPS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Starting Price</label>
                      <input
                        type="text"
                        value={srvForm.startingPrice || ''}
                        onChange={(e) => setSrvForm({ ...srvForm, startingPrice: e.target.value })}
                        placeholder="e.g. ৳35,000/mo or ৳120,000"
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Lucide Icon Name</label>
                      <input
                        type="text"
                        value={srvForm.icon || 'Globe'}
                        onChange={(e) => setSrvForm({ ...srvForm, icon: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Display Order</label>
                      <input
                        type="number"
                        value={srvForm.order ?? 10}
                        onChange={(e) => setSrvForm({ ...srvForm, order: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Publish Status</label>
                      <select
                        value={srvForm.status || 'PUBLISHED'}
                        onChange={(e) => setSrvForm({ ...srvForm, status: e.target.value as 'DRAFT' | 'PUBLISHED' })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                      >
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="DRAFT">DRAFT</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-2 font-semibold text-slate-800 pt-5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(srvForm.isFeatured)}
                        onChange={(e) => setSrvForm({ ...srvForm, isFeatured: e.target.checked })}
                      />
                      <span>Featured Service</span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Short Description *</label>
                    <textarea
                      rows={2}
                      required
                      value={srvForm.shortDescription || ''}
                      onChange={(e) => setSrvForm({ ...srvForm, shortDescription: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Service Description *</label>
                    <textarea
                      rows={4}
                      required
                      value={srvForm.description || ''}
                      onChange={(e) => setSrvForm({ ...srvForm, description: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Problems Solved (comma-separated)</label>
                      <textarea
                        rows={3}
                        value={(srvForm.problemsSolved || []).join(', ')}
                        onChange={(e) =>
                          setSrvForm({
                            ...srvForm,
                            problemsSolved: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Our Solution Summary</label>
                      <textarea
                        rows={3}
                        value={srvForm.ourSolution || ''}
                        onChange={(e) => setSrvForm({ ...srvForm, ourSolution: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {modalSection === 'details' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Key Benefits (comma-separated)</label>
                      <textarea
                        rows={3}
                        value={(srvForm.benefits || []).join(', ')}
                        onChange={(e) =>
                          setSrvForm({
                            ...srvForm,
                            benefits: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Features (comma-separated)</label>
                      <textarea
                        rows={3}
                        value={(srvForm.features || []).join(', ')}
                        onChange={(e) =>
                          setSrvForm({
                            ...srvForm,
                            features: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Technologies (comma-separated)</label>
                      <textarea
                        rows={3}
                        value={(srvForm.technologies || []).join(', ')}
                        onChange={(e) =>
                          setSrvForm({
                            ...srvForm,
                            technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Sub-Services List Editor */}
                  <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900">Sub-Services / Capabilities</h3>
                      <button
                        type="button"
                        onClick={() =>
                          setSrvForm({
                            ...srvForm,
                            subServices: [...(srvForm.subServices || []), { title: '', slug: '', description: '' }],
                          })
                        }
                        className="px-2.5 py-1 bg-slate-950 text-white rounded font-semibold cursor-pointer"
                      >
                        + Add Sub-Service
                      </button>
                    </div>
                    {(srvForm.subServices || []).map((sub, i) => (
                      <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-white p-3 rounded border border-slate-200">
                        <input
                          type="text"
                          placeholder="Title"
                          value={sub.title}
                          onChange={(e) => {
                            const next = [...(srvForm.subServices || [])];
                            next[i] = { ...next[i], title: e.target.value };
                            setSrvForm({ ...srvForm, subServices: next });
                          }}
                          className="sm:col-span-4 px-2.5 py-1.5 border border-slate-200 rounded"
                        />
                        <input
                          type="text"
                          placeholder="Optional link slug"
                          value={sub.slug || ''}
                          onChange={(e) => {
                            const next = [...(srvForm.subServices || [])];
                            next[i] = { ...next[i], slug: e.target.value };
                            setSrvForm({ ...srvForm, subServices: next });
                          }}
                          className="sm:col-span-3 px-2.5 py-1.5 border border-slate-200 rounded font-mono"
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={sub.description}
                          onChange={(e) => {
                            const next = [...(srvForm.subServices || [])];
                            next[i] = { ...next[i], description: e.target.value };
                            setSrvForm({ ...srvForm, subServices: next });
                          }}
                          className="sm:col-span-4 px-2.5 py-1.5 border border-slate-200 rounded"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setSrvForm({
                              ...srvForm,
                              subServices: (srvForm.subServices || []).filter((_, idx) => idx !== i),
                            })
                          }
                          className="sm:col-span-1 text-red-600 font-semibold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* FAQs Editor */}
                  <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900">Service FAQs</h3>
                      <button
                        type="button"
                        onClick={() =>
                          setSrvForm({
                            ...srvForm,
                            faqs: [...(srvForm.faqs || []), { question: '', answer: '' }],
                          })
                        }
                        className="px-2.5 py-1 bg-slate-950 text-white rounded font-semibold cursor-pointer"
                      >
                        + Add FAQ
                      </button>
                    </div>
                    {(srvForm.faqs || []).map((faq, i) => (
                      <div key={i} className="space-y-2 bg-white p-3 rounded border border-slate-200">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Question"
                            value={faq.question}
                            onChange={(e) => {
                              const next = [...(srvForm.faqs || [])];
                              next[i] = { ...next[i], question: e.target.value };
                              setSrvForm({ ...srvForm, faqs: next });
                            }}
                            className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setSrvForm({
                                ...srvForm,
                                faqs: (srvForm.faqs || []).filter((_, idx) => idx !== i),
                              })
                            }
                            className="text-red-600 font-semibold cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Answer"
                          value={faq.answer}
                          onChange={(e) => {
                            const next = [...(srvForm.faqs || [])];
                            next[i] = { ...next[i], answer: e.target.value };
                            setSrvForm({ ...srvForm, faqs: next });
                          }}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modalSection === 'packages' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-600">
                      Manage Starter, Professional, Business, or Enterprise packages displayed on the public service page.
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setSrvForm({
                          ...srvForm,
                          packages: [
                            ...(srvForm.packages || []),
                            {
                              name: 'Professional',
                              price: '৳200,000',
                              billingType: 'one-time',
                              deliveryTime: '4–6 Weeks',
                              revisions: 'Unlimited',
                              support: '90 Days',
                              features: ['Custom features'],
                              highlighted: false,
                            },
                          ],
                        })
                      }
                      className="px-3 py-1.5 bg-slate-950 text-white rounded-lg font-semibold cursor-pointer"
                    >
                      + Add Package Tier
                    </button>
                  </div>

                  {(srvForm.packages || []).map((pkg, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Package #{idx + 1}</span>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(pkg.highlighted)}
                              onChange={(e) => updatePackage(idx, { highlighted: e.target.checked })}
                            />
                            <span>Highlight Recommended</span>
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              setSrvForm({
                                ...srvForm,
                                packages: (srvForm.packages || []).filter((_, i) => i !== idx),
                              })
                            }
                            className="text-red-600 font-semibold cursor-pointer"
                          >
                            Delete Tier
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Name (e.g. Starter)"
                          value={pkg.name}
                          onChange={(e) => updatePackage(idx, { name: e.target.value })}
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded"
                        />
                        <input
                          type="text"
                          placeholder="Price (e.g. ৳120,000)"
                          value={pkg.price}
                          onChange={(e) => updatePackage(idx, { price: e.target.value })}
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded"
                        />
                        <select
                          value={pkg.billingType}
                          onChange={(e) => updatePackage(idx, { billingType: e.target.value as any })}
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded"
                        >
                          <option value="one-time">one-time</option>
                          <option value="monthly">monthly</option>
                          <option value="custom">custom</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Delivery Time"
                          value={pkg.deliveryTime}
                          onChange={(e) => updatePackage(idx, { deliveryTime: e.target.value })}
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded"
                        />
                        <input
                          type="text"
                          placeholder="Revisions"
                          value={pkg.revisions}
                          onChange={(e) => updatePackage(idx, { revisions: e.target.value })}
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded"
                        />
                        <input
                          type="text"
                          placeholder="Support"
                          value={pkg.support}
                          onChange={(e) => updatePackage(idx, { support: e.target.value })}
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Package Features (comma-separated)</label>
                        <input
                          type="text"
                          value={(pkg.features || []).join(', ')}
                          onChange={(e) =>
                            updatePackage(idx, {
                              features: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                            })
                          }
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {modalSection === 'seo' && (
                <div className="space-y-5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cloudinary Folder Target</label>
                    <select
                      value={uploadFolder}
                      onChange={(e) => setUploadFolder(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                    >
                      {CLOUDINARY_SERVICE_FOLDERS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  <CloudinaryImageField
                    label="Service Featured Image"
                    folder={uploadFolder}
                    value={srvForm.featuredImage as MediaAsset}
                    onChange={(asset) => setSrvForm({ ...srvForm, featuredImage: asset })}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">SEO Meta Title</label>
                      <input
                        type="text"
                        value={srvForm.seo?.metaTitle || ''}
                        onChange={(e) =>
                          setSrvForm({ ...srvForm, seo: { ...(srvForm.seo || {}), metaTitle: e.target.value } })
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Related Service Slugs (comma-separated)</label>
                      <input
                        type="text"
                        value={(srvForm.relatedServices || []).join(', ')}
                        onChange={(e) =>
                          setSrvForm({
                            ...srvForm,
                            relatedServices: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="web-development, seo, digital-marketing"
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">SEO Meta Description</label>
                    <textarea
                      rows={2}
                      value={srvForm.seo?.metaDescription || ''}
                      onChange={(e) =>
                        setSrvForm({ ...srvForm, seo: { ...(srvForm.seo || {}), metaDescription: e.target.value } })
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">SEO Keywords (comma-separated)</label>
                    <input
                      type="text"
                      value={(srvForm.seo?.keywords || []).join(', ')}
                      onChange={(e) =>
                        setSrvForm({
                          ...srvForm,
                          seo: {
                            ...(srvForm.seo || {}),
                            keywords: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSrvModalOpen(false)}
                  className="px-4 py-2 font-semibold border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSrv}
                  className="px-5 py-2 font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 cursor-pointer disabled:opacity-60"
                >
                  {savingSrv ? 'Saving...' : editingSrvId ? 'Save Service Changes' : 'Publish Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT CATEGORY MODAL */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-950">
                {editingCatId ? 'Edit Service Category' : 'Create Service Category'}
              </h2>
              <button
                type="button"
                onClick={() => setCatModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catForm.name || ''}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Filter Group *</label>
                  <select
                    value={catForm.filterGroup || 'Development'}
                    onChange={(e) => setCatForm({ ...catForm, filterGroup: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  >
                    {FILTER_GROUPS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={catForm.order ?? 10}
                    onChange={(e) => setCatForm({ ...catForm, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lucide Icon Name</label>
                <input
                  type="text"
                  value={catForm.icon || 'Layers'}
                  onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={catForm.description || ''}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
              <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(catForm.published)}
                  onChange={(e) => setCatForm({ ...catForm, published: e.target.checked })}
                />
                <span>Published on Public Site</span>
              </label>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2 font-semibold border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCat}
                  className="px-5 py-2 font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 cursor-pointer disabled:opacity-60"
                >
                  {savingCat ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteSrvId)}
        title="Delete Service"
        description="Permanently delete this service and its packages from the database?"
        onCancel={() => setDeleteSrvId(null)}
        onConfirm={handleDeleteService}
        busy={deleting}
      />

      <ConfirmDialog
        open={Boolean(deleteCatId)}
        title="Delete Service Category"
        description="Permanently delete this service category?"
        onCancel={() => setDeleteCatId(null)}
        onConfirm={handleDeleteCategory}
        busy={deleting}
      />
    </div>
  );
}
