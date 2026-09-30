import React from 'react';
import { Product } from '../../types';
import { analytics } from '../../services/analytics';
import { Button } from '../ui/Button';
import { Rocket } from 'lucide-react';

export const ProductCTA: React.FC<{ product: Product }> = ({ product }) => {
  const handleBuyClick = () => {
    analytics.trackCheckoutClick(product.id, product.checkout_url, product.price, product.currency);
    window.open(product.checkout_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy via-[#14306b] to-violet px-6 sm:px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
              <Rocket className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">Pronto para transformar o seu futuro?</h3>
              <p className="text-xs text-blue-100/80 mt-0.5 max-w-xl">
                Comece agora e descubra todo o potencial da Inteligência Artificial para sua vida.
              </p>
            </div>
          </div>
          <Button onClick={handleBuyClick} variant="cta" size="md" arrow className="self-stretch md:self-auto">
            Comprar agora
          </Button>
        </div>
      </section>

      {/* Mobile sticky buy bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-line p-3 flex items-center justify-between gap-3 shadow-[0_-4px_20px_rgba(15,39,71,0.08)]">
        <div className="min-w-0">
          <p className="text-xs font-bold text-ink truncate">{product.name}</p>
          <p className="text-xs font-extrabold text-cta-strong tabular-nums">{product.price} {product.currency}</p>
        </div>
        <Button onClick={handleBuyClick} variant="cta" size="sm" arrow>Comprar agora</Button>
      </div>
    </>
  );
};
