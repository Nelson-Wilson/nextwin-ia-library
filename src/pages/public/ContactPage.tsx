import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Mail, MessageCircle, Send, CheckCircle2, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-brand">Atendimento</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink ">
          Fale com a nossa equipe
        </h1>
        <p className="text-muted text-sm sm:text-base leading-relaxed">
          Tem dúvidas sobre downloads, pagamentos via EscalePay ou sugestões de novos temas? Estamos prontos para ajudar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Contact info cards */}
        <div className="space-y-4">
          
          <div className="p-6 rounded-xl bg-white border border-line space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-cta-strong">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink">Suporte via WhatsApp</h3>
            <p className="text-xs text-muted">Atendimento ágil para dúvidas de compra e entrega de arquivos.</p>
            <a
              href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cta-strong hover:text-cta-strong"
            >
              <span>Conversar no WhatsApp ({settings.whatsapp_number})</span>
              &rarr;
            </a>
          </div>

          <div className="p-6 rounded-xl bg-white border border-line space-y-3">
            <div className="w-10 h-10 rounded-lg bg-brand-soft border border-blue-100 flex items-center justify-center text-brand">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink">Email Corporativo</h3>
            <p className="text-xs text-muted">Para parcerias, suporte formal e solicitações administrativas.</p>
            <a
              href={`mailto:${settings.contact_email}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-strong"
            >
              <span>{settings.contact_email}</span>
              &rarr;
            </a>
          </div>

          <div className="p-4 rounded-xl bg-white border border-line text-xs text-muted flex items-center gap-3">
            <Clock className="w-4 h-4 text-muted shrink-0" />
            <span>Horário de Atendimento: Segunda a Sábado, das 08h às 19h (CAT).</span>
          </div>

        </div>

        {/* Message Form */}
        <div className="p-6 sm:p-8 rounded-xl bg-white border border-line">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-cta-strong mx-auto" />
              <h3 className="text-base font-bold text-ink">Mensagem Enviada!</h3>
              <p className="text-xs text-muted">Nossa equipe retornará no seu email dentro de poucas horas.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-2">Envie uma mensagem</h3>
              
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Nome</label>
                <input
                  type="text"
                  required
                  placeholder="Seu nome"
                  className="w-full px-3 py-2 bg-white border border-line rounded-lg text-xs text-ink placeholder-muted focus:outline-none focus:border-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-3 py-2 bg-white border border-line rounded-lg text-xs text-ink placeholder-muted focus:outline-none focus:border-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Mensagem</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Como podemos te ajudar hoje?"
                  className="w-full px-3 py-2 bg-white border border-line rounded-lg text-xs text-ink placeholder-muted focus:outline-none focus:border-blue-100"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-brand hover:bg-brand-strong rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Mensagem</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
