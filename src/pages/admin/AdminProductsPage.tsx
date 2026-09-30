import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/database';
import { Product } from '../../types';
import { SafeImage } from '../../components/ui/SafeImage';
import { 
  Plus, 
  Search, 
  ExternalLink, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    setIsLoading(true);
    const data = await db.getProducts();
    setProducts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o produto "${name}"?`)) {
      await db.deleteProduct(id);
      loadProducts();
    }
  };

  const handleToggleActive = async (product: Product) => {
    await db.saveProduct({ ...product, active: !product.active });
    loadProducts();
  };

  const handleToggleFeatured = async (product: Product) => {
    await db.saveProduct({ ...product, featured: !product.featured });
    loadProducts();
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Gerenciamento de Produtos</h2>
          <p className="text-xs text-slate-400">
            Cadastre novos ebooks, prompts e cursos. As páginas públicas (/produto/:slug) são geradas automaticamente.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Produto</span>
        </Link>
      </div>

      {/* Filter bar */}
      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome ou slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="text-xs text-slate-400">
          Total: <strong className="text-white">{filtered.length}</strong> produtos
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            Nenhum produto cadastrado com os critérios de busca.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Capa & Nome</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Preço</th>
                  <th className="py-3 px-4">Checkout EscalePay</th>
                  <th className="py-3 px-4 text-center">Destaque</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Cover & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 rounded bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
                          <SafeImage
                            src={product.cover_image}
                            alt={product.name}
                            fallbackTitle={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 max-w-[200px]">
                          <p className="font-bold text-white truncate">{product.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">/produto/{product.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4 capitalize text-slate-400">
                      {product.product_type.replace('_', ' ')}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-white tabular-nums">
                      {product.price} {product.currency}
                      {product.old_price && (
                        <span className="block text-[10px] text-slate-500 line-through font-normal">
                          {product.old_price} {product.currency}
                        </span>
                      )}
                    </td>

                    {/* Checkout URL preview */}
                    <td className="py-3 px-4 max-w-[180px]">
                      <span className="text-[11px] text-slate-400 truncate block font-mono" title={product.checkout_url}>
                        {product.checkout_url}
                      </span>
                    </td>

                    {/* Featured toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(product)}
                        className={`p-1 rounded transition-colors ${
                          product.featured
                            ? 'text-amber-400 bg-amber-950/60 border border-amber-800/60'
                            : 'text-slate-600 hover:text-slate-400'
                        }`}
                        title="Alternar Destaque"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Active toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                          product.active
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {product.active ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/produto/${product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors"
                          title="Visualizar Página Pública de Venda"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                          title="Editar Produto"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                          title="Excluir Produto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
