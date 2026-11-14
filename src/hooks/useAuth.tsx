import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, setUnauthorizedHandler } from '../services/api';
import { AdminUser } from '../types';

interface AuthContextValue {
  admin: AdminUser | null;
  loading: boolean;
  needsSetup: boolean;
  login: (email: string, password: string) => Promise<void>;
  setupFirstAdmin: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  const refreshAdmin = useCallback(async () => {
    setLoading(true);
    try {
      const [meRes, setupRes] = await Promise.allSettled([
        api.get<{ admin: AdminUser }>('/auth/me'),
        api.get<{ needsSetup: boolean }>('/auth/setup-status'),
      ]);

      if (meRes.status === 'fulfilled') {
        setAdmin(meRes.value.admin);
      } else {
        setAdmin(null);
      }

      if (setupRes.status === 'fulfilled') {
        setNeedsSetup(setupRes.value.needsSetup);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setAdmin(null);
    });
    refreshAdmin();
  }, [refreshAdmin]);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ admin: AdminUser }>('/auth/login', { email, password });
    setAdmin(res.admin);
    setNeedsSetup(false);
  };

  const setupFirstAdmin = async (name: string, email: string, password: string) => {
    const res = await api.post<{ admin: AdminUser }>('/auth/setup-admin', { name, email, password });
    setAdmin(res.admin);
    setNeedsSetup(false);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, loading, needsSetup, login, setupFirstAdmin, logout, refreshAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
