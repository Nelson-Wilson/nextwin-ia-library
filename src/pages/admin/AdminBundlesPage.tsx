import React, { useEffect, useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { db } from '../../lib/database';
import { Bundle, Product } from '../../types';
import { SafeImage } from '../../components/ui/SafeImage';
import { ImageField } from '../../components/admin/ImageField';
import { Plus, Trash2, Edit, Check, Layers, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminBundlesPage: React.FC = () => {
  const { settings } = useSettings();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [oldPrice, setOldPrice] = useState<number | ''>('');
  const [checkoutUrl, setCheckoutUrl] = useState('https://checkout.escalepay.com/pay/');
  const [currency, setCurrency] = useState(settings.default_currency);
  const [coverImage, setCoverImage] = useState('');
  const [coverImageValid, setCoverImageValid] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const [bList, pList] = await Promise.all([db.getBundles(), db.getProducts()]);
    setBundles(bList);
    setAllProducts(pList);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!editingId) {
      setCurrency(settings.default_currency);
      setCheckoutUrl(settings.escalepay_default_url);
    }
  }, [editingId, settings.default_currency, settings.escalepay_default_url]);

  const handleEdit = (bundle: Bundle) => {
    setEditingId(bundle.id);
    setName(bundle.name);
    setSlug(bundle.slug);
    setDesc(bundle.description || '');
    setPrice(bundle.price);
    setOldPrice(bundle.old_price || 0);
    setCheckoutUrl(bundle.checkout_url);
    setCoverImage(bundle.cover_image);
    setCoverImageValid(Boolean(bundle.cover_image));
    setSelectedProductIds(bundle.product_ids || []);
    setFeatured(bundle.featured);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !coverImageValid) return;

    await db.saveBundle({
      id: editingId || undefined,
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: desc,
      price: Number(price),
      old_price: Number(oldPrice),
      currency,
      checkout_url: checkoutUrl,
      cover_image: coverImage,
      product_ids: selectedProductIds,
      featured,
      active: true
    });

    setIsEditing(false);
    setEditingId(null);
    loadData();
  };

  const handleDelete = async (id: string, bName: string) => {
    if (confirm(`Excluir combo "${bName}"?`)) {
      await db.deleteBundle(id);
      loadData();
    }
  };

  const toggleProductSelect = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter(pid => pid !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Combos & Bundles</h2>
          <p className="text-xs text-slate-400">
            Crie pacotes agrupando múltiplos ebooks ou cursos com descontos especiais.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              setEditingId(null);
              setName('');
              setSlug('');
              setDesc('');
              setSelectedProductIds([]);
              setCurrency(settings.default_currency);
              setCheckoutUrl(settings.escalepay_default_url);
              setIsEditing(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Novo Combo</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="p-6 sm:p-8 rounded-xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white font-display">
              {editingId ? 'Editar Combo' : 'Novo Combo Promocional'}
            </h3>
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Combo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Combo IA Completa"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingId) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Slug URL (/combo/:slug)</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: combo-ia-completa"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-400 mb-1">Preço do Combo ({currency})</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Preço Original Riscado ({currency})</label>
                <input
                  type="number"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-indigo-400 mb-1">Link de Checkout EscalePay</label>
              <input
                type="url"
                required
                value={checkoutUrl}
                onChange={(e) => setCheckoutUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-indigo-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição</label>
              <textarea
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>

            <ImageField
              label="Imagem do combo *"
              folder="bundles"
              value={coverImage}
              onChange={setCoverImage}
              onValidityChange={setCoverImageValid}
              recordId={editingId || undefined}
              required
            />

            {/* Select Products included */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Selecione os Produtos Inclusos no Combo:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {allProducts.map((p) => {
                  const isChecked = selectedProductIds.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleProductSelect(p.id)}
                      className={`p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition-colors ${
                        isChecked
                          ? 'bg-indigo-950/60 border-indigo-600 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="rounded bg-slate-900 border-slate-700 text-indigo-600"
                      />
                      <span className="text-xs font-medium truncate">{p.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Salvar Combo
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bundles.map((b) => (
            <div key={b.id} className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{b.name}</h3>
                    <Link
                      to={`/combo/${b.slug}`}
                      target="_blank"
                      className="text-indigo-400 hover:text-indigo-300"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{b.description}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-bold text-white tabular-nums">{b.price} {b.currency}</span>
                  {b.old_price && (
                    <span className="block text-[10px] text-slate-500 line-through tabular-nums">
                      {b.old_price} {b.currency}
                    </span>
                  )}
                </div>
              </div>

              {b.products && b.products.length > 0 && (
                <div className="text-xs text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-300">Inclui:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {b.products.map(p => (
                      <li key={p.id} className="truncate">{p.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500 truncate max-w-[200px]">
                  {b.checkout_url}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(b)}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id, b.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
