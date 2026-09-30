import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../../lib/database';
import { Product, Category, ProductType } from '../../types';
import { ProductCard } from '../../components/marketing/ProductCard';
import { Search, Filter, SlidersHorizontal, BookOpen } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const categoryFilter = searchParams.get('categoria') || 'all';
  const typeFilter = searchParams.get('tipo') || 'all';
  // keep header search (?q=) in sync when navigating from another page
  const urlQuery = searchParams.get('q') || '';
  useEffect(() => { setSearchTerm(urlQuery); }, [urlQuery]);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  useEffect(() => {
    Promise.all([db.getProducts(), db.getCategories()]).then(([prods, cats]) => {
      setProducts(prods.filter(p => p.active && p.published));
      setCategories(cats.filter(c => c.active));
      setIsLoading(false);
    });
  }, []);

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug === 'all') params.delete('categoria');
    else params.set('categoria', slug);
    setSearchParams(params);
  };

  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams);
    if (type === 'all') params.delete('tipo');
    else params.set('tipo', type);
    setSearchParams(params);
  };

  // Filter & Sort logic
  const filteredProducts = products
    .filter((p) => {
      // Category match
      if (categoryFilter !== 'all') {
        const cat = categories.find(c => c.slug === categoryFilter);
        if (cat && p.category_id !== cat.id) return false;
      }
      // Type match
      if (typeFilter !== 'all' && p.product_type !== typeFilter) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.short_description.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // Default: featured first
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-brand">Catálogo Digital</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink ">
          Todos os Produtos & Materiais de IA
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
          Explore ebooks práticos, apostilas, packs de prompts avançados e modelos de automação prontos para execução imediata.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div id="categorias" className="p-4 rounded-2xl bg-white border border-line shadow-card space-y-4 scroll-mt-24">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por título ou tema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-line rounded-lg text-xs text-ink placeholder-muted focus:outline-none focus:border-blue-100 transition-colors"
            />
          </div>

          {/* Sort By selector */}
          <div className="flex items-center gap-2 self-end md:self-auto text-xs text-muted">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-line text-ink text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-100"
            >
              <option value="featured">Destaques</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
            </select>
          </div>
        </div>

        {/* Category Tabs (Functional segmented buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              categoryFilter === 'all'
                ? 'bg-brand text-white font-semibold'
                : 'bg-white text-muted hover:text-brand border border-line'
            }`}
          >
            Todas as Categorias
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat.slug
                  ? 'bg-brand text-white font-semibold'
                  : 'bg-white text-muted hover:text-brand border border-line'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-100"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-muted mx-auto" />
          <h3 className="text-base font-semibold text-ink">Nenhum produto encontrado</h3>
          <p className="text-xs text-muted">Tente ajustar seus termos de busca ou filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
