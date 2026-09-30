-- ==============================================================================
-- NEXTWIN AI LIBRARY — SUPABASE DATABASE MIGRATIONS & SCHEMA
-- ==============================================================================
-- Executar este script no SQL Editor do seu projeto Supabase para criar
-- tabelas, índices, triggers e policies RLS.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'editor', 'customer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE product_type_enum AS ENUM ('ebook', 'prompt_pack', 'template', 'course', 'software', 'bundle', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status_enum AS ENUM ('pending', 'paid', 'failed', 'refunded', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Supabase Auth linked)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role user_role DEFAULT 'customer',
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY DEFAULT ('cat-' || extract(epoch from now())::bigint),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- 5. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT ('prod-' || extract(epoch from now())::bigint),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    full_description TEXT,
    product_type product_type_enum NOT NULL DEFAULT 'ebook',
    price NUMERIC(10, 2) NOT NULL,
    old_price NUMERIC(10, 2),
    currency TEXT NOT NULL DEFAULT 'MT',
    cover_image TEXT NOT NULL,
    gallery JSONB DEFAULT '[]'::jsonb,
    checkout_url TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    published BOOLEAN DEFAULT TRUE,
    seo_title TEXT,
    seo_description TEXT,
    audience_text TEXT,
    learn_items JSONB DEFAULT '[]'::jsonb,
    includes_items JSONB DEFAULT '[]'::jsonb,
    bonuses JSONB DEFAULT '[]'::jsonb,
    block_settings JSONB DEFAULT '{"hero":true,"benefits":true,"content":true,"audience":true,"includes":true,"bonuses":true,"testimonials":true,"faq":true,"offer":true,"cta":true}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active, published);

