import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { SafeImage } from '../ui/SafeImage';
import { Badge } from '../ui/Badge';
import { ArrowRight } from 'lucide-react';

const badgeTones = ['blue', 'violet', 'green', 'blue'] as const;

export const ProductCard: React.FC<{ product: Product; index?: number }> = ({ product, index = 0 }) => {
  const hasOld = product.old_price && product.old_price > product.price;
  return (
    <div className="group flex flex-col bg-white border border-line rounded-2xl p-3 shadow-card hover:shadow-soft transition-shadow">
      <Link
        to={`/produto/${product.slug}`}
        className="relative block rounded-xl overflow-hidden bg-gradient-to-b from-brand-soft to-white aspect-[4/3]"
      >
        <Badge tone={badgeTones[index % badgeTones.length]} className="absolute top-2 left-2 z-10 !bg-brand !text-white">
          {product.category?.name || 'Material'}
        </Badge>
        <SafeImage
          src={product.cover_image}
          alt={product.name}
          fallbackTitle={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex-1 flex flex-col px-1 pt-3">
        <Link to={`/produto/${product.slug}`}>
          <h3 className="text-sm font-extrabold text-ink line-clamp-1">{product.name}</h3>
        </Link>
        <p className="mt-1 text-[11px] text-muted leading-relaxed line-clamp-2 min-h-[32px]">{product.short_description}</p>

        <div className="mt-3 flex items-baseline gap-2">
          {hasOld && (
            <span className="text-[11px] text-muted line-through tabular-nums">
              {product.old_price} {product.currency}
            </span>
          )}
          <span className="text-lg font-extrabold text-cta-strong tabular-nums">
            {product.price} {product.currency}
          </span>
        </div>

        <Link
          to={`/produto/${product.slug}`}
          className="mt-3 mb-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white bg-cta hover:bg-cta-strong rounded-lg transition-colors"
        >
          Comprar agora <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
