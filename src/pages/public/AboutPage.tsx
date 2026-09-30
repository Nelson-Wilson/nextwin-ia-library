import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { ShieldCheck, Target, Zap, BookOpen } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-brand">Institucional</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink ">
          Sobre a {settings.site_name}
        </h1>
        <p className="text-base sm:text-lg text-muted leading-relaxed">
          Nossa missão é democratizar o domínio da Inteligência Artificial aplicada, transformando modelos complexos em ferramentas simples, acessíveis e geradoras de renda real.
        </p>
      </div>

      <div className="space-y-6 text-sm text-muted leading-relaxed">
        <p>
          Acreditamos que a inteligência artificial não veio para substituir profissionais com iniciativa, mas para multiplicar a velocidade daqueles que sabem operá-la com maestria.
        </p>
        <p>
          A NextWin AI Library nasceu para resolver uma dor latente do mercado: o excesso de conteúdos puramente teóricos e acadêmicos, sem aplicabilidade prática imediata. Cada ebook, pacote de prompts, apostila e curso disponível na nossa plataforma passa por curadoria rigorosa, testes no mundo real e foco obsessivo em produtividade e geração de negócios.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
        <div className="p-6 rounded-xl bg-white border border-line space-y-3">
          <div className="w-10 h-10 rounded-lg bg-brand-soft flex items-center justify-center text-brand border border-blue-100">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-ink">Prática Direta</h3>
          <p className="text-xs text-muted leading-relaxed">
            Sem enrolação. O cliente adquire o material e começa a aplicar no mesmo dia.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white border border-line space-y-3">
          <div className="w-10 h-10 rounded-lg bg-brand-soft flex items-center justify-center text-brand border border-blue-100">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-ink">Foco em Resultados</h3>
          <p className="text-xs text-muted leading-relaxed">
            Prompts e métodos projetados para gerar economia de tempo ou receita financeira.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white border border-line space-y-3">
          <div className="w-10 h-10 rounded-lg bg-brand-soft flex items-center justify-center text-brand border border-blue-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-ink">Transparência & Confiança</h3>
          <p className="text-xs text-muted leading-relaxed">
            Processamento transparente via EscalePay, com suporte humano e 7 dias de garantia.
          </p>
        </div>
      </div>

    </div>
  );
};
