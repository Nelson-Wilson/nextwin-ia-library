import React, { useEffect, useState } from 'react';
import { db } from '../../lib/database';
import { Banner } from '../../types';
import { Plus, Trash2, Edit, Image as ImageIcon } from 'lucide-react';

export const AdminBannersPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [btnText, setBtnText] = useState('Ver Oferta');
  const [btnUrl, setBtnUrl] = useState('/produtos');
  const [position, setPosition] = useState<Banner['position']>('top');
  const [isEditing, setIsEditing] = useState(false);

  const loadData = async () => {
    const data = await db.getBanners();
    setBanners(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    await db.saveBanner({
      title,
      subtitle,
      button_text: btnText,
      button_url: btnUrl,
      position,
      active: true
    });

    setTitle('');
    setSubtitle('');
    setIsEditing(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Excluir banner?')) {
      await db.deleteBanner(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Banners de Alerta & Topo</h2>
          <p className="text-xs text-slate-400">Notificações promocionais exibidas no cabeçalho público.</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors"
        >
          {isEditing ? 'Fechar' : '+ Novo Banner'}
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-white">Configurar Banner</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Título</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Lançamento Exclusivo"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subtítulo</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ex: Desconto especial por 48 horas"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Texto do Botão / Link</label>
              <input
                type="text"
                value={btnText}
                onChange={(e) => setBtnText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">URL de Destino</label>
              <input
                type="text"
                value={btnUrl}
                onChange={(e) => setBtnUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
          >
            Salvar Banner
          </button>
        </form>
      )}

      <div className="space-y-3">
        {banners.map(b => (
          <div key={b.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-white">{b.title}</span>
              <span className="text-xs text-slate-400 ml-2">{b.subtitle}</span>
              <p className="text-[11px] text-indigo-400 mt-0.5">Link: {b.button_url} ({b.button_text})</p>
            </div>
            <button onClick={() => handleDelete(b.id)} className="text-slate-500 hover:text-rose-400 p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
