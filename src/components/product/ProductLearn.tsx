import React from 'react';
import { Product } from '../../types';
import { Badge } from '../ui/Badge';
import { Zap, Users, TrendingUp, Wrench, Clock, FileCheck, Gift, Check } from 'lucide-react';

const icons = [Zap, Users, TrendingUp, Wrench, Clock, FileCheck];
const fallback = [
  'Metodologias comprovadas para execução rápida',
  'Modelos de prompts e frameworks passo a passo',
  'Estratégias de monetização e criação de valor',
  'Boas práticas e armadilhas comuns a evitar',
];

export const BonusCard: React.FC<{ bonuses: NonNullable<Product['bonuses']> }> = ({ bonuses }) => (
  <div className="rounded-2xl bg-gradient-to-br from-white to-violet-50 border border-violet-100 p-5 self-start shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet flex items-center justify-center">
                    <Gift className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm font-extrabold text-ink">Bônus Exclusivos</h3>
                </div>
                <Badge tone="green">Grátis</Badge>
              </div>
              <ul className="space-y-3">
                {bonuses.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-ink">
                    <Check className="w-4 h-4 text-brand shrink-0 mt-px" strokeWidth={2.5} />
                    <span>
                      <span className="font-semibold">{b.title}</span>
                      {b.value && <span className="text-muted"> · valor {b.value}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
);

export const ProductLearn: React.FC<{ product: Product; showBonuses?: boolean }> = ({ product, showBonuses = true }) => {
  const items = product.learn_items && product.learn_items.length > 0 ? product.learn_items : fallback;
  const bonuses = showBonuses ? product.bonuses || [] : [];

  return (
    <section className="bg-brand-soft/50 border-y border-line/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className={`grid grid-cols-1 gap-8 ${bonuses.length ? 'lg:grid-cols-[1.6fr_1fr]' : ''}`}>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-ink">O que você vai aprender</h2>
            <p className="text-xs text-muted mt-1 mb-6">Do básico ao avançado, com um passo a passo simples e direto.</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
              {items.map((item, i) => {
                const Icon = icons[i % icons.length];
                return (
                  <li key={i} className="flex items-start gap-3 text-xs text-ink">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${i % 2 ? 'bg-emerald-50 text-cta-strong' : 'bg-blue-100/70 text-brand'}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="pt-1.5 leading-snug">{item}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {bonuses.length > 0 && <BonusCard bonuses={bonuses} />}
        </div>
      </div>
    </section>
  );
};
