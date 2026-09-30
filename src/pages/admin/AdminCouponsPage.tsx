import React, { useEffect, useState } from 'react';
import { db } from '../../lib/database';
import { Coupon } from '../../types';
import { Plus, Trash2, Ticket, Check } from 'lucide-react';

export const AdminCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<Coupon['discount_type']>('percentage');
  const [discountValue, setDiscountValue] = useState<number | ''>('');
  const [maxUses, setMaxUses] = useState<number | ''>('');
  const [isEditing, setIsEditing] = useState(false);

  const loadData = async () => {
    const data = await db.getCoupons();
    setCoupons(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    await db.saveCoupon({
      code,
      discount_type: discountType,
      discount_value: Number(discountValue),
      max_uses: Number(maxUses),
      active: true
    });

    setCode('');
    setIsEditing(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Excluir cupom?')) {
      await db.deleteCoupon(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Cupons de Desconto</h2>
          <p className="text-xs text-slate-400">Códigos promocionais para campanhas de anúncios e parcerias.</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors"
        >
          {isEditing ? 'Fechar' : '+ Novo Cupom'}
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-white">Adicionar Cupom</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Código</label>
              <input
                type="text"
                required
                placeholder="Ex: NEXTWIN20"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono font-bold text-indigo-400 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              >
                <option value="percentage">Porcentagem (%)</option>
                <option value="fixed">Valor Fixo (MT)</option>
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
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Limite Usos</label>
              <input
                type="number"
                required
                value={maxUses}
                onChange={(e) => setMaxUses(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
          >
            Cadastrar Cupom
          </button>
        </form>
      )}

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Código</th>
              <th className="py-3 px-4">Desconto</th>
              <th className="py-3 px-4">Uso / Limite</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {coupons.map((c) => (
              <tr key={c.id}>
                <td className="py-3 px-4 font-mono font-bold text-indigo-400">{c.code}</td>
                <td className="py-3 px-4 font-semibold text-white">
                  {c.discount_value} {c.discount_type === 'percentage' ? '%' : 'MT'}
                </td>
                <td className="py-3 px-4 text-slate-400 tabular-nums">{c.used_count} / {c.max_uses}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                    Ativo
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => handleDelete(c.id)} className="text-slate-500 hover:text-rose-400 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
