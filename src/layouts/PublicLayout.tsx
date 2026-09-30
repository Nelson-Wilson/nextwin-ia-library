import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { TopBanner } from '../components/layout/TopBanner';
import { analytics } from '../services/analytics';
import { useSettings } from '../contexts/SettingsContext';

export const PublicLayout: React.FC = () => {
  const location = useLocation();
  const { settings } = useSettings();

  useEffect(() => {
    analytics.trackPageView(location.pathname);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const title = settings.meta_title_default || settings.site_name;
    const description = settings.meta_description_default || settings.site_description;
    document.title = title;

    const descriptionTag = document.querySelector('meta[name="description"]');
    descriptionTag?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
  }, [location.pathname, settings.meta_title_default, settings.meta_description_default, settings.site_name, settings.site_description]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-ink font-sans selection:bg-brand selection:text-white">
      <TopBanner />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
