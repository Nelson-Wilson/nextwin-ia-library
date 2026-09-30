import React from 'react';
import { Product } from '../../types';
import { Zap, ShieldCheck, Infinity as InfinityIcon, CloudDownload } from 'lucide-react';

const items = [
  { icon: Zap, title: 'Aprenda no seu ritmo', text: 'Acesse o material quando quiser, onde estiver.' },
  { icon: ShieldCheck, title: 'Suporte por email', text: 'Tire suas dúvidas e receba ajuda quando precisar.' },
  { icon: InfinityIcon, title: 'Acesso vitalício', text: 'O conteúdo é seu para sempre.' },
  { icon: CloudDownload, title: 'Atualizações gratuitas', text: 'Receba novos conteúdos e melhorias.' },
];

export const ProductBenefits: React.FC<{ product: Product }> = () => (
  <section className="bg-brand-soft/60 border-y border-line/60">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {items.map((b) => (
        <div key={b.title} className="flex items-start gap-3">
          <span className="w-11 h-11 rounded-xl bg-white shadow-card text-brand flex items-center justify-center shrink-0">
            <b.icon className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-xs font-bold text-ink">{b.title}</h3>
            <p className="text-[11px] text-muted leading-snug mt-0.5">{b.text}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);
