import React, { useState } from 'react';
import { Product } from '../../types';
import { Plus, Minus } from 'lucide-react';

export const ProductFAQ: React.FC<{ product: Product }> = ({ product }) => {
  const faqs = product.faqs || [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (faqs.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h2 className="text-xl sm:text-2xl font-extrabold text-ink">Perguntas frequentes</h2>
      <p className="text-xs text-muted mt-1 mb-6">Tire suas dúvidas antes de comprar.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.id || index} className="border border-line rounded-xl bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="w-full py-3.5 px-4 text-left flex items-center justify-between gap-4 text-xs font-semibold text-ink hover:text-brand transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                {isOpen ? <Minus className="w-4 h-4 text-brand shrink-0" /> : <Plus className="w-4 h-4 text-brand shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-0.5 text-xs text-muted leading-relaxed">{faq.answer}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
