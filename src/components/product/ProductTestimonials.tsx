import React from 'react';
import { Product } from '../../types';
import { TestimonialCard } from '../marketing/TestimonialCard';

export const ProductTestimonials: React.FC<{ product: Product }> = ({ product }) => {
  const testimonials = product.testimonials || [];
  if (testimonials.length === 0) return null;
  return (
    <section className="bg-brand-soft/40 border-y border-line/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl sm:text-2xl font-extrabold text-ink mb-6">O que dizem nossos alunos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
};
