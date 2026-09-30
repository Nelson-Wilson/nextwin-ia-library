import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/database';
import { Banner } from '../../types';
import { X, Sparkles } from 'lucide-react';

export const TopBanner: React.FC = () => {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    db.getBanners().then((banners) => {
      const top = banners.find((b) => b.active && b.position === 'top');
      if (top) setBanner(top);
    });
  }, []);

  if (!banner || dismissed) return null;

  return (
    <div className="relative bg-navy text-xs py-2 px-4 text-center text-white z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 pr-8">
        <Sparkles className="w-3.5 h-3.5 text-cta shrink-0 hidden sm:inline" />
        <span className="font-semibold">{banner.title}:</span>
        <span className="text-blue-100 hidden md:inline">{banner.subtitle}</span>
        <Link to={banner.button_url} className="underline text-cta hover:text-white font-medium ml-1">
          {banner.button_text} &rarr;
        </Link>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white p-1"
        aria-label="Fechar aviso"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
