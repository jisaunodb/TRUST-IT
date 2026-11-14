import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { SiteSettingsProvider } from './hooks/useSiteSettings';
import { PublicLayout } from './layouts/PublicLayout';
import { AboutPage } from './pages/AboutPage';
import { BlogDetailPage, BlogPage } from './pages/BlogPages';
import { CareerDetailPage, CareersPage } from './pages/CareersPages';
import { CaseStudiesPage, CaseStudyDetailPage } from './pages/CaseStudiesPages';
import { FaqPage, PricingPage, TeamPage, TechnologiesPage, TestimonialsPage } from './pages/CompanyExtraPages';
import { ContactPage, HtmlSitemapPage, LegalPage, NotFoundPage, SearchPage } from './pages/ContactAndSearchPages';
import { HomePage } from './pages/HomePage';
import { IndustriesPage, IndustryDetailPage } from './pages/IndustriesPages';
import { ProjectDetailPage, ProjectsPage } from './pages/PortfolioPages';
import { ServiceDetailPage, ServicesPage } from './pages/ServicesPages';
import { SolutionDetailPage, SolutionsPage } from './pages/SolutionsPages';

// Lazy-load Admin Panel so public visitors download zero admin/chart bundle overhead
const AdminLayout = lazy(() => import('./layouts/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const AdminLoginPage = lazy(() =>
  import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage }))
);
const AdminDashboardPage = lazy(() =>
  import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
);
const ResourceManagerPage = lazy(() =>
  import('./pages/admin/ResourceManagerPage').then((m) => ({ default: m.ResourceManagerPage }))
);
const AdminServicesPage = lazy(() =>
  import('./pages/admin/AdminServicesPage').then((m) => ({ default: m.AdminServicesPage }))
);
const AdminMessagesPage = lazy(() =>
  import('./pages/admin/LeadsAndAppsPages').then((m) => ({ default: m.AdminMessagesPage }))
);
const AdminApplicationsPage = lazy(() =>
  import('./pages/admin/LeadsAndAppsPages').then((m) => ({ default: m.AdminApplicationsPage }))
);
const AdminSettingsPage = lazy(() =>
  import('./pages/admin/SettingsAndProfilePages').then((m) => ({ default: m.AdminSettingsPage }))
);
const AdminProfilePage = lazy(() =>
  import('./pages/admin/SettingsAndProfilePages').then((m) => ({ default: m.AdminProfilePage }))
);

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center text-sm text-slate-500">
      Loading...
    </div>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md bg-white border border-slate-200 rounded-xl p-8 text-center space-y-4">
            <h1 className="text-xl font-bold text-slate-950">Something went wrong</h1>
            <p className="text-sm text-slate-600">
              An unexpected display error occurred. Reload the page to continue.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 text-sm font-semibold bg-blue-700 text-white rounded-lg cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <SiteSettingsProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Website */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/services/:slug" element={<ServiceDetailPage />} />
                  <Route path="/solutions" element={<SolutionsPage />} />
                  <Route path="/solutions/:slug" element={<SolutionDetailPage />} />
                  <Route path="/industries" element={<IndustriesPage />} />
                  <Route path="/industries/:slug" element={<IndustryDetailPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/:slug" element={<ProjectDetailPage />} />
                  <Route path="/case-studies" element={<CaseStudiesPage />} />
                  <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
                  <Route path="/technologies" element={<TechnologiesPage />} />
                  <Route path="/team" element={<TeamPage />} />
                  <Route path="/careers" element={<CareersPage />} />
                  <Route path="/careers/:slug" element={<CareerDetailPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogDetailPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FaqPage />} />
                  <Route path="/testimonials" element={<TestimonialsPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
                  <Route path="/terms-and-conditions" element={<LegalPage type="terms" />} />
                  <Route path="/cookie-policy" element={<LegalPage type="cookies" />} />
                  <Route path="/sitemap" element={<HtmlSitemapPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* Separate Protected Admin Panel */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="messages" element={<AdminMessagesPage />} />
                  <Route path="applications" element={<AdminApplicationsPage />} />
                  <Route path="services" element={<AdminServicesPage />} />
                  <Route path="solutions" element={<ResourceManagerPage resourceKey="solutions" />} />
                  <Route path="industries" element={<ResourceManagerPage resourceKey="industries" />} />
                  <Route path="projects" element={<ResourceManagerPage resourceKey="projects" />} />
                  <Route path="case-studies" element={<ResourceManagerPage resourceKey="case-studies" />} />
                  <Route path="blog" element={<ResourceManagerPage resourceKey="blog" />} />
                  <Route path="categories" element={<ResourceManagerPage resourceKey="categories" />} />
                  <Route path="team" element={<ResourceManagerPage resourceKey="team" />} />
                  <Route path="testimonials" element={<ResourceManagerPage resourceKey="testimonials" />} />
                  <Route path="faqs" element={<ResourceManagerPage resourceKey="faqs" />} />
                  <Route path="careers" element={<ResourceManagerPage resourceKey="careers" />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                  <Route path="profile" element={<AdminProfilePage />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </SiteSettingsProvider>
    </ErrorBoundary>
  );
}
