import React, { useEffect, useState } from 'react';
import { db } from '../../lib/database';
import { Category } from '../../types';
import { Plus, Trash2, Edit, Check, FolderTree } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [desc, setDesc] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    const data = await db.getCategories();
    setCategories(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await db.saveCategory({
      id: editingId || undefined,
      name,
      slug: finalSlug,
      description: desc,
      active: true
    });

    setName('');
    setSlug('');
    setDesc('');
    setEditingId(null);
    loadData();
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDesc(cat.description || '');
  };

  const handleDelete = async (id: string, catName: string) => {
    if (confirm(`Excluir categoria "${catName}"?`)) {
      await db.deleteCategory(id);
      loadData();
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h2 className="text-xl font-bold text-white font-display">Categorias de Produtos</h2>
        <p className="text-xs text-slate-400">Organize os materiais digitais em áreas temáticas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Card */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white font-display">
            {editingId ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nome</label>
              <input
                type="text"
                required
                placeholder="Ex: Inteligência Artificial"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingId) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Slug URL</label>
              <input
                type="text"
                required
                placeholder="Ex: ia"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição</label>
              <textarea
                rows={3}
                placeholder="Descrição breve para o catálogo"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                {editingId ? 'Atualizar Categoria' : 'Salvar Categoria'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setName('');
                    setSlug('');
                    setDesc('');
                  }}
                  className="px-3 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-medium"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Card */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 text-xs font-bold text-white flex items-center justify-between">
            <span>Categorias Cadastradas ({categories.length})</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {categories.map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/30">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{c.name}</span>
                    <span className="text-[10px] font-mono text-indigo-400">/categoria/{c.slug}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{c.description}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleEdit(c)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
