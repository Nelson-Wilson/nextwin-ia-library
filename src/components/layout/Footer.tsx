import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';
import { db } from '../../lib/database';
import { analytics, getUTMParams } from '../../services/analytics';
import { Logo } from '../ui/Logo';
import { Instagram, Youtube, Facebook, Heart } from 'lucide-react';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M19.6 6.8a4.8 4.8 0 0 1-3.8-4.3V2h-3.4v13.7a2.9 2.9 0 1 1-2-2.8V9.4a6.3 6.3 0 1 0 5.4 6.3V9a8.2 8.2 0 0 0 4.8 1.5V7.1a4.8 4.8 0 0 1-1-.3z" />
  </svg>
);

const quickLinks = [
  { name: 'Início', to: '/' },
  { name: 'Produtos', to: '/produtos' },
  { name: 'Categorias', to: '/produtos#categorias' },
  { name: 'Blog', to: '/blog' },
  { name: 'Sobre', to: '/sobre' },
  { name: 'Contacto', to: '/contacto' },
];

const supportLinks = [
  { name: 'Perguntas frequentes', to: '/contacto' },
  { name: 'Política de privacidade', to: '/politica-privacidade' },
  { name: 'Política de reembolso', to: '/politica-reembolso' },
  { name: 'Termos de uso', to: '/termos' },
];

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const socials = [
    { label: 'TikTok', url: settings.tiktok_url, icon: <TikTokIcon /> },
    { label: 'Instagram', url: settings.instagram_url, icon: <Instagram className="w-4 h-4" /> },
    { label: 'YouTube', url: settings.youtube_url, icon: <Youtube className="w-4 h-4" /> },
    { label: 'Facebook', url: settings.facebook_url, icon: <Facebook className="w-4 h-4" /> },
  ].filter((s) => s.url);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const utm = getUTMParams();
      await db.saveLead({
        name: email.split('@')[0],
        email: email.trim(),
        source: 'newsletter',
        campaign: 'newsletter_footer',
        utm_source: utm.source,
        utm_medium: utm.medium,
        utm_campaign: utm.campaign,
        utm_content: utm.content,
        utm_term: utm.term,
        landing_page: window.location.pathname,
      });
      analytics.trackLeadSubmit(email.trim(), 'newsletter_footer');
      setStatus('done');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer className="bg-navy text-blue-100/80 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-2 md:col-span-4 space-y-4">
            <Logo light />
            <p className="text-xs leading-relaxed max-w-[220px]">
              Mais conhecimento. Mais oportunidades. Seu futuro começa aqui.
            </p>
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white">Links rápidos</h4>
            <ul className="space-y-2 text-xs">
              {quickLinks.map((l) => (
                <li key={l.name}><Link to={l.to} className="hover:text-white transition-colors">{l.name}</Link></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white">Suporte</h4>
            <ul className="space-y-2 text-xs">
              {supportLinks.map((l) => (
                <li key={l.name}><Link to={l.to} className="hover:text-white transition-colors">{l.name}</Link></li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white">Receba novidades</h4>
            <p className="text-xs">Fique por dentro de novos produtos, ofertas e conteúdos exclusivos.</p>
            <form onSubmit={subscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                placeholder="Seu email"
                aria-label="Seu email"
                className="min-w-0 flex-1 px-3 py-2 text-xs rounded-lg bg-white/10 border border-white/15 text-white placeholder-blue-200/60 focus:outline-none focus:border-cta"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-4 py-2 text-xs font-bold text-white bg-cta hover:bg-cta-strong rounded-lg disabled:opacity-60 cursor-pointer"
              >
                {status === 'loading' ? '...' : 'Inscrever'}
              </button>
            </form>
            {status === 'done' && <p className="text-xs text-cta" role="status">Inscrição feita. Obrigado!</p>}
            {status === 'error' && <p className="text-xs text-rose-300" role="alert">Não foi possível inscrever. Tente de novo.</p>}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <p>© {new Date().getFullYear()} {settings.site_name}. Todos os direitos reservados.</p>
          <p className="inline-flex items-center gap-1">
            Desenvolvido com <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> por NextWin
            <Link to="/admin/login" className="ml-3 text-blue-200/50 hover:text-white">Admin</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};
