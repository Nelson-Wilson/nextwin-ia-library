import React from 'react';
import { Link } from 'react-router-dom';
import { Bundle } from '../../types';
import { SafeImage } from '../ui/SafeImage';
import { Badge } from '../ui/Badge';
import { Check, ArrowRight } from 'lucide-react';

/** Combo banner (home) — pastel gradient, cover left, list center, price right. */
export const BundleCard: React.FC<{ bundle: Bundle }> = ({ bundle }) => {
  const hasOld = bundle.old_price && bundle.old_price > bundle.price;
  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-r from-blue-50 via-violet-50 to-pink-50 shadow-soft">
      <div className="absolute -top-16 -right-10 w-64 h-64 rounded-full bg-violet-200/40 blur-3xl pointer-events-none" />
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 sm:p-8">
        <div className="lg:col-span-4">
          <div className="rounded-2xl overflow-hidden shadow-soft bg-white max-w-xs mx-auto lg:max-w-none">
            <SafeImage
              src={bundle.cover_image}
              alt={bundle.name}
              fallbackTitle={bundle.name}
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <Badge tone="violet">Oferta especial</Badge>
          <h3 className="text-2xl font-extrabold text-ink">{bundle.name}</h3>
          <p className="text-xs text-muted leading-relaxed">{bundle.description}</p>
          {bundle.products && bundle.products.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1">
              {bundle.products.map((p) => (
                <li key={p.id} className="flex items-center gap-2 text-xs text-ink">
                  <span className="w-4 h-4 rounded-full bg-violet-100 text-violet flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </span>
                  <span className="truncate">{p.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-3 flex flex-col items-start lg:items-end gap-1 lg:text-right">
          {hasOld && (
            <span className="text-xs text-muted line-through tabular-nums">
              {bundle.old_price} {bundle.currency}
            </span>
          )}
          <span className="text-3xl font-extrabold text-ink tabular-nums">
            {bundle.price} {bundle.currency}
          </span>
          <Link
            to={`/combo/${bundle.slug}`}
            className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-cta hover:bg-cta-strong rounded-xl shadow-[0_6px_18px_rgba(0,208,132,0.28)] transition-colors w-full lg:w-auto"
          >
            Quero o Combo Completo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
