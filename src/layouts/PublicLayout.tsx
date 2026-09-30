import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { TopBanner } from '../components/layout/TopBanner';
import { analytics } from '../services/analytics';

export const PublicLayout: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    analytics.trackPageView(location.pathname);
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
