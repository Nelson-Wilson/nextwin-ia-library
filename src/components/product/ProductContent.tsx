import React from 'react';
import { Product } from '../../types';
import { SafeImage } from '../ui/SafeImage';
import { IncludesCard } from './ProductIncludes';
import { Check } from 'lucide-react';

const fallbackPoints = [
  'Conteúdo prático e direto ao ponto',
  'Exemplos reais e aplicáveis',
  'Estratégias testadas no mercado',
  'Ideal para iniciantes e avançados',
];

export const ProductContent: React.FC<{ product: Product; showIncludes?: boolean }> = ({ product, showIncludes = true }) => {
  const points = product.benefits && product.benefits.length > 0 ? product.benefits.map((b) => b.title) : fallbackPoints;
  const image = product.gallery?.[1] || product.cover_image;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className={`grid grid-cols-1 gap-8 items-center ${showIncludes ? 'lg:grid-cols-[1.1fr_0.9fr_1.2fr]' : 'lg:grid-cols-2'}`}>
        <div className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand">Por que este produto?</p>
          <h2 className="text-2xl sm:text-[28px] font-extrabold text-ink leading-tight">
            Transforme conhecimento em oportunidades reais
          </h2>
          <p className="text-xs text-muted leading-relaxed">{product.full_description || product.short_description}</p>
          <ul className="space-y-2.5 pt-1">
            {points.map((p, i) => (
              <li key={i} className="flex items-center gap-2.5 text-xs text-ink">
                <span className="w-5 h-5 rounded-full bg-cta text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {showIncludes && <IncludesCard product={product} />}

        <div className="rounded-2xl overflow-hidden border border-line bg-gradient-to-br from-brand-soft to-white shadow-soft">
          <SafeImage src={image} alt={product.name} fallbackTitle={product.name} className="w-full aspect-[4/3] object-cover" />
        </div>
      </div>
    </section>
  );
};
