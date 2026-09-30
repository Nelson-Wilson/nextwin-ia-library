import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../ui/Logo';
import { Menu, X, Search, ShoppingCart, ShieldCheck } from 'lucide-react';

const navLinks = [
  { name: 'Início', path: '/' },
  { name: 'Produtos', path: '/produtos' },
  { name: 'Categorias', path: '/produtos#categorias' },
  { name: 'Blog', path: '/blog' },
  { name: 'Sobre', path: '/sobre' },
  { name: 'Contacto', path: '/contacto' },
];

export const Header: React.FC = () => {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path.includes('#')) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/') ||
      (path === '/produtos' && location.pathname.startsWith('/produto/'));
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/produtos?q=${encodeURIComponent(q)}` : '/produtos');
    setSearchOpen(false);
    setMobileOpen(false);
  };

  const account = isAdmin
    ? { to: '/admin', label: 'Painel', icon: true }
    : { to: '/admin/login', label: 'Entrar', icon: false };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between gap-4">
        <Logo />

        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium" aria-label="Principal">
          {navLinks.map((l) => (
            <Link
              key={l.name}
              to={l.path}
              className={`relative py-5 transition-colors ${
                isActive(l.path)
                  ? 'text-brand font-semibold after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 after:bg-brand after:rounded-full'
                  : 'text-ink hover:text-brand'
              }`}
            >
              {l.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {searchOpen ? (
            <form onSubmit={submitSearch} className="hidden sm:flex items-center">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => !query && setSearchOpen(false)}
                placeholder="Pesquisar produtos..."
                className="w-44 px-3 py-1.5 text-xs rounded-full border border-line bg-brand-soft text-ink placeholder-muted focus:outline-none focus:border-brand"
              />
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:inline-flex p-2 text-ink hover:text-brand"
              aria-label="Pesquisar"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
          )}

          <Link to="/produtos" className="relative p-2 text-ink hover:text-brand" aria-label="Ver produtos">
            <ShoppingCart className="w-[18px] h-[18px]" />
          </Link>

          <Link
            to={account.to}
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-1.5 text-xs font-semibold text-brand border border-brand rounded-full hover:bg-brand-soft transition-colors"
          >
            {account.icon && <ShieldCheck className="w-3.5 h-3.5" />}
            {account.label}
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-ink"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-line bg-white px-4 pt-3 pb-5 space-y-3">
          <form onSubmit={submitSearch} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-soft">
            <Search className="w-4 h-4 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar produtos..."
              className="flex-1 bg-transparent text-sm text-ink placeholder-muted focus:outline-none"
            />
          </form>
          <nav className="flex flex-col">
            {navLinks.map((l) => (
              <Link
                key={l.name}
                to={l.path}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(l.path) ? 'text-brand bg-brand-soft' : 'text-ink hover:bg-brand-soft'
                }`}
              >
                {l.name}
              </Link>
            ))}
          </nav>
          <Link
            to={account.to}
            onClick={() => setMobileOpen(false)}
            className="block text-center px-4 py-2.5 text-sm font-semibold text-brand border border-brand rounded-full"
          >
            {account.label}
          </Link>
        </div>
      )}
    </header>
  );
};
