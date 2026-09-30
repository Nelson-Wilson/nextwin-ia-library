import React from 'react';
import { Testimonial } from '../../types';
import { Star } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial: t }) => (
  <div className="bg-white border border-line rounded-2xl p-5 shadow-card flex flex-col gap-3 h-full">
    <div className="flex items-center gap-3">
      {t.avatar ? (
        <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-brand-soft text-brand flex items-center justify-center font-bold text-sm">
          {t.name.charAt(0)}
        </div>
      )}
      <div>
        <p className="text-xs font-bold text-ink">{t.name}</p>
        <div className="flex gap-0.5" aria-label={`${t.rating} de 5 estrelas`}>
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>
    </div>
    <p className="text-xs text-muted leading-relaxed flex-1">“{t.text}”</p>
    {(t.role || t.company) && <Badge tone="blue" className="self-start">{t.role || t.company}</Badge>}
  </div>
);
