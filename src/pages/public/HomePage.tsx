import React, { useEffect, useState } from 'react';
import { db } from '../../lib/database';
import { Product, Category, Bundle, Testimonial, BlogPost } from '../../types';
import { Hero } from '../../components/home/Hero';
import { ProductCard } from '../../components/marketing/ProductCard';
import { BundleCard } from '../../components/marketing/BundleCard';
import { CategoryCard } from '../../components/marketing/CategoryCard';
import { TestimonialCard } from '../../components/marketing/TestimonialCard';
import { BlogCard } from '../../components/marketing/BlogCard';
import { LeadCapture } from '../../components/marketing/LeadCapture';
import { SectionHeading } from '../../components/ui/SectionHeading';

const wrap = 'max-w-6xl mx-auto px-4 sm:px-6';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredBundle, setFeaturedBundle] = useState<Bundle | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    Promise.all([
      db.getProducts(),
      db.getCategories(),
      db.getBundles(),
      db.getTestimonials(),
      db.getBlogPosts(),
    ]).then(([products, cats, bundles, tests, posts]) => {
      setFeaturedProducts(products.filter((p) => p.featured && p.active && p.published));
      setCategories(cats.filter((c) => c.active));
      setFeaturedBundle(bundles.find((b) => b.featured && b.active) || bundles[0] || null);
      setTestimonials(tests.filter((t) => t.active).slice(0, 3));
      setRecentPosts(posts.filter((p) => p.published).slice(0, 4));
    });
  }, []);

  return (
    <div className="pb-14">
      <Hero />

      {categories.length > 0 && (
        <section className="bg-brand-soft/50 border-y border-line/60 py-10">
          <div className={wrap}>
            <SectionHeading eyebrow="Categorias" title="Explore por categoria" linkText="Ver todas as categorias" linkTo="/produtos#categorias" />
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-[repeat(auto-fit,minmax(110px,1fr))]">
              {categories.map((cat, i) => (
                <div key={cat.id} className="shrink-0 lg:shrink">
                  <CategoryCard category={cat} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`${wrap} pt-12`}>
        <SectionHeading eyebrow="Produtos em destaque" title="Os mais procurados por quem quer evoluir" linkText="Ver todos os produtos" linkTo="/produtos" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {featuredProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {featuredBundle && (
        <section className={`${wrap} pt-12`}>
          <BundleCard bundle={featuredBundle} />
        </section>
      )}

      {testimonials.length > 0 && (
        <section className={`${wrap} pt-12`}>
          <SectionHeading eyebrow="Depoimentos" title="O que nossos alunos dizem" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </section>
      )}

      <section className={`${wrap} pt-12`}>
        <LeadCapture />
      </section>

      {recentPosts.length > 0 && (
        <section className={`${wrap} pt-12`}>
          <SectionHeading eyebrow="Blog" title="Conteúdos para você evoluir" linkText="Ver todos os artigos" linkTo="/blog" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
