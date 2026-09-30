import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../lib/database';
import { Bundle, Product } from '../../types';
import { SafeImage } from '../../components/ui/SafeImage';
import { analytics } from '../../services/analytics';
import { ArrowLeft, ArrowRight, ShieldCheck, Check, Layers } from 'lucide-react';

export const BundlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);

    db.getBundleBySlug(slug).then((b) => {
      if (b) {
        setBundle(b);
        analytics.trackProductView(b.id, b.name);
        document.title = `${b.name} | NextWin AI Library`;
      }
      setIsLoading(false);
    });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-100"></div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-ink">Combo não encontrado</h2>
        <Link to="/produtos" className="inline-flex items-center gap-2 text-xs font-semibold text-brand">
          <ArrowLeft className="w-4 h-4" />
          Voltar para produtos
        </Link>
      </div>
    );
  }

  const handleBuyClick = () => {
    analytics.trackCheckoutClick(bundle.id, bundle.checkout_url, bundle.price, bundle.currency);
    window.open(bundle.checkout_url, '_blank', 'noopener,noreferrer');
  };

  const discountPercent = bundle.old_price && bundle.old_price > bundle.price
    ? Math.round(((bundle.old_price - bundle.price) / bundle.old_price) * 100)
    : null;

  return (
    <div className="min-h-screen pb-20">
      
      {/* Hero section */}
      <section className="pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-line bg-gradient-to-b from-brand-soft to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link
            to="/produtos"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-brand mb-8 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao Catálogo
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Pacote Econômico Especial</span>
                {discountPercent && (
                  <>
                    <span aria-hidden="true" className="text-muted">·</span>
                    <span className="text-cta-strong">{discountPercent}% de Economia</span>
                  </>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink ">
                {bundle.name}
              </h1>

              <p className="text-base text-muted leading-relaxed max-w-2xl">
                {bundle.description}
              </p>

              {/* Price */}
              <div className="pt-2 flex items-baseline gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-ink  tabular-nums">
                    {bundle.price} {bundle.currency}
                  </span>
                  {bundle.old_price && (
                    <span className="text-xl text-muted line-through tabular-nums">
                      {bundle.old_price} {bundle.currency}
                    </span>
                  )}
                </div>
                <span className="text-xs text-cta-strong font-semibold">Preço especial de bundle</span>
              </div>

              {/* CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={handleBuyClick}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-brand hover:bg-brand-strong rounded-lg shadow-xl shadow-soft transition-all cursor-pointer"
                >
                  <span>Garantir o Combo Agora</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 text-xs text-muted justify-center sm:justify-start">
                  <ShieldCheck className="w-4 h-4 text-cta-strong" />
                  <span>Acesso aos 3 produtos via EscalePay</span>
                </div>
              </div>
            </div>

            {/* Visual Cover */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md rounded-2xl overflow-hidden border border-line bg-white shadow-2xl">
                <SafeImage
                  src={bundle.cover_image}
                  alt={bundle.name}
                  fallbackTitle={bundle.name}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Included Products Detail */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-brand">Conteúdo do Pacote</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink ">
            Tudo o que você leva neste Combo
          </h2>
          <p className="text-muted text-sm">
            Adquirindo o combo você tem acesso a todos estes produtos com desconto imediato:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bundle.products?.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-line rounded-xl overflow-hidden p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-white mb-3">
                  <SafeImage
                    src={p.cover_image}
                    alt={p.name}
                    fallbackTitle={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs font-bold uppercase text-brand tracking-wider">
                  {p.product_type.replace('_', ' ')}
                </div>
                <h3 className="text-base font-bold text-ink">{p.name}</h3>
                <p className="text-xs text-muted leading-relaxed line-clamp-3">
                  {p.short_description}
                </p>
              </div>

              <div className="pt-4 border-t border-line flex items-center justify-between text-xs">
                <span className="text-muted">Preço individual:</span>
                <span className="font-semibold text-ink">{p.price} {p.currency}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA Bar */}
        <div className="mt-12 p-8 rounded-2xl bg-brand-soft border border-blue-100 text-center space-y-4 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-ink">Aproveite esta condição única</h3>
          <p className="text-xs sm:text-sm text-muted">
            Tenha acesso completo e vitalício aos materiais reunidos da NextWin AI Library.
          </p>
          <button
            onClick={handleBuyClick}
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-brand hover:bg-brand-strong rounded-lg shadow-lg cursor-pointer"
          >
            <span>Comprar Combo por {bundle.price} {bundle.currency}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
