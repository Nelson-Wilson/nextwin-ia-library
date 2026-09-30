import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../lib/database';
import { Product } from '../../types';
import { ProductHero } from '../../components/product/ProductHero';
import { ProductBenefits } from '../../components/product/ProductBenefits';
import { ProductContent } from '../../components/product/ProductContent';
import { ProductAudience } from '../../components/product/ProductAudience';
import { ProductIncludes } from '../../components/product/ProductIncludes';
import { ProductBonuses } from '../../components/product/ProductBonuses';
import { ProductLearn } from '../../components/product/ProductLearn';
import { ProductTestimonials } from '../../components/product/ProductTestimonials';
import { ProductFAQ } from '../../components/product/ProductFAQ';
import { ProductOffer } from '../../components/product/ProductOffer';
import { ProductCTA } from '../../components/product/ProductCTA';
import { analytics } from '../../services/analytics';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setNotFound(false);

    db.getProductBySlug(slug).then((prod) => {
      if (prod) {
        setProduct(prod);
        analytics.trackProductView(prod.id, prod.name);
        // Dynamic SEO Document Title & Description
        document.title = prod.seo_title || `${prod.name} | NextWin AI Library`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && prod.seo_description) {
          metaDesc.setAttribute('content', prod.seo_description);
        }
      } else {
        setNotFound(true);
      }
      setIsLoading(false);
    });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand"></div>
        <p className="text-sm text-muted">Carregando produto...</p>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-12 h-12 text-muted mb-4" />
        <h1 className="text-2xl font-bold text-ink mb-2">Produto não encontrado</h1>
        <p className="text-sm text-muted max-w-md mb-6">
          O produto que você procura não está disponível ou foi desativado temporariamente.
        </p>
        <Link
          to="/produtos"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-brand rounded-xl hover:bg-brand-strong transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Catálogo de Produtos
        </Link>
      </div>
    );
  }

  const blocks = product.block_settings || {
    hero: true,
    benefits: true,
    content: true,
    audience: true,
    includes: true,
    bonuses: true,
    testimonials: true,
    faq: true,
    offer: true,
    cta: true
  };

  return (
    <article className="min-h-screen pb-16 md:pb-0">
      {blocks.hero && <ProductHero product={product} />}
      {blocks.benefits && <ProductBenefits product={product} />}

      {/* "Por que este produto?" — includes card lives inside when both blocks are on */}
      {blocks.content && <ProductContent product={product} showIncludes={blocks.includes} />}
      {!blocks.content && blocks.includes && <ProductIncludes product={product} />}

      {/* "O que você vai aprender" + Bônus */}
      {blocks.content && <ProductLearn product={product} showBonuses={blocks.bonuses} />}
      {!blocks.content && blocks.bonuses && <ProductBonuses product={product} />}

      {blocks.audience && <ProductAudience product={product} />}
      {blocks.testimonials && <ProductTestimonials product={product} />}
      {blocks.faq && <ProductFAQ product={product} />}
      {blocks.offer && <ProductOffer product={product} />}
      {blocks.cta && <ProductCTA product={product} />}
    </article>
  );
};
