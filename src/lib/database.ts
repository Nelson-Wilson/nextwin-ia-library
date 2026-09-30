import { 
  Product, 
  Category, 
  Bundle, 
  ProductBenefit, 
  ProductFAQ, 
  Testimonial, 
  Banner, 
  Offer, 
  Coupon, 
  Lead, 
  Order, 
  BlogPost, 
  SiteSettings, 
  MarketingVisit, 
  AnalyticsEvent 
} from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY_PREFIX = 'nextwin_ai_lib_';

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site_name: 'NextWin AI Library',
  site_description: 'A maior biblioteca digital de infoprodutos, prompts e ferramentas de Inteligência Artificial para estudo, trabalho e negócios.',
  hero_headline: 'Transforme a Inteligência Artificial em uma habilidade para estudar, trabalhar e criar novas oportunidades.',
  hero_subheadline: 'Acesse ebooks práticos, packs de prompts profissionais, templates de automação e materiais digitais prontos para gerar valor real na economia digital.',
  hero_cta_text: 'Explorar Produtos',
  contact_email: 'contato@nextwinlibrary.com',
  whatsapp_number: '+258 84 000 0000',
  tiktok_url: 'https://tiktok.com/@nextwin.ai',
  instagram_url: 'https://instagram.com/nextwin.ai',
  facebook_url: 'https://facebook.com/nextwin.ai',
  youtube_url: 'https://youtube.com/@nextwin.ai',
  default_currency: 'MT',
  meta_title_default: 'NextWin AI Library — Ebooks e Ferramentas Práticas de Inteligência Artificial',
  meta_description_default: 'Plataforma oficial de produtos digitais, cursos e prompts de IA. Aprenda a monetizar e aumentar produtividade hoje mesmo.',
  escalepay_default_url: 'https://checkout.escalepay.com/pay/'
};





// Helper to access LocalStorage safely
function getStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage write error:', err);
  }
}

