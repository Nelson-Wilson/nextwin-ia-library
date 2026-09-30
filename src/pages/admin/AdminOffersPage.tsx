import React, { useEffect, useState } from 'react';
import { db } from '../../lib/database';
import { Offer, Product } from '../../types';
import { Plus, Trash2, Edit, Tag } from 'lucide-react';

export const AdminOffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [discountType, setDiscountType] = useState<Offer['discount_type']>('promotional_price');
  const [discountValue, setDiscountValue] = useState<number>(147);
  const [productId, setProductId] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const loadData = async () => {
    const [offs, prods] = await Promise.all([db.getOffers(), db.getProducts()]);
    setOffers(offs);
    setProducts(prods);
    if (prods.length > 0 && !productId) setProductId(prods[0].id);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    await db.saveOffer({
      name,
      description: desc,
      discount_type: discountType,
      discount_value: Number(discountValue),
      product_id: productId || undefined,
      active: true
    });

    setName('');
    setDesc('');
    setIsEditing(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Excluir oferta?')) {
      await db.deleteOffer(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Ofertas & Campanhas</h2>
          <p className="text-xs text-slate-400">Configure descontos percentuais, fixos ou preços promocionais.</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors"
        >
          {isEditing ? 'Fechar' : '+ Nova Oferta'}
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-white">Criar Campanha Promocional</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Título da Oferta</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Produto Alvo</label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (Atual: {p.price} {p.currency})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Desconto</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              >
                <option value="promotional_price">Preço Promocional Fixo (ex: 147 MT)</option>
                <option value="percentage">Porcentagem de Desconto (%)</option>
                <option value="fixed">Desconto de Valor Fixo (MT)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Valor</label>
              <input
                type="number"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
          >
            Salvar Oferta
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {offers.map(o => (
          <div key={o.id} className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{o.discount_type.replace('_', ' ')}</span>
              <button onClick={() => handleDelete(o.id)} className="text-slate-500 hover:text-rose-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h4 className="text-base font-bold text-white">{o.name}</h4>
            <p className="text-xs text-slate-400">{o.description || 'Oferta ativa no catálogo.'}</p>
            <div className="text-xs font-semibold text-slate-300">
              Valor configurado: <strong className="text-white">{o.discount_value} {o.discount_type === 'percentage' ? '%' : 'MT'}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
