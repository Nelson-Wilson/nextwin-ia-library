import React, { useEffect, useState } from 'react';
import { db } from '../../lib/database';
import { Testimonial, Product } from '../../types';
import { Plus, Trash2, Star } from 'lucide-react';

export const AdminTestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [products, setAllProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [productId, setProductId] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const loadData = async () => {
    const [tests, prods] = await Promise.all([db.getTestimonials(), db.getProducts()]);
    setTestimonials(tests);
    setAllProducts(prods);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;

    await db.saveTestimonial({
      name,
      role,
      company,
      text,
      rating: Number(rating),
      product_id: productId || null,
      active: true
    });

    setName('');
    setRole('');
    setCompany('');
    setText('');
    setIsEditing(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Excluir depoimento?')) {
      await db.deleteTestimonial(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Depoimentos & Prova Social</h2>
          <p className="text-xs text-slate-400">Gerencie avaliações exibidas na Home e nas páginas individuais de produto.</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors"
        >
          {isEditing ? 'Fechar' : '+ Novo Depoimento'}
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-white">Adicionar Depoimento</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Cliente</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cargo / Profissão</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Ex: Consultor de TI"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cidade / Empresa</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ex: Maputo"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Vincular a Produto Específico</label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              >
                <option value="">Depoimento Global (Aparece na Home)</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Avaliação (Estrelas)</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              >
                <option value={5}>5 Estrelas (Excelente)</option>
                <option value={4}>4 Estrelas (Muito Bom)</option>
                <option value={3}>3 Estrelas</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Texto do Depoimento</label>
            <textarea
              rows={3}
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="O que o cliente achou da aplicação prática do material..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
          >
            Salvar Depoimento
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map(t => (
          <div key={t.id} className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <button onClick={() => handleDelete(t.id)} className="text-slate-500 hover:text-rose-400 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-300 italic">"{t.text}"</p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              <strong className="text-white">{t.name}</strong> · {t.role || 'Estudante'} ({t.company || 'Moçambique'})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
