import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ProductsPage } from './pages/public/ProductsPage';
import { ProductPage } from './pages/public/ProductPage';
import { CategoryPage } from './pages/public/CategoryPage';
import { BundlePage } from './pages/public/BundlePage';
import { BlogPage } from './pages/public/BlogPage';
import { BlogPostPage } from './pages/public/BlogPostPage';
import { LeadCapturePage } from './pages/public/LeadCapturePage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { LegalPage } from './pages/public/LegalPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductEditPage } from './pages/admin/AdminProductEditPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminBundlesPage } from './pages/admin/AdminBundlesPage';
import { AdminOffersPage } from './pages/admin/AdminOffersPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminBannersPage } from './pages/admin/AdminBannersPage';
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage';
import { AdminFAQsPage } from './pages/admin/AdminFAQsPage';
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminBlogPage } from './pages/admin/AdminBlogPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes with TopBar, Header & Footer */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/produtos" element={<ProductsPage />} />
              <Route path="/produto/:slug" element={<ProductPage />} />
              <Route path="/categoria/:slug" element={<CategoryPage />} />
              <Route path="/combo/:slug" element={<BundlePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/captura" element={<LeadCapturePage />} />
              <Route path="/sobre" element={<AboutPage />} />
              <Route path="/contacto" element={<ContactPage />} />
              <Route path="/politica-privacidade" element={<LegalPage />} />
              <Route path="/politica-reembolso" element={<LegalPage />} />
              <Route path="/termos" element={<LegalPage />} />
            </Route>

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="products/new" element={<AdminProductEditPage />} />
              <Route path="products/:id/edit" element={<AdminProductEditPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="bundles" element={<AdminBundlesPage />} />
              <Route path="offers" element={<AdminOffersPage />} />
              <Route path="coupons" element={<AdminCouponsPage />} />
              <Route path="banners" element={<AdminBannersPage />} />
              <Route path="testimonials" element={<AdminTestimonialsPage />} />
              <Route path="faqs" element={<AdminFAQsPage />} />
              <Route path="leads" element={<AdminLeadsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="blog" element={<AdminBlogPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}
