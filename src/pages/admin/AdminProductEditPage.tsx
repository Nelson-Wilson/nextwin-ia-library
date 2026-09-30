import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../../lib/database';
import { Product, Category, ProductBenefit, ProductFAQ, ProductType, ProductBonus, ProductBlockSettings } from '../../types';
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Eye, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  Gift, 
  Sliders,
  Check
} from 'lucide-react';

export const AdminProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [categories, setCategories] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'benefits' | 'faqs' | 'bonuses' | 'blocks' | 'seo'>('general');

  // Product Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [productType, setProductType] = useState<ProductType>('ebook');
  const [price, setPrice] = useState<number>(147);
  const [oldPrice, setOldPrice] = useState<number>(497);
  const [currency, setCurrency] = useState('MT');
  const [coverImage, setCoverImage] = useState('/src/assets/images/cover_ia_lucrativa_1790756556925.jpg');
  const [checkoutUrl, setCheckoutUrl] = useState('https://checkout.escalepay.com/pay/');
  const [categoryId, setCategoryId] = useState('cat-ia');
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [published, setPublished] = useState(true);

  // SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');

  // Target audience & what you learn
  const [audienceText, setAudienceText] = useState('');
  const [learnItemsText, setLearnItemsText] = useState('');
  const [includesText, setIncludesText] = useState('');

  // Benefits
  const [benefits, setBenefits] = useState<ProductBenefit[]>([]);
  const [newBenefitTitle, setNewBenefitTitle] = useState('');
  const [newBenefitDesc, setNewBenefitDesc] = useState('');

  // FAQs
  const [faqs, setFaqs] = useState<ProductFAQ[]>([]);
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  // Bonuses
  const [bonuses, setBonuses] = useState<ProductBonus[]>([]);
  const [newBonusTitle, setNewBonusTitle] = useState('');
  const [newBonusValue, setNewBonusValue] = useState('');
  const [newBonusDesc, setNewBonusDesc] = useState('');

  // Blocks
  const [blocks, setBlocks] = useState<ProductBlockSettings>({
    hero: true,
    benefits: true,
    content: true,
    audience: true,
    includes: true,
    bonuses: true,
    testimonials: true,
    faq: true,
    offer: true,
    cta: true
  });

  useEffect(() => {
    db.getCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0 && !categoryId) {
        setCategoryId(cats[0].id);
      }
    });

    if (!isNew && id) {
      db.getProducts().then(async (prods) => {
        const found = prods.find(p => p.id === id);
        if (found) {
          setName(found.name);
          setSlug(found.slug);
          setShortDesc(found.short_description || '');
          setFullDesc(found.full_description || '');
          setProductType(found.product_type);
          setPrice(found.price);
          setOldPrice(found.old_price || 0);
          setCurrency(found.currency || 'MT');
          setCoverImage(found.cover_image);
          setCheckoutUrl(found.checkout_url);
          setCategoryId(found.category_id);
          setFeatured(found.featured);
          setActive(found.active);
          setPublished(found.published);
          setSeoTitle(found.seo_title || '');
          setSeoDesc(found.seo_description || '');
          setAudienceText(found.audience_text || '');
          setLearnItemsText((found.learn_items || []).join('\n'));
          setIncludesText((found.includes_items || []).join('\n'));
          setBonuses(found.bonuses || []);
          if (found.block_settings) {
            setBlocks(found.block_settings);
          }

          // Load benefits and faqs
          const bList = await db.getBenefitsByProductId(found.id);
          setBenefits(bList);
          const fList = await db.getFaqsByProductId(found.id);
          setFaqs(fList);
        }
      });
    }
  }, [id, isNew]);

  const handleGenerateSlug = () => {
    const generated = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generated);
  };

  const handleAddBenefit = () => {
    if (!newBenefitTitle.trim()) return;
    const newBen: ProductBenefit = {
      id: 'ben-' + Date.now(),
      product_id: id || 'temp',
      title: newBenefitTitle,
      description: newBenefitDesc,
      icon: 'CheckCircle',
      sort_order: benefits.length + 1
    };
    setBenefits([...benefits, newBen]);
    setNewBenefitTitle('');
    setNewBenefitDesc('');
  };

  const handleRemoveBenefit = (benId: string) => {
    setBenefits(benefits.filter(b => b.id !== benId));
  };

  const handleAddFaq = () => {
    if (!newFaqQuestion.trim()) return;
    const newF: ProductFAQ = {
      id: 'faq-' + Date.now(),
      product_id: id || 'temp',
      question: newFaqQuestion,
      answer: newFaqAnswer,
      sort_order: faqs.length + 1,
      active: true
    };
    setFaqs([...faqs, newF]);
    setNewFaqQuestion('');
    setNewFaqAnswer('');
  };

  const handleRemoveFaq = (faqId: string) => {
    setFaqs(faqs.filter(f => f.id !== faqId));
  };

  const handleAddBonus = () => {
    if (!newBonusTitle.trim()) return;
    setBonuses([...bonuses, {
      title: newBonusTitle,
      value: newBonusValue || '150 MT',
      description: newBonusDesc
    }]);
    setNewBonusTitle('');
    setNewBonusValue('');
    setNewBonusDesc('');
  };

  const handleRemoveBonus = (index: number) => {
    setBonuses(bonuses.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Preencha o nome do produto.');
      return;
    }

    const finalSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setIsSaving(true);

    try {
      const productData: Partial<Product> = {
        id: isNew ? undefined : id,
        name,
        slug: finalSlug,
        short_description: shortDesc,
        full_description: fullDesc,
        product_type: productType,
        price: Number(price),
        old_price: Number(oldPrice),
        currency,
        cover_image: coverImage,
        gallery: [coverImage],
        checkout_url: checkoutUrl,
        category_id: categoryId,
        featured,
        active,
        published,
        seo_title: seoTitle || `${name} — NextWin AI Library`,
        seo_description: seoDesc || shortDesc,
        audience_text: audienceText,
        learn_items: learnItemsText.split('\n').map(s => s.trim()).filter(Boolean),
        includes_items: includesText.split('\n').map(s => s.trim()).filter(Boolean),
        bonuses,
        block_settings: blocks
      };

      const saved = await db.saveProduct(productData);

      // Save benefits with new product ID
      for (const b of benefits) {
        await db.saveBenefit({ ...b, product_id: saved.id });
      }

      // Save FAQs with new product ID
      for (const f of faqs) {
        await db.saveFaq({ ...f, product_id: saved.id });
      }

      setIsSaving(false);
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      setIsSaving(false);
      alert('Erro ao salvar produto.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-white font-display">
              {isNew ? 'Cadastrar Novo Produto' : `Editar: ${name}`}
            </h2>
            <p className="text-xs text-slate-400">
              Configure dados, blocos da landing page e link do checkout EscalePay
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && (
            <Link
              to={`/produto/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:text-white rounded-lg transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Página Pública</span>
            </Link>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Salvando...' : 'Publicar Produto'}</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-1 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { key: 'general', label: '1. Informações & Preço' },
          { key: 'benefits', label: '2. Benefícios' },
          { key: 'faqs', label: '3. Perguntas FAQ' },
          { key: 'bonuses', label: '4. Bônus Inclusos' },
          { key: 'blocks', label: '5. Blocos da Página' },
          { key: 'seo', label: '6. SEO & Redes' }
        ].map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key as any)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === t.key
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="space-y-6">

        {/* TAB 1: GENERAL & PRICING */}
        {activeTab === 'general' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: IA Lucrativa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Slug da URL * (/produto/:slug)
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateSlug}
                    className="text-[11px] text-indigo-400 hover:underline"
                  >
                    Gerar do nome
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ex: ia-lucrativa"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Product Type & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Tipo de Produto
                </label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value as ProductType)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="ebook">Ebook (Livro Digital em PDF)</option>
                  <option value="prompt_pack">Pack de Prompts (Biblioteca de Comandos)</option>
                  <option value="template">Template / Modelo Pronto</option>
                  <option value="course">Curso / Videoaulas</option>
                  <option value="software">Software / Agente de IA</option>
                  <option value="bundle">Bundle / Combo</option>
                  <option value="other">Outro Material Digital</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Categoria
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Old Price & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <div>
                <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
                  Preço Atual de Venda *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="any"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white font-bold tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Preço Anterior (Riscado)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-400 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Moeda
                </label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200"
                />
              </div>
            </div>

            {/* EscalePay Checkout URL */}
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60 space-y-2">
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Link de Checkout EscalePay (checkout_url) *
              </label>
              <input
                type="url"
                required
                placeholder="https://checkout.escalepay.com/pay/seu-produto"
                value={checkoutUrl}
                onChange={(e) => setCheckoutUrl(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-indigo-900/80 rounded-lg text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-400">
                Ao clicar em "Comprar agora", o cliente será redirecionado para este link seguro do EscalePay.
              </p>
            </div>

            {/* Cover Image URL */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Capa do Produto (URL ou Caminho) *
              </label>
              <input
                type="text"
                required
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300"
              />
            </div>

            {/* Descriptions */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Descrição Curta (Hero) *
              </label>
              <textarea
                rows={2}
                required
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Descrição Completa (Seção de Conteúdo)
              </label>
              <textarea
                rows={4}
                value={fullDesc}
                onChange={(e) => setFullDesc(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6 pt-2 border-t border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                />
                <span className="font-semibold">Destacar na Home Page (featured)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                />
                <span className="font-semibold">Produto Ativo</span>
              </label>
            </div>

          </div>
        )}

        {/* TAB 2: BENEFITS */}
        {activeTab === 'benefits' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-display">Benefícios Dinâmicos</h3>
              <p className="text-xs text-slate-400">Adicione os principais diferenciais deste material.</p>
            </div>

            <div className="space-y-3">
              {benefits.map((b, idx) => (
                <div key={b.id || idx} className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white">{b.title}</p>
                    <p className="text-[11px] text-slate-400">{b.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBenefit(b.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">+ Adicionar Novo Benefício</p>
              <input
                type="text"
                placeholder="Título (ex: Automatizar Tarefas)"
                value={newBenefitTitle}
                onChange={(e) => setNewBenefitTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
              <textarea
                rows={2}
                placeholder="Descrição resumida do benefício"
                value={newBenefitDesc}
                onChange={(e) => setNewBenefitDesc(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddBenefit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 transition-colors"
              >
                Adicionar à lista
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: FAQS */}
        {activeTab === 'faqs' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-display">Perguntas Frequentes (FAQ)</h3>
              <p className="text-xs text-slate-400">Esclareça dúvidas comuns sobre formato, suporte e garantia.</p>
            </div>

            <div className="space-y-3">
              {faqs.map((f, idx) => (
                <div key={f.id || idx} className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-white mb-1">{f.question}</p>
                    <p className="text-[11px] text-slate-400">{f.answer}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(f.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">+ Adicionar Nova Pergunta</p>
              <input
                type="text"
                placeholder="Pergunta (ex: Como recebo o material?)"
                value={newFaqQuestion}
                onChange={(e) => setNewFaqQuestion(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
              <textarea
                rows={2}
                placeholder="Resposta clara e objetiva"
                value={newFaqAnswer}
                onChange={(e) => setNewFaqAnswer(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddFaq}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 transition-colors"
              >
                Salvar Pergunta
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: BONUSES */}
        {activeTab === 'bonuses' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-display">Bônus Exclusivos Inclusos</h3>
              <p className="text-xs text-slate-400">Aumente o valor percebido da oferta adicionando bônus gratuitos.</p>
            </div>

            <div className="space-y-3">
              {bonuses.map((b, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-white">{b.title} <span className="text-amber-400 ml-1">({b.value})</span></p>
                    <p className="text-[11px] text-slate-400">{b.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBonus(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">+ Adicionar Novo Bônus</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Título do Bônus"
                  value={newBonusTitle}
                  onChange={(e) => setNewBonusTitle(e.target.value)}
                  className="sm:col-span-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Valor (ex: 290 MT)"
                  value={newBonusValue}
                  onChange={(e) => setNewBonusValue(e.target.value)}
                  className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Descrição do bônus"
                value={newBonusDesc}
                onChange={(e) => setNewBonusDesc(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddBonus}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 transition-colors"
              >
                Adicionar Bônus
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: BLOCKS VISIBILITY */}
        {activeTab === 'blocks' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-display">Composição de Blocos da Página</h3>
              <p className="text-xs text-slate-400">
                Ative ou desative seções da página de venda sem tocar em uma única linha de código.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { key: 'hero', name: 'Bloco 1: Hero Principal (Capa, Preço e Botão Comprar)' },
                { key: 'benefits', name: 'Bloco 2: Benefícios ("Por que este produto?")' },
                { key: 'content', name: 'Bloco 3: Conteúdo Detalhado & O que vai aprender' },
                { key: 'audience', name: 'Bloco 4: Para quem é (Público-alvo)' },
                { key: 'includes', name: 'Bloco 5: O que você recebe (Itens inclusos)' },
                { key: 'bonuses', name: 'Bloco 6: Bônus Gratuitos' },
                { key: 'testimonials', name: 'Bloco 7: Depoimentos de Clientes' },
                { key: 'faq', name: 'Bloco 8: Perguntas Frequentes (FAQ)' },
                { key: 'offer', name: 'Bloco 9: Oferta & Garantia de 7 Dias' },
                { key: 'cta', name: 'Bloco 10: CTA Final & Barra Fixa Mobile' }
              ].map(b => (
                <label 
                  key={b.key}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-slate-700"
                >
                  <span className="text-xs font-medium text-slate-300">{b.name}</span>
                  <input
                    type="checkbox"
                    checked={(blocks as any)[b.key]}
                    onChange={(e) => setBlocks({ ...blocks, [b.key]: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
                  />
                </label>
              ))}
            </div>

            {/* Additional Content Fields */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Texto do Público-Alvo (Para quem é)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Empreendedores, consultores e estudantes..."
                  value={audienceText}
                  onChange={(e) => setAudienceText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  O que vai aprender (1 item por linha)
                </label>
                <textarea
                  rows={4}
                  placeholder="Item 1&#10;Item 2&#10;Item 3"
                  value={learnItemsText}
                  onChange={(e) => setLearnItemsText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  O que você recebe (1 item por linha)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ebook em PDF&#10;Modelos prontos&#10;Acesso vitalício"
                  value={includesText}
                  onChange={(e) => setIncludesText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: SEO */}
        {activeTab === 'seo' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-display">SEO & Metatags</h3>
              <p className="text-xs text-slate-400">Otimização para busca no Google e compartilhamento no WhatsApp/redes.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                  Meta Title
                </label>
                <input
                  type="text"
                  placeholder="Ex: IA Lucrativa — Aprenda a Usar IA para Criar Novas Oportunidades"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Descrição que aparece nos resultados do Google e no card do WhatsApp..."
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

      </form>

    </div>
  );
};
