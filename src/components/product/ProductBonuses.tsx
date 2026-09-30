import React from 'react';
import { Product } from '../../types';
import { BonusCard } from './ProductLearn';

/** Standalone bonuses (only used when the "content" block is disabled). */
export const ProductBonuses: React.FC<{ product: Product }> = ({ product }) => {
  const bonuses = product.bonuses || [];
  if (bonuses.length === 0) return null;
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="max-w-md"><BonusCard bonuses={bonuses} /></div>
    </section>
  );
};
