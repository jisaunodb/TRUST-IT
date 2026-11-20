import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { WebsiteSettingItem } from '../types';

const fallbackSettings: WebsiteSettingItem = {
  _id: 'default',
  companyName: 'Trust IT',
  tagline: 'Social Media Solutions · Technology You Can Trust',
  altTagline: 'Your Vision, Our Strategy — Creative Solutions, Digital Growth & Lasting Success',
  experienceYears: 6,
  heroHeadline: 'Building Digital & Social Solutions You Can Trust',
  heroSubheadline:
    'With 6+ years of experience, Trust IT delivers reliable web development, custom software, social media solutions, graphic design, SEO, and business automation.',
  phone: '+880 1946-006100',
  email: 'hello@trustit.com',
  whatsapp: '+8801946006100',
  address: 'Banani, Dhaka 1213, Bangladesh · www.trustit.com',
  businessHours: '24/7 Support · Office Sun–Thu 9:30 AM – 6:30 PM (BST)',
  socialLinks: {
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    github: 'https://github.com',
  },
  stats: {
    yearsExperience: 6,
    projectsCompleted: 500,
    happyClients: 300,
    professionals: 50,
    clientSatisfaction: 98,
  },
  clientLogos: [
    { id: 'c1', name: 'Meghna Financial', sector: 'Banking & FinTech' },
    { id: 'c2', name: 'Bengal Thread Group', sector: 'Retail & Apparel' },
    { id: 'c3', name: 'CareLine Hospital', sector: 'Healthcare' },
    { id: 'c4', name: 'Apex Express BD', sector: 'Logistics' },
    { id: 'c5', name: 'Padma Agro Ltd.', sector: 'Manufacturing' },
    { id: 'c6', name: 'NordicBridge UK', sector: 'Global SaaS' },
  ],
  seoDefaults: {
    siteTitle: 'Trust IT — Building Digital Solutions You Can Trust',
    metaDescription: '6+ years of software, web, cloud, and cybersecurity delivery in Bangladesh.',
    keywords: ['IT Company in Bangladesh', 'Software Company in Bangladesh'],
  },
};

interface SiteSettingsContextValue {
  settings: WebsiteSettingItem;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: fallbackSettings,
  loading: false,
  refreshSettings: async () => {},
});

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<WebsiteSettingItem>(fallbackSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    try {
      const res = await api.get<{ item: WebsiteSettingItem | null }>('/settings');
      if (res.item) {
        setSettings(res.item);
      }
    } catch {
      // Keep fallback settings if offline
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
