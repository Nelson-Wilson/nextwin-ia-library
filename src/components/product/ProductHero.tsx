import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { SafeImage } from '../ui/SafeImage';
import { analytics } from '../../services/analytics';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ShieldCheck, FileText, Infinity as InfinityIcon, RefreshCw, Crown, Home, ChevronRight, Lock } from 'lucide-react';

export const ProductHero: React.FC<{ product: Product }> = ({ product }) => {
  const images = Array.from(new Set([product.cover_image, ...(product.gallery || [])].filter(Boolean)));
  const [active, setActive] = useState(0);

  // Purchase logic unchanged from the original component.
  const handleBuyClick = () => {
    analytics.trackCheckoutClick(product.id, product.checkout_url, product.price, product.currency);
    window.open(product.checkout_url, '_blank', 'noopener,noreferrer');
  };

  const discountPercent =
    product.old_price && product.old_price > product.price
      ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
      : null;

  const isEbook = product.product_type === 'ebook';
  const perks = [
    { icon: FileText, title: isEbook ? 'Ebook em PDF' : 'Material digital', sub: '(instantâneo)' },
    { icon: InfinityIcon, title: 'Acesso vitalício', sub: 'ao material' },
    { icon: RefreshCw, title: 'Atualizações', sub: 'gratuitas' },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-10">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-muted mb-5">
        <Link to="/" aria-label="Início" className="hover:text-brand"><Home className="w-3.5 h-3.5" /></Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/produtos" className="hover:text-brand">Produtos</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-ink font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {/* Gallery */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 items-start">
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-2.5 sm:w-[60px] shrink-0">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Ver imagem ${i + 1}`}
                  aria-current={i === active}
                  className={`w-14 h-16 sm:w-[60px] rounded-xl overflow-hidden border-2 bg-brand-soft transition-colors cursor-pointer ${
                    i === active ? 'border-brand' : 'border-line hover:border-blue-200'
                  }`}
                >
                  <SafeImage src={src} alt="" fallbackTitle="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="relative flex-1 w-full rounded-2xl overflow-hidden border border-line bg-gradient-to-b from-brand-soft to-white shadow-soft">
            {product.featured && (
              <Badge tone="amber" className="absolute top-3 right-3 z-10 shadow">
                <Crown className="w-3 h-3" /> Mais vendido
              </Badge>
            )}
            <SafeImage
              src={images[active]}
              alt={product.name}
              fallbackTitle={product.name}
              className="w-full aspect-[4/3] sm:aspect-[5/4] object-cover object-center"
            />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <Badge tone="blue">{product.category?.name || 'Material digital'}</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink leading-tight">{product.name}</h1>
          <p className="text-base font-semibold text-brand leading-snug">{product.short_description}</p>
          {product.full_description && product.full_description !== product.short_description && (
            <p className="text-sm text-muted leading-relaxed line-clamp-4">{product.full_description}</p>
          )}

          <div className="flex items-center gap-3 flex-wrap pt-1">
            {product.old_price && product.old_price > product.price && (
              <span className="text-base text-muted line-through tabular-nums">
                {product.old_price} {product.currency}
              </span>
            )}
            {discountPercent && <Badge tone="green" className="!bg-cta !text-white">{discountPercent}% OFF</Badge>}
            <span className="text-3xl font-extrabold text-ink tabular-nums">
              {product.price} {product.currency}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 border-y border-line">
            {perks.map((p) => (
              <div key={p.title} className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-brand-soft text-brand flex items-center justify-center shrink-0">
                  <p.icon className="w-4 h-4" />
                </span>
                <span className="text-[10px] leading-tight text-muted">
                  <span className="block font-semibold text-ink">{p.title}</span>
                  {p.sub}
                </span>
              </div>
            ))}
          </div>

          <Button onClick={handleBuyClick} variant="cta" size="lg" full arrow>
            Comprar agora
          </Button>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-brand" /> Compra segura via EscalePay</span>
            <span className="inline-flex items-center gap-1.5"><Lock className="w-4 h-4 text-brand" /> Pagamento 100% seguro</span>
          </div>
        </div>
      </div>
    </section>
  );
};
