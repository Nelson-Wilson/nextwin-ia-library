import React, { useEffect, useState } from 'react';
import { db } from '../../lib/database';
import { ProductFAQ, Product } from '../../types';
import { Plus, Trash2, HelpCircle } from 'lucide-react';

export const AdminFAQsPage: React.FC = () => {
  const [faqs, setFaqs] = useState<ProductFAQ[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [productId, setProductId] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const loadData = async () => {
    const [allFaqs, allProds] = await Promise.all([db.getAllFaqs(), db.getProducts()]);
    setFaqs(allFaqs);
    setProducts(allProds);
    if (allProds.length > 0 && !productId) setProductId(allProds[0].id);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) return;

    await db.saveFaq({
      question,
      answer,
      product_id: productId,
      active: true
    });

    setQuestion('');
    setAnswer('');
    setIsEditing(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Excluir pergunta?')) {
      await db.deleteFaq(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Central de Perguntas Frequentes</h2>
          <p className="text-xs text-slate-400">Perguntas exibidas nas páginas de vendas para quebrar objeções.</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors"
        >
          {isEditing ? 'Fechar' : '+ Nova Pergunta'}
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-white">Adicionar Pergunta & Resposta</h3>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Produto Vinculado</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Pergunta</label>
            <input
              type="text"
              required
              placeholder="Ex: Como é feito o download?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Resposta</label>
            <textarea
              rows={3}
              required
              placeholder="Explicação clara e objetiva..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
          >
            Salvar Pergunta
          </button>
        </form>
      )}

      <div className="space-y-3">
        {faqs.map(f => {
          const prod = products.find(p => p.id === f.product_id);
          return (
            <div key={f.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900 mb-1 inline-block">
                  {prod ? prod.name : 'Geral'}
                </span>
                <p className="text-xs font-bold text-white mt-1">{f.question}</p>
                <p className="text-xs text-slate-400 mt-1">{f.answer}</p>
              </div>
              <button onClick={() => handleDelete(f.id)} className="text-slate-500 hover:text-rose-400 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
