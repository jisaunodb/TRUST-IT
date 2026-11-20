import { useState } from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  ChevronRight,
  FileText,
  FolderKanban,
  HelpCircle,
  Inbox,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Settings,
  Tags,
  UserCircle,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { ToastProvider } from '../components/admin/AdminUi';
import { BrandLogo } from '../components/common/BrandLogo';
import { useAuth } from '../hooks/useAuth';

const navSections = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
      { label: 'Contact Messages', to: '/admin/messages', icon: Inbox },
      { label: 'Job Applications', to: '/admin/applications', icon: Briefcase },
    ],
  },
  {
    label: 'CMS Content',
    items: [
      { label: 'Services', to: '/admin/services', icon: Wrench },
      { label: 'Solutions', to: '/admin/solutions', icon: Layers },
      { label: 'Industries', to: '/admin/industries', icon: Building2 },
      { label: 'Projects', to: '/admin/projects', icon: FolderKanban },
      { label: 'Case Studies', to: '/admin/case-studies', icon: FileText },
      { label: 'Blog Posts', to: '/admin/blog', icon: FileText },
      { label: 'Categories', to: '/admin/categories', icon: Tags },
    ],
  },
  {
    label: 'Organization',
    items: [
      { label: 'Team Members', to: '/admin/team', icon: Users },
      { label: 'Testimonials', to: '/admin/testimonials', icon: MessageSquareQuote },
      { label: 'FAQs', to: '/admin/faqs', icon: HelpCircle },
      { label: 'Careers', to: '/admin/careers', icon: Briefcase },
      { label: 'Website Settings', to: '/admin/settings', icon: Settings },
      { label: 'Admin Profile', to: '/admin/profile', icon: UserCircle },
    ],
  },
];

export function AdminLayout() {
  const { admin, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-sm text-slate-600">
        Verifying administrative session...
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const segments = location.pathname.replace(/^\/admin\/?/, '').split('/').filter(Boolean);
  const currentTitle = segments[0] ? segments[0].replace(/-/g, ' ') : 'Dashboard';

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-100 text-slate-900 flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-slate-300 border-r border-slate-800 flex flex-col transition-transform lg:translate-x-0 lg:static ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between shrink-0">
            <Link to="/admin" className="inline-flex items-center gap-2.5 text-white tracking-tight">
              <BrandLogo variant="sidebar" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded">
                CMS
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav aria-label="Admin Navigation" className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
            {navSections.map((sec) => (
              <div key={sec.label}>
                <p className="px-3 text-[11px] font-semibold text-slate-500 mb-2">{sec.label}</p>
                <div className="space-y-0.5">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const active =
                      item.to === '/admin'
                        ? location.pathname === '/admin'
                        : location.pathname.startsWith(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          active
                            ? 'bg-blue-700 text-white'
                            : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800 text-xs space-y-2">
            <Link
              to="/"
              target="_blank"
              className="block w-full text-center py-2 px-3 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-900 transition-colors"
            >
              View Public Website
            </Link>
          </div>
        </aside>

        {/* Main Workspace */}
        <div className="flex-1 min-w-0 flex flex-col">
          <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              <nav aria-label="Admin Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 capitalize truncate">
                <span>Admin</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-950 truncate">{currentTitle}</span>
              </nav>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <Link to="/admin/profile" className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-slate-950">{admin.name}</p>
                <p className="text-[11px] text-slate-500">{admin.role}</p>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </header>

          <main className="flex-1 p-6 max-w-[1440px] w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
