export type ProductType = 
  | 'ebook' 
  | 'prompt_pack' 
  | 'template' 
  | 'course' 
  | 'software' 
  | 'bundle' 
  | 'other';

export type UserRole = 'admin' | 'editor' | 'customer';

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  active: boolean;
  created_at?: string;
}

export interface ProductBenefit {
  id: string;
  product_id: string;
  title: string;
  description: string;
  icon?: string;
  sort_order: number;
}

export interface ProductFAQ {
  id: string;
  product_id: string;
  question: string;
  answer: string;
  sort_order: number;
  active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  company?: string;
  text: string;
  rating: number; // 1-5
  product_id?: string | null; // null for global
  active: boolean;
  created_at?: string;
}

export interface ProductBlockSettings {
  hero: boolean;
  benefits: boolean;
  content: boolean;
  audience: boolean;
  includes: boolean;
  bonuses: boolean;
  testimonials: boolean;
  faq: boolean;
  offer: boolean;
  cta: boolean;
}

export interface ProductBonus {
  title: string;
  value: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  product_type: ProductType;
  price: number;
  old_price?: number;
  currency: string;
  cover_image: string;
  gallery: string[];
  checkout_url: string;
  category_id: string;
  featured: boolean;
  active: boolean;
  published: boolean;
  seo_title?: string;
  seo_description?: string;
  
  // Dynamic page content blocks
  audience_text?: string;
  learn_items?: string[];
  includes_items?: string[];
  bonuses?: ProductBonus[];
  block_settings?: ProductBlockSettings;

  created_at?: string;
  updated_at?: string;
  
  // Populated relations
  category?: Category;
  benefits?: ProductBenefit[];
  faqs?: ProductFAQ[];
  testimonials?: Testimonial[];
}

export interface Bundle {
  id: string;
  name: string;
  slug: string;
  description: string;
  cover_image: string;
  price: number;
  old_price?: number;
  currency: string;
  checkout_url: string;
  featured: boolean;
  active: boolean;
  product_ids: string[];
  products?: Product[];
  created_at?: string;
  updated_at?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  button_text: string;
  button_url: string;
  position: 'top' | 'hero' | 'middle';
  active: boolean;
  start_date?: string;
  end_date?: string;
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'promotional_price';
  discount_value: number;
  product_id?: string;
  bundle_id?: string;
  start_date?: string;
  end_date?: string;
  active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses: number;
  used_count: number;
  expires_at?: string;
  active: boolean;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  source?: string;
  campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_page?: string;
  created_at: string;
}

export interface MarketingVisit {
  id: string;
  session_id: string;
  product_id?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  landing_page?: string;
  referrer?: string;
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  event_name: 'page_view' | 'product_view' | 'checkout_click' | 'lead_submit' | 'purchase' | 'download';
  session_id: string;
  user_id?: string;
  product_id?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Order {
  id: string;
  external_order_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  product_id?: string;
  bundle_id?: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  payment_method?: string;
  created_at: string;
  updated_at?: string;
  product?: Product;
  bundle?: Bundle;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: string;
  category: string;
  published: boolean;
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at?: string;
}

export interface SiteSettings {
  site_name: string;
  site_description: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_cta_text: string;
  contact_email: string;
  whatsapp_number: string;
  tiktok_url: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  default_currency: string;
  meta_title_default: string;
  meta_description_default: string;
  escalepay_default_url: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  created_at?: string;
}