export const db = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, category:categories(*)')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase fetch products error, fallback to local storage:', e);
      }
    }
    const products = getStorage<Product[]>('products', []);
    const categories = await this.getCategories();
    return products.map(p => ({
      ...p,
      category: categories.find(c => c.id === p.category_id)
    }));
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, category:categories(*), benefits:product_benefits(*), faqs:product_faqs(*)')
          .eq('slug', slug)
          .single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase getProductBySlug error, using fallback:', e);
      }
    }
    const products = await this.getProducts();
    const product = products.find(p => p.slug === slug || p.id === slug);
    if (!product) return null;

    const benefits = (await this.getBenefitsByProductId(product.id));
    const faqs = (await this.getFaqsByProductId(product.id));
    const testimonials = (await this.getTestimonialsByProductId(product.id));

    return {
      ...product,
      benefits,
      faqs,
      testimonials
    };
  },

  async saveProduct(product: Partial<Product>): Promise<Product> {
    const products = getStorage<Product[]>('products', []);
    let updated: Product;

    if (product.id) {
      const idx = products.findIndex(p => p.id === product.id);
      if (idx >= 0) {
        updated = { 
          ...products[idx], 
          ...product, 
          updated_at: new Date().toISOString() 
        } as Product;
        products[idx] = updated;
      } else {
        updated = {
          ...product,
          id: product.id,
          created_at: new Date().toISOString()
        } as Product;
        products.push(updated);
      }
    } else {
      const newId = 'prod-' + Date.now();
      updated = {
        id: newId,
        name: product.name || '',
        slug: product.slug || ('produto-' + Date.now()),
        short_description: product.short_description || '',
        full_description: product.full_description || '',
        product_type: product.product_type || 'ebook',
        price: Number(product.price) || 0,
        old_price: Number(product.old_price) || 0,
        currency: product.currency || 'MT',
        cover_image: product.cover_image || '',
        gallery: product.gallery || [],
        checkout_url: product.checkout_url || 'https://checkout.escalepay.com/',
        category_id: product.category_id || '',
        featured: Boolean(product.featured),
        active: product.active ?? true,
        published: product.published ?? true,
        seo_title: product.seo_title,
        seo_description: product.seo_description,
        audience_text: product.audience_text,
        learn_items: product.learn_items || [],
        includes_items: product.includes_items || [],
        bonuses: product.bonuses || [],
        block_settings: product.block_settings || {
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
        },
        created_at: new Date().toISOString()
      };
      products.unshift(updated);
    }

    setStorage('products', products);

    // Try Supabase sync if online
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').upsert(updated);
      } catch (err) {
        console.warn('Supabase sync product error:', err);
      }
    }

    return updated;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const products = getStorage<Product[]>('products', []);
    const filtered = products.filter(p => p.id !== id);
    setStorage('products', filtered);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete product error:', err);
      }
    }
    return true;
  },

  // CATEGORIES
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase categories error:', e);
      }
    }
    return getStorage<Category[]>('categories', []);
  },

  async saveCategory(cat: Partial<Category>): Promise<Category> {
    const categories = getStorage<Category[]>('categories', []);
    let updated: Category;

    if (cat.id) {
      const idx = categories.findIndex(c => c.id === cat.id);
      if (idx >= 0) {
        updated = { ...categories[idx], ...cat } as Category;
        categories[idx] = updated;
      } else {
        updated = { ...cat, id: cat.id } as Category;
        categories.push(updated);
      }
    } else {
      updated = {
        id: 'cat-' + Date.now(),
        name: cat.name || '',
        slug: cat.slug || ('cat-' + Date.now()),
        description: cat.description || '',
        image: cat.image || '',
        active: cat.active ?? true,
        created_at: new Date().toISOString()
      };
      categories.push(updated);
    }

    setStorage('categories', categories);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('categories').upsert(updated);
      } catch (err) {
        console.warn('Supabase save category error:', err);
      }
    }
    return updated;
  },

  async deleteCategory(id: string): Promise<boolean> {
    const categories = getStorage<Category[]>('categories', []);
    setStorage('categories', categories.filter(c => c.id !== id));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete category error:', err);
      }
    }
    return true;
  },

  // BUNDLES
  async getBundles(): Promise<Bundle[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('bundles').select('*');
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase bundles error:', e);
      }
    }
    const bundles = getStorage<Bundle[]>('bundles', []);
    const products = await this.getProducts();
    return bundles.map(b => ({
      ...b,
      products: products.filter(p => b.product_ids?.includes(p.id))
    }));
  },

  async getBundleBySlug(slug: string): Promise<Bundle | null> {
    const bundles = await this.getBundles();
    return bundles.find(b => b.slug === slug || b.id === slug) || null;
  },

  async saveBundle(bundle: Partial<Bundle>): Promise<Bundle> {
    const bundles = getStorage<Bundle[]>('bundles', []);
    let updated: Bundle;
    if (bundle.id) {
      const idx = bundles.findIndex(b => b.id === bundle.id);
      if (idx >= 0) {
        updated = { ...bundles[idx], ...bundle, updated_at: new Date().toISOString() } as Bundle;
        bundles[idx] = updated;
      } else {
        updated = { ...bundle, id: bundle.id } as Bundle;
        bundles.push(updated);
      }
    } else {
      updated = {
        id: 'bundle-' + Date.now(),
        name: bundle.name || '',
        slug: bundle.slug || ('combo-' + Date.now()),
        description: bundle.description || '',
        cover_image: bundle.cover_image || '',
        price: Number(bundle.price) || 0,
        old_price: Number(bundle.old_price) || 0,
        currency: bundle.currency || 'MT',
        checkout_url: bundle.checkout_url || 'https://checkout.escalepay.com/',
        featured: Boolean(bundle.featured),
        active: bundle.active ?? true,
        product_ids: bundle.product_ids || [],
        created_at: new Date().toISOString()
      };
      bundles.unshift(updated);
    }
    setStorage('bundles', bundles);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('bundles').upsert(updated);
      } catch (err) {
        console.warn('Supabase save bundle error:', err);
      }
    }
    return updated;
  },

  async deleteBundle(id: string): Promise<boolean> {
    const bundles = getStorage<Bundle[]>('bundles', []);
    setStorage('bundles', bundles.filter(b => b.id !== id));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('bundles').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete bundle error:', err);
      }
    }
    return true;
  },

  // BENEFITS
  async getBenefitsByProductId(productId: string): Promise<ProductBenefit[]> {
    const all = getStorage<ProductBenefit[]>('product_benefits', []);
    return all.filter(b => b.product_id === productId).sort((a, b) => a.sort_order - b.sort_order);
  },

  async saveBenefit(benefit: Partial<ProductBenefit>): Promise<ProductBenefit> {
    const benefits = getStorage<ProductBenefit[]>('product_benefits', []);
    let updated: ProductBenefit;
    if (benefit.id) {
      const idx = benefits.findIndex(b => b.id === benefit.id);
      if (idx >= 0) {
        updated = { ...benefits[idx], ...benefit } as ProductBenefit;
        benefits[idx] = updated;
      } else {
        updated = { ...benefit, id: benefit.id } as ProductBenefit;
        benefits.push(updated);
      }
    } else {
      updated = {
        id: 'ben-' + Date.now(),
        product_id: benefit.product_id || '',
        title: benefit.title || '',
        description: benefit.description || '',
        icon: benefit.icon || 'CheckCircle',
        sort_order: benefit.sort_order || (benefits.length + 1)
      };
      benefits.push(updated);
    }
    setStorage('product_benefits', benefits);
    return updated;
  },

  async deleteBenefit(id: string): Promise<boolean> {
    const benefits = getStorage<ProductBenefit[]>('product_benefits', []);
    setStorage('product_benefits', benefits.filter(b => b.id !== id));
    return true;
  },

  // FAQS
  async getFaqsByProductId(productId: string): Promise<ProductFAQ[]> {
    const all = getStorage<ProductFAQ[]>('product_faqs', []);
    return all.filter(f => f.product_id === productId).sort((a, b) => a.sort_order - b.sort_order);
  },

  async getAllFaqs(): Promise<ProductFAQ[]> {
    return getStorage<ProductFAQ[]>('product_faqs', []);
  },

  async saveFaq(faq: Partial<ProductFAQ>): Promise<ProductFAQ> {
    const faqs = getStorage<ProductFAQ[]>('product_faqs', []);
    let updated: ProductFAQ;
    if (faq.id) {
      const idx = faqs.findIndex(f => f.id === faq.id);
      if (idx >= 0) {
        updated = { ...faqs[idx], ...faq } as ProductFAQ;
        faqs[idx] = updated;
      } else {
        updated = { ...faq, id: faq.id } as ProductFAQ;
        faqs.push(updated);
      }
    } else {
      updated = {
        id: 'faq-' + Date.now(),
        product_id: faq.product_id || '',
        question: faq.question || '',
        answer: faq.answer || '',
        sort_order: faq.sort_order || (faqs.length + 1),
        active: faq.active ?? true
      };
      faqs.push(updated);
    }
    setStorage('product_faqs', faqs);
    return updated;
  },

  async deleteFaq(id: string): Promise<boolean> {
    const faqs = getStorage<ProductFAQ[]>('product_faqs', []);
    setStorage('product_faqs', faqs.filter(f => f.id !== id));
    return true;
  },

  // TESTIMONIALS
  async getTestimonials(): Promise<Testimonial[]> {
    return getStorage<Testimonial[]>('testimonials', []);
  },

  async getTestimonialsByProductId(productId: string): Promise<Testimonial[]> {
    const all = await this.getTestimonials();
    // Return specific to product or global (product_id is null)
    return all.filter(t => t.active && (!t.product_id || t.product_id === productId));
  },

  async saveTestimonial(test: Partial<Testimonial>): Promise<Testimonial> {
    const tests = getStorage<Testimonial[]>('testimonials', []);
    let updated: Testimonial;
    if (test.id) {
      const idx = tests.findIndex(t => t.id === test.id);
      if (idx >= 0) {
        updated = { ...tests[idx], ...test } as Testimonial;
        tests[idx] = updated;
      } else {
        updated = { ...test, id: test.id } as Testimonial;
        tests.push(updated);
      }
    } else {
      updated = {
        id: 'test-' + Date.now(),
        name: test.name || '',
        role: test.role || '',
        company: test.company || '',
        text: test.text || '',
        rating: Number(test.rating) || 0,
        product_id: test.product_id || null,
        active: test.active ?? true,
        created_at: new Date().toISOString()
      };
      tests.unshift(updated);
    }
    setStorage('testimonials', tests);
    return updated;
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    const tests = getStorage<Testimonial[]>('testimonials', []);
    setStorage('testimonials', tests.filter(t => t.id !== id));
    return true;
  },

  // BANNERS
  async getBanners(): Promise<Banner[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('banners').select('*');
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase banners error:', e);
      }
    }
    return getStorage<Banner[]>('banners', []);
  },

  async saveBanner(banner: Partial<Banner>): Promise<Banner> {
    const banners = getStorage<Banner[]>('banners', []);
    let updated: Banner;
    if (banner.id) {
      const idx = banners.findIndex(b => b.id === banner.id);
      if (idx >= 0) {
        updated = { ...banners[idx], ...banner } as Banner;
        banners[idx] = updated;
      } else {
        updated = { ...banner, id: banner.id } as Banner;
        banners.push(updated);
      }
    } else {
      updated = {
        id: 'ban-' + Date.now(),
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        image: banner.image || '',
        button_text: banner.button_text || 'Ver Oferta',
        button_url: banner.button_url || '/produtos',
        position: banner.position || 'top',
        active: banner.active ?? true
      };
      banners.unshift(updated);
    }
    setStorage('banners', banners);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('banners').upsert(updated);
      } catch (err) {
        console.warn('Supabase save banner error:', err);
      }
    }
    return updated;
  },

  async deleteBanner(id: string): Promise<boolean> {
    const banners = getStorage<Banner[]>('banners', []);
    setStorage('banners', banners.filter(b => b.id !== id));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('banners').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete banner error:', err);
      }
    }
    return true;
  },

  // OFFERS
  async getOffers(): Promise<Offer[]> {
    return getStorage<Offer[]>('offers', []);
  },

  async saveOffer(offer: Partial<Offer>): Promise<Offer> {
    const offers = getStorage<Offer[]>('offers', []);
    let updated: Offer;
    if (offer.id) {
      const idx = offers.findIndex(o => o.id === offer.id);
      if (idx >= 0) {
        updated = { ...offers[idx], ...offer } as Offer;
        offers[idx] = updated;
      } else {
        updated = { ...offer, id: offer.id } as Offer;
        offers.push(updated);
      }
    } else {
      updated = {
        id: 'off-' + Date.now(),
        name: offer.name || '',
        description: offer.description || '',
        discount_type: offer.discount_type || 'percentage',
        discount_value: Number(offer.discount_value) || 0,
        product_id: offer.product_id,
        bundle_id: offer.bundle_id,
        active: offer.active ?? true
      };
      offers.unshift(updated);
    }
    setStorage('offers', offers);
    return updated;
  },

  async deleteOffer(id: string): Promise<boolean> {
    const offers = getStorage<Offer[]>('offers', []);
    setStorage('offers', offers.filter(o => o.id !== id));
    return true;
  },

  // COUPONS
  async getCoupons(): Promise<Coupon[]> {
    return getStorage<Coupon[]>('coupons', []);
  },

  async saveCoupon(coupon: Partial<Coupon>): Promise<Coupon> {
    const coupons = getStorage<Coupon[]>('coupons', []);
    let updated: Coupon;
    if (coupon.id) {
      const idx = coupons.findIndex(c => c.id === coupon.id);
      if (idx >= 0) {
        updated = { ...coupons[idx], ...coupon } as Coupon;
        coupons[idx] = updated;
      } else {
        updated = { ...coupon, id: coupon.id } as Coupon;
        coupons.push(updated);
      }
    } else {
      updated = {
        id: 'coup-' + Date.now(),
        code: (coupon.code || '').toUpperCase().trim(),
        discount_type: coupon.discount_type || 'percentage',
        discount_value: Number(coupon.discount_value) || 0,
        max_uses: Number(coupon.max_uses) || 0,
        used_count: 0,
        active: coupon.active ?? true
      };
      coupons.unshift(updated);
    }
    setStorage('coupons', coupons);
    return updated;
  },

  async deleteCoupon(id: string): Promise<boolean> {
    const coupons = getStorage<Coupon[]>('coupons', []);
    setStorage('coupons', coupons.filter(c => c.id !== id));
    return true;
  },

  // LEADS
  async getLeads(): Promise<Lead[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase leads error:', e);
      }
    }
    return getStorage<Lead[]>('leads', []);
  },

  async saveLead(lead: Omit<Lead, 'id' | 'created_at'>): Promise<Lead> {
    const leads = getStorage<Lead[]>('leads', []);
    const newLead: Lead = {
      ...lead,
      id: 'lead-' + Date.now(),
      created_at: new Date().toISOString()
    };
    leads.unshift(newLead);
    setStorage('leads', leads);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('leads').insert(newLead);
      } catch (err) {
        console.warn('Supabase save lead error:', err);
      }
    }
    return newLead;
  },

  // ORDERS
  async getOrders(): Promise<Order[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase orders error:', e);
      }
    }
    const orders = getStorage<Order[]>('orders', []);
    const products = await this.getProducts();
    const bundles = await this.getBundles();
    return orders.map(o => ({
      ...o,
      product: products.find(p => p.id === o.product_id),
      bundle: bundles.find(b => b.id === o.bundle_id)
    }));
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    const orders = getStorage<Order[]>('orders', []);
    const idx = orders.findIndex(o => o.id === id);
    if (idx >= 0) {
      orders[idx].status = status;
      orders[idx].updated_at = new Date().toISOString();
      setStorage('orders', orders);
      return orders[idx];
    }
    return null;
  },

  // BLOG POSTS
  async getBlogPosts(): Promise<BlogPost[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase blog posts error:', e);
      }
    }
    return getStorage<BlogPost[]>('blog_posts', []);
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const posts = await this.getBlogPosts();
    return posts.find(p => p.slug === slug || p.id === slug) || null;
  },

  async saveBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
    const posts = getStorage<BlogPost[]>('blog_posts', []);
    let updated: BlogPost;
    if (post.id) {
      const idx = posts.findIndex(p => p.id === post.id);
      if (idx >= 0) {
        updated = { ...posts[idx], ...post, updated_at: new Date().toISOString() } as BlogPost;
        posts[idx] = updated;
      } else {
        updated = { ...post, id: post.id } as BlogPost;
        posts.push(updated);
      }
    } else {
      updated = {
        id: 'post-' + Date.now(),
        title: post.title || '',
        slug: post.slug || ('artigo-' + Date.now()),
        excerpt: post.excerpt || '',
        content: post.content || '',
        cover_image: post.cover_image || '',
        author: post.author || '',
        category: post.category || '',
        published: post.published ?? true,
        published_at: new Date().toISOString().split('T')[0],
        seo_title: post.seo_title,
        seo_description: post.seo_description,
        created_at: new Date().toISOString()
      };
      posts.unshift(updated);
    }
    setStorage('blog_posts', posts);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('blog_posts').upsert(updated);
      } catch (err) {
        console.warn('Supabase save blog post error:', err);
      }
    }
    return updated;
  },

  async deleteBlogPost(id: string): Promise<boolean> {
    const posts = getStorage<BlogPost[]>('blog_posts', []);
    setStorage('blog_posts', posts.filter(p => p.id !== id));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('blog_posts').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete blog post error:', err);
      }
    }
    return true;
  },

  // ANALYTICS & VISITS
  async getAnalyticsEvents(): Promise<AnalyticsEvent[]> {
    return getStorage<AnalyticsEvent[]>('analytics_events', []);
  },

  async recordEvent(event: Omit<AnalyticsEvent, 'id' | 'created_at'>): Promise<AnalyticsEvent> {
    const events = getStorage<AnalyticsEvent[]>('analytics_events', []);
    const newEvent: AnalyticsEvent = {
      ...event,
      id: 'ev-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      created_at: new Date().toISOString()
    };
    events.unshift(newEvent);
    // Keep max 500 events locally to avoid memory bloat
    if (events.length > 500) events.length = 500;
    setStorage('analytics_events', events);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('analytics_events').insert(newEvent);
      } catch (err) {
        // silent fail in analytics
      }
    }
    return newEvent;
  },

  // SITE SETTINGS
  async getSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('settings')
          .eq('id', 'primary')
          .maybeSingle();
        if (!error && data?.settings) {
          return { ...DEFAULT_SITE_SETTINGS, ...data.settings };
        }
      } catch (error) {
        console.warn('Supabase settings fetch error, fallback to local storage:', error);
      }
    }

    return {
      ...DEFAULT_SITE_SETTINGS,
      ...getStorage<Partial<SiteSettings>>('site_settings', {})
    };
  },

  async saveSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'primary', settings: updated });
      if (error) throw new Error('Não foi possível salvar as configurações no Supabase.');
    }

    setStorage('site_settings', updated);
    return updated;
  }
};
