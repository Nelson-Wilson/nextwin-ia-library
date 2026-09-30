import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';
import { db } from '../../lib/database';
import { Product, Category } from '../../types';
import { ProductCard } from '../../components/marketing/ProductCard';
import { ArrowLeft, FolderOpen } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useSettings();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);

    Promise.all([db.getCategories(), db.getProducts()]).then(([cats, prods]) => {
      const currentCat = cats.find(c => c.slug === slug);
      if (currentCat) {
        setCategory(currentCat);
        setProducts(prods.filter(p => p.category_id === currentCat.id && p.active && p.published));
        document.title = `${currentCat.name} | ${settings.site_name}`;
      }
      setIsLoading(false);
    });
  }, [slug, settings.site_name]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-100"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <FolderOpen className="w-12 h-12 text-muted mx-auto" />
        <h2 className="text-xl font-bold text-ink">Categoria não encontrada</h2>
        <Link to="/produtos" className="inline-flex items-center gap-2 text-xs font-semibold text-brand">
          <ArrowLeft className="w-4 h-4" />
          Voltar para todos os produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link 
        to="/produtos"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-brand transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Voltar para todos os produtos
      </Link>

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-brand">Categoria</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink ">
          {category.name}
        </h1>
        <p className="text-muted text-sm sm:text-base max-w-2xl leading-relaxed">
          {category.description}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="py-16 text-center text-muted text-sm">
          Ainda não há produtos cadastrados nesta categoria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
