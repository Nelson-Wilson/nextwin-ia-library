import React, { useEffect, useState } from 'react';
import { db } from '../../lib/database';
import { BlogPost } from '../../types';
import { Plus, Trash2, Edit, FileText, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminBlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Inteligência Artificial');
  const [author, setAuthor] = useState('Equipe NextWin');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('/src/assets/images/hero_nextwin_library_1790756544243.jpg');

  const loadData = async () => {
    const data = await db.getBlogPosts();
    setPosts(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (p: BlogPost) => {
    setEditingId(p.id);
    setTitle(p.title);
    setSlug(p.slug);
    setCategory(p.category);
    setAuthor(p.author);
    setExcerpt(p.excerpt);
    setContent(p.content);
    setCoverImage(p.cover_image);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    await db.saveBlogPost({
      id: editingId || undefined,
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      author,
      excerpt,
      content,
      cover_image: coverImage,
      published: true
    });

    setIsEditing(false);
    setEditingId(null);
    loadData();
  };

  const handleDelete = async (id: string, pTitle: string) => {
    if (confirm(`Excluir artigo "${pTitle}"?`)) {
      await db.deleteBlogPost(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Gerenciamento do Blog</h2>
          <p className="text-xs text-slate-400">Publique artigos educativos, tutoriais de IA e estratégias de monetização.</p>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              setEditingId(null);
              setTitle('');
              setSlug('');
              setExcerpt('');
              setContent('');
              setIsEditing(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Artigo</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">
              {editingId ? 'Editar Artigo' : 'Escrever Novo Artigo'}
            </h3>
            <button onClick={() => setIsEditing(false)} className="text-xs text-slate-400 hover:text-white">
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Título</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!editingId) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Slug URL (/blog/:slug)</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Autor</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Capa (URL da Imagem)</label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Resumo (Excerpt)</label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Conteúdo do Artigo</label>
            <textarea
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Use títulos com ### e parágrafos normais..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Publicar Artigo
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          {posts.map(p => (
            <div key={p.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white truncate">{p.title}</span>
                  <Link to={`/blog/${p.slug}`} target="_blank" className="text-indigo-400 hover:text-indigo-300">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Por {p.author} · Categoria: {p.category} · {p.published_at}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleEdit(p)} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(p.id, p.title)} className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
