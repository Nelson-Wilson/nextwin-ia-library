import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/database';
import { analytics, getUTMParams } from '../../services/analytics';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { User, Mail, Phone, CheckCircle2, ArrowRight, Gift } from 'lucide-react';

const inputCls =
  'w-full pl-9 pr-3 py-2.5 text-xs rounded-lg bg-white border border-line text-ink placeholder-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10';

/**
 * Same submit logic as the original LeadCapturePage (db.saveLead + analytics),
 * now shared by the home banner and the /captura page.
 */
export const LeadCapture: React.FC<{ variant?: 'banner' | 'page' }> = ({ variant = 'banner' }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Por favor preencha nome e email.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    const utm = getUTMParams();
    try {
      await db.saveLead({
        name,
        email,
        whatsapp,
        source: utm.source || 'organico',
        campaign: utm.campaign || 'captura_10_prompts',
        utm_source: utm.source,
        utm_medium: utm.medium,
        utm_campaign: utm.campaign,
        utm_content: utm.content,
        utm_term: utm.term,
        landing_page: window.location.pathname,
      });
      analytics.trackLeadSubmit(email, 'captura_10_prompts');
      setSubmitted(true);
    } catch {
      setError('Erro ao salvar lead. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const wrapper =
    variant === 'page'
      ? 'max-w-3xl mx-auto'
      : '';

  return (
    <div className={wrapper}>
      <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-r from-blue-50 via-white to-violet-50 shadow-soft">
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-16 h-16 shrink-0 rounded-2xl bg-white shadow-card items-center justify-center text-brand">
              <Gift className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <Badge tone="green">Grátis</Badge>
              {variant === 'page' ? (
                <h1 className="text-xl sm:text-2xl font-extrabold text-ink">Receba 10 prompts gratuitos de ChatGPT</h1>
              ) : (
                <h2 className="text-xl sm:text-2xl font-extrabold text-ink">Receba 10 prompts gratuitos de ChatGPT</h2>
              )}
              <p className="text-xs text-muted leading-relaxed max-w-sm">
                Cadastre seu email e receba agora mesmo 10 prompts prontos para usar no seu dia a dia.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="rounded-2xl bg-white border border-emerald-100 p-5 text-center space-y-2" role="status">
              <CheckCircle2 className="w-8 h-8 text-cta-strong mx-auto" />
              <p className="text-sm font-bold text-ink">Inscrição confirmada, {name}!</p>
              <p className="text-xs text-muted">
                Seus 10 prompts foram enviados para <strong className="text-brand">{email}</strong>. Verifique também o spam.
              </p>
              <Link to="/produtos" className="inline-flex items-center gap-1 text-xs font-bold text-brand">
                Conhecer os produtos <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2.5" noValidate={false}>
              {error && (
                <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2" role="alert">{error}</p>
              )}
              <div className="relative">
                <User className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" required placeholder="Seu nome" aria-label="Seu nome" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
              </div>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="email" required placeholder="Seu email" aria-label="Seu email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Phone className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="tel" placeholder="Seu WhatsApp (opcional)" aria-label="Seu WhatsApp (opcional)" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputCls} />
                </div>
                <Button type="submit" size="sm" arrow disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Quero receber'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
