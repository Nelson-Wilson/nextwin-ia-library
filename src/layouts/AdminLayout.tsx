import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  FolderTree,
  Tag,
  Ticket,
  Image as ImageIcon,
  MessageSquareQuote,
  HelpCircle,
  Users,
  ShoppingBag,
  BarChart3,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center text-slate-300">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Produtos', path: '/admin/products', icon: Package },
    { name: 'Categorias', path: '/admin/categories', icon: FolderTree },
    { name: 'Combos / Bundles', path: '/admin/bundles', icon: Layers },
    { name: 'Ofertas', path: '/admin/offers', icon: Tag },
    { name: 'Cupons', path: '/admin/coupons', icon: Ticket },
    { name: 'Banners', path: '/admin/banners', icon: ImageIcon },
    { name: 'Depoimentos', path: '/admin/testimonials', icon: MessageSquareQuote },
    { name: 'Perguntas FAQ', path: '/admin/faqs', icon: HelpCircle },
    { name: 'Leads Capturados', path: '/admin/leads', icon: Users },
    { name: 'Pedidos EscalePay', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Analytics & UTM', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Blog Posts', path: '/admin/blog', icon: FileText },
    { name: 'Configurações', path: '/admin/settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen flex bg-[#0A0E1A] text-slate-100 font-sans">
      
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#070A12] border-r border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
          <Link to="/admin" className="font-display font-bold text-base tracking-tight text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50 animate-pulse" />
            <span>NextWin Admin</span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick site preview & User footer */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Ver Loja Pública
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="truncate max-w-[140px]">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Administrador'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-md hover:bg-slate-900"
              title="Encerrar sessão"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top bar for admin */}
        <header className="h-16 px-4 sm:px-8 border-b border-slate-800/80 bg-[#0A0E1A]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-semibold text-slate-200">
              {menuItems.find(m => m.path === location.pathname)?.name || 'Painel de Controle'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Moeda: <strong className="text-slate-200">{settings.default_currency}</strong>
            </span>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <Link
              to="/admin/products/new"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors"
            >
              + Novo Produto
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
