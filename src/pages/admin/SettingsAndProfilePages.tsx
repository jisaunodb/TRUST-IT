import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useToast } from '../../components/admin/AdminUi';
import { useAuth } from '../../hooks/useAuth';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { api } from '../../services/api';
import { WebsiteSettingItem } from '../../types';

export function AdminSettingsPage() {
  const { settings, refreshSettings } = useSiteSettings();
  const { notify } = useToast();
  const [form, setForm] = useState<WebsiteSettingItem>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', form);
      await refreshSettings();
      notify('success', 'Website settings updated across public site.');
    } catch (err: any) {
      notify('error', err.message || 'Failed to update website settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Website Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage company contact details, homepage hero copy, stats counters, and SEO defaults.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 text-xs font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 cursor-pointer disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-950">Brand & Homepage Hero</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Headline</label>
          <input
            type="text"
            value={form.heroHeadline}
            onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Supporting Copy</label>
          <textarea
            rows={2}
            value={form.heroSubheadline}
            onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })}
            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-950">Contact Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Number</label>
            <input
              type="text"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Office Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Business Hours</label>
          <input
            type="text"
            value={form.businessHours}
            onChange={(e) => setForm({ ...form, businessHours: e.target.value })}
            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-950">Trust Metrics & Counters</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { key: 'yearsExperience', label: 'Years Exp.' },
            { key: 'projectsCompleted', label: 'Projects' },
            { key: 'happyClients', label: 'Clients' },
            { key: 'professionals', label: 'Experts' },
            { key: 'clientSatisfaction', label: 'Satisfaction %' },
          ].map((stat) => (
            <div key={stat.key}>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{stat.label}</label>
              <input
                type="number"
                value={(form.stats as any)[stat.key]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stats: { ...form.stats, [stat.key]: Number(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg tabular-nums"
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}

export function AdminProfilePage() {
  const { admin, refreshAdmin } = useAuth();
  const { notify } = useToast();

  const [name, setName] = useState(admin?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const [staffList, setStaffList] = useState<any[]>([]);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '', role: 'ADMIN' });

  useEffect(() => {
    if (admin?.role === 'SUPER_ADMIN') {
      api
        .get<{ items: any[] }>('/admin/users')
        .then((res) => setStaffList(res.items))
        .catch(() => {});
    }
  }, [admin?.role]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', {
        name,
        ...(newPassword ? { currentPassword, newPassword } : {}),
      });
      await refreshAdmin();
      setCurrentPassword('');
      setNewPassword('');
      notify('success', 'Profile updated successfully.');
    } catch (err: any) {
      notify('error', err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', newStaff);
      notify('success', 'New administrator added.');
      setNewStaff({ name: '', email: '', password: '', role: 'ADMIN' });
      const res = await api.get<{ items: any[] }>('/admin/users');
      setStaffList(res.items);
    } catch (err: any) {
      notify('error', err.message || 'Failed to add administrator.');
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    try {
      await api.delete(`/admin/users/${id}`);
      notify('success', 'Administrator removed.');
      setStaffList((prev) => prev.filter((u) => u._id !== id));
    } catch (err: any) {
      notify('error', err.message || 'Failed to remove administrator.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Admin Profile & Security</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your personal credentials and role permissions.</p>
      </div>

      <form onSubmit={handleProfileSave} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-950">Your Account ({admin?.role})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              disabled
              value={admin?.email || ''}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password (only to change)</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">New Password (min 8 chars)</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 text-xs font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 cursor-pointer disabled:opacity-60"
        >
          {saving ? 'Updating...' : 'Save Profile'}
        </button>
      </form>

      {admin?.role === 'SUPER_ADMIN' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <h2 className="text-sm font-bold text-slate-950">Authorized Administrators</h2>
          <div className="divide-y divide-slate-100 text-xs">
            {staffList.map((u) => (
              <div key={u._id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-950">{u.name}</p>
                  <p className="text-slate-500">
                    {u.email} · {u.role}
                  </p>
                </div>
                {u._id !== admin._id && (
                  <button
                    type="button"
                    onClick={() => handleDeleteAdmin(u._id)}
                    className="p-1.5 text-slate-500 hover:text-red-600 cursor-pointer"
                    aria-label={`Remove ${u.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleCreateAdmin} className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              required
              placeholder="Name"
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              className="px-3 py-2 text-xs border border-slate-200 rounded-lg"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={newStaff.email}
              onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
              className="px-3 py-2 text-xs border border-slate-200 rounded-lg"
            />
            <input
              type="password"
              required
              placeholder="Password (min 8)"
              value={newStaff.password}
              onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
              className="px-3 py-2 text-xs border border-slate-200 rounded-lg"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-slate-950 text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              Add Admin
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
