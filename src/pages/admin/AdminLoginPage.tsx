import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSeo } from '../../hooks/useSeo';

export function AdminLoginPage() {
  const { admin, loading, needsSetup, login, setupFirstAdmin } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useSeo({
    title: 'Admin Sign In | Trust IT CMS',
    description: 'Authorized Trust IT staff portal login.',
    canonicalPath: '/admin/login',
  });

  if (!loading && admin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (needsSetup) {
        await setupFirstAdmin(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/admin', { replace: true });
    } catch (err: any) {
      setError(err.details?.join(', ') || err.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 p-8 shadow-xl space-y-6">
        <div className="space-y-2">
          <img
            src="/assets/aistudio/trust-it_2e09824d.jpg"
            alt="Trust IT — Social Media Solutions"
            width={52}
            height={52}
            className="w-13 h-13 rounded-full object-cover ring-2 ring-amber-500/60"
          />
          <h1 className="text-2xl font-bold text-slate-950">
            {needsSetup ? 'Initialize Super Admin' : 'Trust IT Admin Console'}
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            {needsSetup
              ? 'No administrator account exists yet. Create the initial Super Admin account to manage CMS content and leads.'
              : 'Restricted access for authorized Trust IT administrators only.'}
          </p>
        </div>

        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg p-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {needsSetup && (
            <div>
              <label htmlFor="admin-name" className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                id="admin-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tariqul Islam"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>
          )}

          <div>
            <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-700 mb-1">
              Administrator Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@trustit.com.bd"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-700 mb-1">
              Password {needsSetup && '(min 8 characters)'}
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete={needsSetup ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full py-3 px-4 text-sm font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors cursor-pointer disabled:opacity-60"
          >
            {submitting
              ? 'Authenticating...'
              : needsSetup
              ? 'Create Super Admin & Sign In'
              : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-900">
            Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
