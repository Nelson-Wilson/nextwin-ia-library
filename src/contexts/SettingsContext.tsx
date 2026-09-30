import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings } from '../types';
import { db } from '../lib/database';

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: SiteSettings = {
  site_name: 'NextWin AI Library',
  site_description: 'Plataforma oficial de ebooks, prompts e cursos de Inteligência Artificial.',
  hero_headline: 'Transforme a Inteligência Artificial em uma habilidade para estudar, trabalhar e criar novas oportunidades.',
  hero_subheadline: 'Acesse ebooks práticos, packs de prompts profissionais, templates de automação e materiais digitais para faturar e produzir na economia digital.',
  hero_cta_text: 'Explorar Produtos',
  contact_email: 'contato@nextwinlibrary.com',
  whatsapp_number: '+258 84 000 0000',
  tiktok_url: 'https://tiktok.com/@nextwin.ai',
  instagram_url: 'https://instagram.com/nextwin.ai',
  facebook_url: 'https://facebook.com/nextwin.ai',
  youtube_url: 'https://youtube.com/@nextwin.ai',
  default_currency: 'MT',
  meta_title_default: 'NextWin AI Library — Ebooks e Ferramentas Práticas de IA',
  meta_description_default: 'A maior biblioteca digital de infoprodutos e prompts de IA.',
  escalepay_default_url: 'https://checkout.escalepay.com/'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    db.getSettings().then(data => {
      if (data) setSettings(data);
      setIsLoading(false);
    });
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = await db.saveSettings(newSettings);
    setSettings(updated);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
