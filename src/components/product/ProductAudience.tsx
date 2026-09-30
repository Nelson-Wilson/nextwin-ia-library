import React from 'react';
import { Product } from '../../types';
import { GraduationCap, Briefcase, TrendingUp, User } from 'lucide-react';

const cards = [
  { icon: GraduationCap, title: 'Estudantes', text: 'Que querem se destacar e criar novas oportunidades.', bg: 'bg-blue-50', fg: 'text-brand' },
  { icon: Briefcase, title: 'Profissionais', text: 'Que desejam aumentar a produtividade e sua renda.', bg: 'bg-violet-50', fg: 'text-violet' },
  { icon: TrendingUp, title: 'Empreendedores', text: 'Que buscam inovar e escalar seus negócios.', bg: 'bg-emerald-50', fg: 'text-cta-strong' },
  { icon: User, title: 'Pessoas em busca de renda extra', text: 'Que querem liberdade financeira e mais independência.', bg: 'bg-orange-50', fg: 'text-orange-500' },
];

export const ProductAudience: React.FC<{ product: Product }> = ({ product }) => (
  <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
    <h2 className="text-xl sm:text-2xl font-extrabold text-ink">Para quem é este produto?</h2>
    <p className="text-xs text-muted mt-1 mb-6 max-w-2xl">{product.audience_text || 'O guia é ideal para:'}</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.title} className={`${c.bg} rounded-2xl p-5 space-y-2`}>
          <span className={`w-9 h-9 rounded-xl bg-white shadow-card flex items-center justify-center ${c.fg}`}>
            <c.icon className="w-[18px] h-[18px]" />
          </span>
          <h3 className="text-sm font-extrabold text-ink">{c.title}</h3>
          <p className="text-[11px] text-muted leading-relaxed">{c.text}</p>
        </div>
      ))}
    </div>
  </section>
);
