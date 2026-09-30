import React from 'react';

const tones = {
  blue: 'bg-brand-soft text-brand',
  green: 'bg-emerald-50 text-cta-strong',
  violet: 'bg-violet-100 text-violet',
  solid: 'bg-brand text-white',
  amber: 'bg-amber-400 text-navy',
} as const;

export const Badge: React.FC<{
  tone?: keyof typeof tones;
  className?: string;
  children: React.ReactNode;
}> = ({ tone = 'blue', className = '', children }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold whitespace-nowrap max-w-full truncate ${tones[tone]} ${className}`}>
    {children}
  </span>
);