-- 6. PRODUCT BENEFITS TABLE
CREATE TABLE IF NOT EXISTS public.product_benefits (
    id TEXT PRIMARY KEY DEFAULT ('ben-' || extract(epoch from now())::bigint),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT DEFAULT 'CheckCircle',
    sort_order INT DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_benefits_product ON public.product_benefits(product_id);

-- 7. PRODUCT FAQS TABLE
CREATE TABLE IF NOT EXISTS public.product_faqs (
    id TEXT PRIMARY KEY DEFAULT ('faq-' || extract(epoch from now())::bigint),
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INT DEFAULT 1,
    active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_faqs_product ON public.product_faqs(product_id);

-- 8. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY DEFAULT ('test-' || extract(epoch from now())::bigint),
    name TEXT NOT NULL,
    avatar TEXT,
    role TEXT,
    company TEXT,
    text TEXT NOT NULL,
    rating INT,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. BUNDLES TABLE
CREATE TABLE IF NOT EXISTS public.bundles (
    id TEXT PRIMARY KEY DEFAULT ('bundle-' || extract(epoch from now())::bigint),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    old_price NUMERIC(10, 2),
    currency TEXT NOT NULL DEFAULT 'MT',
    checkout_url TEXT NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    product_ids JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bundles_slug ON public.bundles(slug);

-- 10. BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.banners (
    id TEXT PRIMARY KEY DEFAULT ('ban-' || extract(epoch from now())::bigint),
    title TEXT NOT NULL,
    subtitle TEXT,
    image TEXT,
    button_text TEXT NOT NULL DEFAULT 'Ver Oferta',
    button_url TEXT NOT NULL DEFAULT '/produtos',
    position TEXT DEFAULT 'top',
    active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ
);

-- 11. OFFERS TABLE
CREATE TABLE IF NOT EXISTS public.offers (
    id TEXT PRIMARY KEY DEFAULT ('off-' || extract(epoch from now())::bigint),
    name TEXT NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL DEFAULT 'percentage',
    discount_value NUMERIC(10, 2) NOT NULL,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    bundle_id TEXT REFERENCES public.bundles(id) ON DELETE CASCADE,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    active BOOLEAN DEFAULT TRUE
);

-- 12. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY DEFAULT ('coup-' || extract(epoch from now())::bigint),
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL DEFAULT 'percentage',
    discount_value NUMERIC(10, 2) NOT NULL,
    max_uses INT,
    used_count INT DEFAULT 0,
    expires_at TIMESTAMPTZ,
    active BOOLEAN DEFAULT TRUE
);

-- 13. LEADS TABLE (Com tracking UTM)
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY DEFAULT ('lead-' || extract(epoch from now())::bigint),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp TEXT,
    source TEXT,
    campaign TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    landing_page TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(utm_source);

-- 14. ORDERS TABLE (Integrado com EscalePay)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT ('ord-' || extract(epoch from now())::bigint),
    external_order_id TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    bundle_id TEXT REFERENCES public.bundles(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'MT',
    status order_status_enum NOT NULL DEFAULT 'pending',
    payment_method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- 15. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id TEXT PRIMARY KEY DEFAULT ('post-' || extract(epoch from now())::bigint),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT NOT NULL,
    published BOOLEAN DEFAULT TRUE,
    published_at DATE DEFAULT CURRENT_DATE,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_posts(slug);

-- 16. ANALYTICS EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id TEXT PRIMARY KEY DEFAULT ('ev-' || extract(epoch from now())::bigint),
    event_name TEXT NOT NULL,
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    product_id TEXT,
    source TEXT,
    medium TEXT,
    campaign TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_source ON public.analytics_events(source);

-- 17. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    settings JSONB NOT NULL
);

-- ==============================================================================
-- 18. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT (role = 'admin')
        FROM public.profiles
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PUBLIC READ POLICIES (Todos os visitantes podem ler catálogo ativo)
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (active = true AND published = true);
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (active = true);
CREATE POLICY "Public read benefits" ON public.product_benefits FOR SELECT USING (true);
CREATE POLICY "Public read faqs" ON public.product_faqs FOR SELECT USING (active = true);
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (active = true);
CREATE POLICY "Public read bundles" ON public.bundles FOR SELECT USING (active = true);
CREATE POLICY "Public read banners" ON public.banners FOR SELECT USING (active = true);
CREATE POLICY "Public read offers" ON public.offers FOR SELECT USING (active = true);
CREATE POLICY "Public read coupons" ON public.coupons FOR SELECT USING (active = true);
CREATE POLICY "Public read blog_posts" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);

-- PUBLIC INSERT POLICIES (Visitantes podem criar leads e registrar analytics)
CREATE POLICY "Public insert leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- ADMIN POLICIES (Administradores têm acesso total a tudo)
CREATE POLICY "Admin full products" ON public.products FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full categories" ON public.categories FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full benefits" ON public.product_benefits FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full faqs" ON public.product_faqs FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full testimonials" ON public.testimonials FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full bundles" ON public.bundles FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full banners" ON public.banners FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full offers" ON public.offers FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full coupons" ON public.coupons FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full leads" ON public.leads FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full orders" ON public.orders FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full blog_posts" ON public.blog_posts FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full analytics" ON public.analytics_events FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full settings" ON public.site_settings FOR ALL USING (public.is_admin());
CREATE POLICY "User read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());

-- 19. STORAGE DE IMAGENS
CREATE OR REPLACE FUNCTION public.can_manage_media()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
          AND role IN ('admin', 'editor')
    );
$$ LANGUAGE SQL SECURITY DEFINER SET search_path = public;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'nextwin-library-media',
    'nextwin-library-media',
    TRUE,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read library media" ON storage.objects
FOR SELECT USING (bucket_id = 'nextwin-library-media');

CREATE POLICY "Admins upload library media" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'nextwin-library-media'
    AND public.can_manage_media()
    AND split_part(name, '/', 1) IN ('products', 'bundles', 'banners', 'categories', 'blog')
    AND split_part(name, '/', 2) = auth.uid()::TEXT
);
