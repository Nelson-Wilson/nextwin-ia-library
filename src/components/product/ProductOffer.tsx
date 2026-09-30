import React from 'react';
import { Product } from '../../types';
import { analytics } from '../../services/analytics';
import { Button } from '../ui/Button';
import { ShieldCheck, Clock } from 'lucide-react';

export const ProductOffer: React.FC<{ product: Product }> = ({ product }) => {
  const handleBuyClick = () => {
    analytics.trackCheckoutClick(product.id, product.checkout_url, product.price, product.currency);
    window.open(product.checkout_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-blue-50 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cta-strong">
            <Clock className="w-3.5 h-3.5" /> Condição especial por tempo limitado
          </span>
          <h2 className="text-xl font-extrabold text-ink">Garanta seu acesso agora mesmo</h2>
          <p className="text-xs text-muted">Pagamento único, sem mensalidades. Garantia de 7 dias.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="sm:text-right">
            {product.old_price && product.old_price > product.price && (
              <div className="text-xs text-muted line-through tabular-nums">{product.old_price} {product.currency}</div>
            )}
            <div className="text-3xl font-extrabold text-ink tabular-nums">{product.price} {product.currency}</div>
          </div>
          <Button onClick={handleBuyClick} variant="cta" size="lg" arrow>Comprar agora</Button>
        </div>
        <p className="md:hidden text-[11px] text-muted flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-brand" /> Checkout seguro EscalePay
        </p>
      </div>
    </section>
  );
};
