import React from 'react';
import { Product } from '../../types';
import { ShoppingBag, CheckSquare } from 'lucide-react';

const fallback = [
  'Acesso vitalício ao material completo',
  'Download direto em PDF de alta qualidade',
  'Atualizações gratuitas de conteúdo',
  'Suporte prioritário via WhatsApp',
];

export const IncludesCard: React.FC<{ product: Product }> = ({ product }) => {
  const items = product.includes_items && product.includes_items.length > 0 ? product.includes_items : fallback;
  return (
    <div className="rounded-2xl bg-brand-soft/70 border border-blue-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-8 h-8 rounded-lg bg-white text-brand flex items-center justify-center shadow-card">
          <ShoppingBag className="w-4 h-4" />
        </span>
        <h3 className="text-sm font-extrabold text-ink">O que você vai receber</h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-ink">
            <CheckSquare className="w-4 h-4 text-brand shrink-0 mt-px" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/** Standalone version, used only when the "content" block is disabled but "includes" is enabled. */
export const ProductIncludes: React.FC<{ product: Product }> = ({ product }) => (
  <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
    <div className="max-w-md">
      <IncludesCard product={product} />
    </div>
  </section>
);
