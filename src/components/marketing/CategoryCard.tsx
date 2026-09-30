import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';
import { Brain, TrendingUp, Zap, Megaphone, GraduationCap, User, DollarSign, Heart, Sparkles, Code2 } from 'lucide-react';

const themes = [
  { bg: 'bg-violet-50 border-violet-100', icon: 'text-violet' },
  { bg: 'bg-emerald-50 border-emerald-100', icon: 'text-cta-strong' },
  { bg: 'bg-blue-50 border-blue-100', icon: 'text-brand' },
  { bg: 'bg-pink-50 border-pink-100', icon: 'text-pink-500' },
];

const iconFor = (c: Category): React.ElementType => {
  const key = `${c.slug} ${c.name}`.toLowerCase();
  if (key.includes('prompt') || key.includes('template')) return Sparkles;
  if (key.includes('neg')) return TrendingUp;
  if (key.includes('produtiv') || key.includes('automa')) return Zap;
  if (key.includes('market')) return Megaphone;
  if (key.includes('program')) return Code2;
  if (key.includes('pessoal')) return User;
  if (key.includes('renda')) return DollarSign;
  if (key.includes('relac')) return Heart;
  if (key.includes('ia') || key.includes('intelig')) return Brain;
  return GraduationCap;
};

export const CategoryCard: React.FC<{ category: Category; index: number }> = ({ category, index }) => {
  const theme = themes[index % themes.length];
  const Icon = iconFor(category);
  return (
    <Link
      to={`/categoria/${category.slug}`}
      className={`flex flex-col items-center justify-center gap-2.5 text-center rounded-2xl border px-3 py-5 min-w-[130px] h-full hover:-translate-y-0.5 hover:shadow-soft transition-all ${theme.bg}`}
    >
      <Icon className={`w-7 h-7 ${theme.icon}`} strokeWidth={1.75} />
      <span className="text-[11px] font-semibold text-ink leading-tight">{category.name}</span>
    </Link>
  );
};
