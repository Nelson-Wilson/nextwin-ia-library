import { 
  Product, 
  Category, 
  Bundle, 
  ProductBenefit, 
  ProductFAQ, 
  Testimonial, 
  Banner, 
  Offer, 
  Coupon, 
  Lead, 
  Order, 
  BlogPost, 
  SiteSettings, 
  MarketingVisit, 
  AnalyticsEvent 
} from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY_PREFIX = 'nextwin_ai_lib_';

// Initial Seed Data as requested
const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat-ia',
    name: 'Inteligência Artificial',
    slug: 'ia',
    description: 'Ebooks, ferramentas e estratégias práticas para dominar a revolução da IA.',
    active: true,
  },
  {
    id: 'cat-negocios',
    name: 'Negócios Digitais',
    slug: 'negocios-digitais',
    description: 'Modelos de monetização, criação de agências e fontes de renda escaláveis.',
    active: true,
  },
  {
    id: 'cat-produtividade',
    name: 'Produtividade',
    slug: 'produtividade',
    description: 'Multiplique seu rendimento diário automatizando rotinas com prompts e agentes.',
    active: true,
  },
  {
    id: 'cat-prompts',
    name: 'Prompts & Templates',
    slug: 'prompts',
    description: 'Engenharia de comandos prontos para ChatGPT, Claude, Midjourney e mais.',
    active: true,
  },
];

const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-ia-lucrativa',
    name: 'IA Lucrativa',
    slug: 'ia-lucrativa',
    short_description: 'Aprenda como utilizar IA para criar novos serviços, produtos digitais e fontes de renda escaláveis.',
    full_description: 'O guia definitivo e prático para transformar modelos de inteligência artificial em máquinas de gerar valor financeiro real. Você descobrirá estratégias validadas para oferecer consultorias de IA, criar infoprodutos ultra-rápidos e automatizar entregas para clientes sem precisar programar uma única linha de código.',
    product_type: 'ebook',
    price: 147,
    old_price: 497,
    currency: 'MT',
    cover_image: '/src/assets/images/cover_ia_lucrativa_1790756556925.jpg',
    gallery: [
      '/src/assets/images/cover_ia_lucrativa_1790756556925.jpg',
      '/src/assets/images/cover_combo_ia_1790756580134.jpg'
    ],
    checkout_url: 'https://checkout.escalepay.com/pay/ia-lucrativa-demo',
    category_id: 'cat-ia',
    featured: true,
    active: true,
    published: true,
    seo_title: 'IA Lucrativa — Aprenda a Usar IA para Criar Novas Oportunidades',
    seo_description: 'Guia prático e direto ao ponto para dominar inteligência artificial e construir novas fontes de receita na economia digital.',
    audience_text: 'Profissionais autônomos, empreendedores digitais, criadores de conteúdo e estudantes que desejam se antecipar à revolução da IA e gerar renda imediata com ferramentas de ponta.',
    learn_items: [
      'Como estruturar ofertas de alto valor com ferramentas de IA generativa',
      'Criação acelerada de ebooks, apostilas e cursos digitais em poucas horas',
      'Automação de prospecção e atendimento para pequenas empresas',
      'Engenharia de prompts avançada para copywriting persuasivo e vendas',
      'Estratégias de precificação e escala para serviços digitais modernos'
    ],
    includes_items: [
      'Ebook Completo em Alta Definição (PDF + Versão Web)',
      '12 Modelos Prontos de Propostas Comerciais',
      'Planilha de Precificação e ROI para Serviços de IA',
      'Acesso a todas as futuras atualizações de conteúdo'
    ],
    bonuses: [
      {
        title: 'Masterclass: Criando Seu Primeiro Micro-SaaS com IA',
        value: '290 MT',
        description: 'Gravação exclusiva demonstrando passo a passo a validação de ferramentas sem código.'
      },
      {
        title: 'Pack de 100 Prompts de Vendas e Negociação',
        value: '180 MT',
        description: 'Comandos prontos testados para quebrar objeções e fechar contratos de consultoria.'
      }
    ],
    block_settings: {
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
    }
  },
  {
    id: 'prod-chatgpt-pratica',
    name: 'ChatGPT na Prática',
    slug: 'chatgpt-na-pratica',
    short_description: 'O método definitivo de engenharia de prompts para economizar 15+ horas por semana.',
    full_description: 'Pare de usar o ChatGPT como um simples buscador. Domine técnicas avançadas como Chain-of-Thought, Few-Shot Prompting, papéis cognitivos e automações de raciocínio para produzir relatórios profissionais, códigos e estratégias em minutos.',
    product_type: 'prompt_pack',
    price: 147,
    old_price: 497,
    currency: 'MT',
    cover_image: '/src/assets/images/cover_chatgpt_pratica_1790756568990.jpg',
    gallery: [
      '/src/assets/images/cover_chatgpt_pratica_1790756568990.jpg'
    ],
    checkout_url: 'https://checkout.escalepay.com/pay/chatgpt-na-pratica-demo',
    category_id: 'cat-prompts',
    featured: true,
    active: true,
    published: true,
    seo_title: 'ChatGPT na Prática — Manual Definitivo de Engenharia de Prompts',
    seo_description: 'Descubra como extrair 10x mais inteligência do ChatGPT com mais de 250 prompts validados.',
    audience_text: 'Estudantes, pesquisadores, gestores, profissionais de marketing e tecnologia que buscam máxima produtividade com inteligência artificial.',
    learn_items: [
      'Técnicas avançadas de engenharia de prompts sem jargões técnicos',
      'Como criar personas e especialistas virtuais sob demanda',
      'Análise de grandes documentos, planilhas e relatórios instantâneos',
      'Geração de conteúdo persuasivo mantendo a sua voz original'
    ],
    includes_items: [
      'Manual Digital Completo em PDF',
      'Biblioteca pesquisável com mais de 250 prompts testados',
      'Guia de integração com assistentes customizados (GPTs)'
    ],
    bonuses: [
      {
        title: 'Cheat Sheet de Comandos Rápidos',
        value: '120 MT',
        description: 'Guia visual em uma página para ter sempre colado na sua mesa de trabalho.'
      }
    ],
    block_settings: {
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
    }
  },
  {
    id: 'prod-automacao-ia',
    name: 'Automação com IA',
    slug: 'automacao-com-ia',
    short_description: 'Crie fluxos de trabalho autônomos, bots inteligentes e agentes integrados sem código.',
    full_description: 'Descubra como conectar Make, Zapier, WhatsApp, webhooks e modelos de linguagem para criar agentes digitais autônomos que atendem clientes, processam leads e executam rotinas inteiras enquanto você dorme.',
    product_type: 'course',
    price: 197,
    old_price: 597,
    currency: 'MT',
    cover_image: '/src/assets/images/hero_nextwin_library_1790756544243.jpg',
    gallery: [
      '/src/assets/images/hero_nextwin_library_1790756544243.jpg'
    ],
    checkout_url: 'https://checkout.escalepay.com/pay/automacao-ia-demo',
    category_id: 'cat-produtividade',
    featured: true,
    active: true,
    published: true,
    seo_title: 'Automação com IA — Agentes e Fluxos Autônomos sem Código',
    seo_description: 'Automatize operações repetitivas com inteligência artificial e ganhe tempo e escala.',
    audience_text: 'Empreendedores e times que querem eliminar tarefas repetitivas e construir agentes digitais para atendimento e operação.',
    learn_items: [
      'Construção de fluxos inteligentes com Make/Zapier e Webhooks',
      'Atendimento automatizado com integração WhatsApp e CRM',
      'Criação de agentes com memória e acesso a ferramentas externas',
      'Monitoramento de erros e controle de custos de tokens'
    ],
    includes_items: [
      'Treinamento em Vídeo + Apostila Técnica',
      '5 Templates Prontos de Automação para Importar com 1 Clique',
      'Comunidade de Alunos para Dúvidas e Networking'
    ],
    bonuses: [
      {
        title: 'Script de Atendimento Humanizado',
        value: '190 MT',
        description: 'Fluxo pronto para qualificar leads e agendar reuniões comerciais no WhatsApp.'
      }
    ],
    block_settings: {
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
    }
  }
];

const SEED_BENEFITS: ProductBenefit[] = [
  {
    id: 'ben-1',
    product_id: 'prod-ia-lucrativa',
    title: 'Criar Produtos Digitais',
    description: 'Construa ebooks, materiais educativos e templates comercializáveis em poucas horas.',
    icon: 'Package',
    sort_order: 1
  },
  {
    id: 'ben-2',
    product_id: 'prod-ia-lucrativa',
    title: 'Criar Serviços com IA',
    description: 'Ofereça consultoria de produtividade e automações para pequenas e médias empresas.',
    icon: 'Sparkles',
    sort_order: 2
  },
  {
    id: 'ben-3',
    product_id: 'prod-ia-lucrativa',
    title: 'Automatizar Tarefas Repetitivas',
    description: 'Economize mais de 10 horas semanais com prompts calibrados para escrita e análise.',
    icon: 'Zap',
    sort_order: 3
  },
  {
    id: 'ben-4',
    product_id: 'prod-ia-lucrativa',
    title: 'Escalar Renda sem Programação',
    description: 'Estratégias 100% no-code pensadas para quem precisa de resultados imediatos.',
    icon: 'TrendingUp',
    sort_order: 4
  },
  // ChatGPT na Prática
  {
    id: 'ben-5',
    product_id: 'prod-chatgpt-pratica',
    title: 'Prompts Prontos para Uso',
    description: 'Copie e cole comandos testados para negócios, marketing, estudos e programação.',
    icon: 'CheckCircle',
    sort_order: 1
  },
  {
    id: 'ben-6',
    product_id: 'prod-chatgpt-pratica',
    title: 'Respostas Sem Alucinações',
    description: 'Aprenda as restrições cognitivas que garantem dados precisos e verificáveis.',
    icon: 'ShieldCheck',
    sort_order: 2
  },
  {
    id: 'ben-7',
    product_id: 'prod-chatgpt-pratica',
    title: 'Multiplicação de Velocidade',
    description: 'Escreva propostas, artigos e planos operacionais em minutos em vez de dias.',
    icon: 'Clock',
    sort_order: 3
  }
];

const SEED_FAQS: ProductFAQ[] = [
  {
    id: 'faq-1',
    product_id: 'prod-ia-lucrativa',
    question: 'Preciso ter conhecimento de programação para aplicar o método?',
    answer: 'Não! Todo o material foi desenhado especificamente para pessoas leigas em programação. Usamos ferramentas intuitivas com interface gráfica e inteligência artificial conversacional.',
    sort_order: 1,
    active: true
  },
  {
    id: 'faq-2',
    product_id: 'prod-ia-lucrativa',
    question: 'Como recebo o acesso após a compra?',
    answer: 'Imediatamente após a confirmação do pagamento pelo EscalePay, você recebe por email o link de acesso seguro e pode baixar todos os materiais em seu computador ou celular.',
    sort_order: 2,
    active: true
  },
  {
    id: 'faq-3',
    product_id: 'prod-ia-lucrativa',
    question: 'Existe garantia de reembolso?',
    answer: 'Sim! Oferecemos 7 dias de garantia incondicional. Se você achar que o conteúdo não agregou valor, basta solicitar o reembolso com 1 clique.',
    sort_order: 3,
    active: true
  },
  {
    id: 'faq-4',
    product_id: 'prod-chatgpt-pratica',
    question: 'Os prompts funcionam na versão gratuita do ChatGPT?',
    answer: 'Sim! Foram calibrados para funcionarem tanto na versão gratuita (GPT-4o mini) quanto na versão Plus.',
    sort_order: 1,
    active: true
  }
];

const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Armando Cossa',
    role: 'Empreendedor Digital',
    company: 'Maputo',
    text: 'Apliquei as técnicas do ebook IA Lucrativa para prestar serviços de criação de conteúdo para duas imobiliárias. Recuperei o investimento na primeira semana!',
    rating: 5,
    product_id: 'prod-ia-lucrativa',
    active: true,
    created_at: '2026-03-12'
  },
  {
    id: 'test-2',
    name: 'Vanessa Sitoe',
    role: 'Consultora de Marketing',
    company: 'Matola',
    text: 'A clareza dos prompts do ChatGPT na Prática mudou completamente a velocidade da minha agência. Reduzimos o tempo de entrega de campanhas pela metade.',
    rating: 5,
    product_id: 'prod-chatgpt-pratica',
    active: true,
    created_at: '2026-03-18'
  },
  {
    id: 'test-3',
    name: 'Carlos Mbanze',
    role: 'Desenvolvedor & Criador',
    company: 'Beira',
    text: 'O Combo IA Completa é o melhor custo-benefício em língua portuguesa. Conteúdo denso, prático e sem enrolação acadêmica.',
    rating: 5,
    product_id: null, // Global testimonial
    active: true,
    created_at: '2026-03-24'
  }
];

const SEED_BUNDLES: Bundle[] = [
  {
    id: 'bundle-combo-ia-completa',
    name: 'Combo IA Completa',
    slug: 'combo-ia-completa',
    description: 'Leve todos os 3 produtos digitais premium (IA Lucrativa + ChatGPT na Prática + Automação com IA) com mais de 50% de desconto e bônus exclusivos.',
    cover_image: '/src/assets/images/cover_combo_ia_1790756580134.jpg',
    price: 297,
    old_price: 594,
    currency: 'MT',
    checkout_url: 'https://checkout.escalepay.com/pay/combo-ia-completa-demo',
    featured: true,
    active: true,
    product_ids: ['prod-ia-lucrativa', 'prod-chatgpt-pratica', 'prod-automacao-ia']
  }
];

const SEED_BANNERS: Banner[] = [
  {
    id: 'ban-1',
    title: 'Lançamento Exclusivo: IA Lucrativa 2.0',
    subtitle: 'Aprenda a criar novas fontes de renda com IA. Desconto especial por tempo limitado.',
    button_text: 'Garantir Acesso',
    button_url: '/produto/ia-lucrativa',
    position: 'top',
    active: true
  }
];

const SEED_OFFERS: Offer[] = [
  {
    id: 'off-1',
    name: 'Semana da Inteligência Artificial',
    description: 'Desconto promocional aplicado diretamente em todo o catálogo.',
    discount_type: 'promotional_price',
    discount_value: 147,
    product_id: 'prod-ia-lucrativa',
    active: true
  }
];

const SEED_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'NEXTWIN10',
    discount_type: 'percentage',
    discount_value: 10,
    max_uses: 500,
    used_count: 38,
    active: true
  },
  {
    id: 'coup-2',
    code: 'ESCALEPAY',
    discount_type: 'fixed',
    discount_value: 30,
    max_uses: 200,
    used_count: 15,
    active: true
  }
];

const SEED_SETTINGS: SiteSettings = {
  site_name: 'NextWin AI Library',
  site_description: 'A maior biblioteca digital de infoprodutos, prompts e ferramentas de Inteligência Artificial para estudo, trabalho e negócios.',
  hero_headline: 'Transforme a Inteligência Artificial em uma habilidade para estudar, trabalhar e criar novas oportunidades.',
  hero_subheadline: 'Acesse ebooks práticos, packs de prompts profissionais, templates de automação e materiais digitais prontos para gerar valor real na economia digital.',
  hero_cta_text: 'Explorar Produtos',
  contact_email: 'contato@nextwinlibrary.com',
  whatsapp_number: '+258 84 000 0000',
  tiktok_url: 'https://tiktok.com/@nextwin.ai',
  instagram_url: 'https://instagram.com/nextwin.ai',
  facebook_url: 'https://facebook.com/nextwin.ai',
  youtube_url: 'https://youtube.com/@nextwin.ai',
  default_currency: 'MT',
  meta_title_default: 'NextWin AI Library — Ebooks e Ferramentas Práticas de Inteligência Artificial',
  meta_description_default: 'Plataforma oficial de produtos digitais, cursos e prompts de IA. Aprenda a monetizar e aumentar produtividade hoje mesmo.',
  escalepay_default_url: 'https://checkout.escalepay.com/pay/'
};

const SEED_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: '5 Modelos de Negócio que Você Pode Criar com IA em 2026',
    slug: '5-modelos-de-negocio-com-ia',
    excerpt: 'Descubra como pequenas agências e autônomos estão faturando alto oferecendo serviços automatizados de marketing e atendimento.',
    content: `
A inteligência artificial deixou de ser uma curiosidade tecnológica para se transformar no maior motor de produtividade do século XXI. 

Se você souber estruturar os processos certos, pode transformar modelos como Claude, GPT-4 e ferramentas de agentes em soluções comerciais prontas para empresas que não têm tempo nem conhecimento técnico para implementá-las.

### 1. Consultoria de Implementação de Atendimento com IA
Pequenas e médias empresas perdem dezenas de leads fora do horário comercial. Configurar agentes conectados ao WhatsApp Business que respondem com base no cardápio ou catálogo da empresa é um serviço que pode render mensalidades recorrentes.

### 2. Criação Acelerada de Conteúdo e Copywriting
Produzir roteiros para TikTok, carrosséis para Instagram e campanhas de email marketing costumava levar semanas. Com templates de prompts calibrados, uma única pessoa faz o trabalho de uma agência inteira.

### 3. Síntese e Tradução Técnica
Escritórios de advocacia, clínicas e consultorias financeiras gastam fortunas analisando relatórios densos. O uso de IA para gerar resumos executivos e relatórios de conformidade economiza centenas de horas humanas.
    `,
    cover_image: '/src/assets/images/hero_nextwin_library_1790756544243.jpg',
    author: 'Nelson Dzimba',
    category: 'Negócios Digitais',
    published: true,
    published_at: '2026-03-25',
    seo_title: '5 Modelos de Negócio com IA para Faturar em 2026',
    seo_description: 'Aprenda como transformar ferramentas de inteligência artificial em serviços lucrativos e escaláveis.',
    created_at: '2026-03-25'
  },
  {
    id: 'post-2',
    title: 'O Guia Definitivo de Engenharia de Prompts para Profissionais',
    slug: 'guia-definitivo-engenharia-prompts',
    excerpt: 'Pare de pedir respostas genéricas. Aprenda como instruir a IA com contexto, tom de voz, restrições e saída estruturada.',
    content: `
A diferença entre uma resposta medíocre do ChatGPT e um trabalho de nível sênior não está no modelo, mas na forma como a instrução é desenhada.

Quando você diz simplesmente "escreva um email de vendas", o modelo recorre à média estatística da internet — resultando em textos previsíveis e robóticos. 

### A Estrutura dos 4 Pilares:
1. **Papel (Persona)**: Defina a identidade e senioridade do especialista.
2. **Contexto**: Explique quem é o público-alvo, as dores e o objetivo final.
3. **Restrições Negativas**: Diga explicitamente o que NÃO fazer (ex: "não use clichês como 'no mundo acelerado de hoje'").
4. **Formato de Saída**: Especifique tabelas, marcadores, JSON ou limite estrito de palavras.
    `,
    cover_image: '/src/assets/images/cover_chatgpt_pratica_1790756568990.jpg',
    author: 'Equipe NextWin',
    category: 'Inteligência Artificial',
    published: true,
    published_at: '2026-03-28',
    seo_title: 'Engenharia de Prompts Profissional — Passo a Passo',
    seo_description: 'Instruções para dominar o ChatGPT e obter respostas precisas e profissionais.',
    created_at: '2026-03-28'
  }
];

const SEED_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    external_order_id: 'ESC-98231',
    customer_name: 'Delfina Mondlane',
    customer_email: 'delfina.m@example.com',
    customer_phone: '+258 84 123 4567',
    product_id: 'prod-ia-lucrativa',
    amount: 147,
    currency: 'MT',
    status: 'paid',
    payment_method: 'M-Pesa / EscalePay',
    created_at: '2026-03-29T10:14:00Z'
  },
  {
    id: 'ord-1002',
    external_order_id: 'ESC-98244',
    customer_name: 'Joaquim Macuácua',
    customer_email: 'joaquim.mac@example.com',
    customer_phone: '+258 82 987 6543',
    bundle_id: 'bundle-combo-ia-completa',
    amount: 297,
    currency: 'MT',
    status: 'paid',
    payment_method: 'E-Mola / EscalePay',
    created_at: '2026-03-29T14:32:00Z'
  },
  {
    id: 'ord-1003',
    external_order_id: 'ESC-98259',
    customer_name: 'Fátima Tembe',
    customer_email: 'fatima.t@example.com',
    customer_phone: '+258 87 555 1234',
    product_id: 'prod-chatgpt-pratica',
    amount: 147,
    currency: 'MT',
    status: 'pending',
    payment_method: 'EscalePay Cartão',
    created_at: '2026-03-30T07:45:00Z'
  }
];

const SEED_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Samuel Guambe',
    email: 'samuel.g@gmail.com',
    whatsapp: '+258 84 999 1122',
    source: 'tiktok',
    campaign: 'ia_lucrativa_video01',
    utm_source: 'tiktok',
    utm_medium: 'organic',
    utm_campaign: 'ia_lucrativa_video01',
    landing_page: '/captura',
    created_at: '2026-03-28T09:12:00Z'
  },
  {
    id: 'lead-2',
    name: 'Helena Chissano',
    email: 'helena.chissano@outlook.com',
    whatsapp: '+258 82 333 4455',
    source: 'instagram',
    campaign: 'stories_prompts',
    utm_source: 'instagram',
    utm_medium: 'paid',
    utm_campaign: 'stories_prompts',
    landing_page: '/captura',
    created_at: '2026-03-29T16:40:00Z'
  }
];

const SEED_ANALYTICS: AnalyticsEvent[] = [
  {
    id: 'ev-1',
    event_name: 'page_view',
    session_id: 'sess-1',
    source: 'tiktok',
    medium: 'organic',
    campaign: 'ia_lucrativa',
    created_at: '2026-03-30T02:00:00Z'
  },
  {
    id: 'ev-2',
    event_name: 'product_view',
    session_id: 'sess-1',
    product_id: 'prod-ia-lucrativa',
    source: 'tiktok',
    created_at: '2026-03-30T02:01:00Z'
  },
  {
    id: 'ev-3',
    event_name: 'checkout_click',
    session_id: 'sess-1',
    product_id: 'prod-ia-lucrativa',
    source: 'tiktok',
    created_at: '2026-03-30T02:05:00Z'
  }
];

// Helper to access LocalStorage safely
function getStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage write error:', err);
  }
}

export const db = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, category:categories(*)')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase fetch products error, fallback to local storage:', e);
      }
    }
    const products = getStorage<Product[]>('products', SEED_PRODUCTS);
    const categories = await this.getCategories();
    return products.map(p => ({
      ...p,
      category: categories.find(c => c.id === p.category_id)
    }));
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, category:categories(*), benefits:product_benefits(*), faqs:product_faqs(*)')
          .eq('slug', slug)
          .single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase getProductBySlug error, using fallback:', e);
      }
    }
    const products = await this.getProducts();
    const product = products.find(p => p.slug === slug || p.id === slug);
    if (!product) return null;

    const benefits = (await this.getBenefitsByProductId(product.id));
    const faqs = (await this.getFaqsByProductId(product.id));
    const testimonials = (await this.getTestimonialsByProductId(product.id));

    return {
      ...product,
      benefits,
      faqs,
      testimonials
    };
  },

  async saveProduct(product: Partial<Product>): Promise<Product> {
    const products = getStorage<Product[]>('products', SEED_PRODUCTS);
    let updated: Product;

    if (product.id) {
      const idx = products.findIndex(p => p.id === product.id);
      if (idx >= 0) {
        updated = { 
          ...products[idx], 
          ...product, 
          updated_at: new Date().toISOString() 
        } as Product;
        products[idx] = updated;
      } else {
        updated = {
          ...product,
          id: product.id,
          created_at: new Date().toISOString()
        } as Product;
        products.push(updated);
      }
    } else {
      const newId = 'prod-' + Date.now();
      updated = {
        id: newId,
        name: product.name || 'Novo Produto',
        slug: product.slug || ('produto-' + Date.now()),
        short_description: product.short_description || '',
        full_description: product.full_description || '',
        product_type: product.product_type || 'ebook',
        price: Number(product.price) || 0,
        old_price: Number(product.old_price) || 0,
        currency: product.currency || 'MT',
        cover_image: product.cover_image || '/src/assets/images/cover_ia_lucrativa_1790756556925.jpg',
        gallery: product.gallery || [],
        checkout_url: product.checkout_url || 'https://checkout.escalepay.com/',
        category_id: product.category_id || 'cat-ia',
        featured: Boolean(product.featured),
        active: product.active ?? true,
        published: product.published ?? true,
        seo_title: product.seo_title,
        seo_description: product.seo_description,
        audience_text: product.audience_text,
        learn_items: product.learn_items || [],
        includes_items: product.includes_items || [],
        bonuses: product.bonuses || [],
        block_settings: product.block_settings || {
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
        },
        created_at: new Date().toISOString()
      };
      products.unshift(updated);
    }

    setStorage('products', products);

    // Try Supabase sync if online
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').upsert(updated);
      } catch (err) {
        console.warn('Supabase sync product error:', err);
      }
    }

    return updated;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const products = getStorage<Product[]>('products', SEED_PRODUCTS);
    const filtered = products.filter(p => p.id !== id);
    setStorage('products', filtered);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete product error:', err);
      }
    }
    return true;
  },

  // CATEGORIES
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase categories error:', e);
      }
    }
    return getStorage<Category[]>('categories', SEED_CATEGORIES);
  },

  async saveCategory(cat: Partial<Category>): Promise<Category> {
    const categories = getStorage<Category[]>('categories', SEED_CATEGORIES);
    let updated: Category;

    if (cat.id) {
      const idx = categories.findIndex(c => c.id === cat.id);
      if (idx >= 0) {
        updated = { ...categories[idx], ...cat } as Category;
        categories[idx] = updated;
      } else {
        updated = { ...cat, id: cat.id } as Category;
        categories.push(updated);
      }
    } else {
      updated = {
        id: 'cat-' + Date.now(),
        name: cat.name || 'Nova Categoria',
        slug: cat.slug || ('cat-' + Date.now()),
        description: cat.description || '',
        active: cat.active ?? true,
        created_at: new Date().toISOString()
      };
      categories.push(updated);
    }

    setStorage('categories', categories);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('categories').upsert(updated);
      } catch (err) {
        console.warn('Supabase save category error:', err);
      }
    }
    return updated;
  },

  async deleteCategory(id: string): Promise<boolean> {
    const categories = getStorage<Category[]>('categories', SEED_CATEGORIES);
    setStorage('categories', categories.filter(c => c.id !== id));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete category error:', err);
      }
    }
    return true;
  },

  // BUNDLES
  async getBundles(): Promise<Bundle[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('bundles').select('*');
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase bundles error:', e);
      }
    }
    const bundles = getStorage<Bundle[]>('bundles', SEED_BUNDLES);
    const products = await this.getProducts();
    return bundles.map(b => ({
      ...b,
      products: products.filter(p => b.product_ids?.includes(p.id))
    }));
  },

  async getBundleBySlug(slug: string): Promise<Bundle | null> {
    const bundles = await this.getBundles();
    return bundles.find(b => b.slug === slug || b.id === slug) || null;
  },

  async saveBundle(bundle: Partial<Bundle>): Promise<Bundle> {
    const bundles = getStorage<Bundle[]>('bundles', SEED_BUNDLES);
    let updated: Bundle;
    if (bundle.id) {
      const idx = bundles.findIndex(b => b.id === bundle.id);
      if (idx >= 0) {
        updated = { ...bundles[idx], ...bundle, updated_at: new Date().toISOString() } as Bundle;
        bundles[idx] = updated;
      } else {
        updated = { ...bundle, id: bundle.id } as Bundle;
        bundles.push(updated);
      }
    } else {
      updated = {
        id: 'bundle-' + Date.now(),
        name: bundle.name || 'Novo Combo',
        slug: bundle.slug || ('combo-' + Date.now()),
        description: bundle.description || '',
        cover_image: bundle.cover_image || '/src/assets/images/cover_combo_ia_1790756580134.jpg',
        price: Number(bundle.price) || 0,
        old_price: Number(bundle.old_price) || 0,
        currency: bundle.currency || 'MT',
        checkout_url: bundle.checkout_url || 'https://checkout.escalepay.com/',
        featured: Boolean(bundle.featured),
        active: bundle.active ?? true,
        product_ids: bundle.product_ids || [],
        created_at: new Date().toISOString()
      };
      bundles.unshift(updated);
    }
    setStorage('bundles', bundles);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('bundles').upsert(updated);
      } catch (err) {
        console.warn('Supabase save bundle error:', err);
      }
    }
    return updated;
  },

  async deleteBundle(id: string): Promise<boolean> {
    const bundles = getStorage<Bundle[]>('bundles', SEED_BUNDLES);
    setStorage('bundles', bundles.filter(b => b.id !== id));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('bundles').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete bundle error:', err);
      }
    }
    return true;
  },

  // BENEFITS
  async getBenefitsByProductId(productId: string): Promise<ProductBenefit[]> {
    const all = getStorage<ProductBenefit[]>('product_benefits', SEED_BENEFITS);
    return all.filter(b => b.product_id === productId).sort((a, b) => a.sort_order - b.sort_order);
  },

  async saveBenefit(benefit: Partial<ProductBenefit>): Promise<ProductBenefit> {
    const benefits = getStorage<ProductBenefit[]>('product_benefits', SEED_BENEFITS);
    let updated: ProductBenefit;
    if (benefit.id) {
      const idx = benefits.findIndex(b => b.id === benefit.id);
      if (idx >= 0) {
        updated = { ...benefits[idx], ...benefit } as ProductBenefit;
        benefits[idx] = updated;
      } else {
        updated = { ...benefit, id: benefit.id } as ProductBenefit;
        benefits.push(updated);
      }
    } else {
      updated = {
        id: 'ben-' + Date.now(),
        product_id: benefit.product_id || '',
        title: benefit.title || '',
        description: benefit.description || '',
        icon: benefit.icon || 'CheckCircle',
        sort_order: benefit.sort_order || (benefits.length + 1)
      };
      benefits.push(updated);
    }
    setStorage('product_benefits', benefits);
    return updated;
  },

  async deleteBenefit(id: string): Promise<boolean> {
    const benefits = getStorage<ProductBenefit[]>('product_benefits', SEED_BENEFITS);
    setStorage('product_benefits', benefits.filter(b => b.id !== id));
    return true;
  },

  // FAQS
  async getFaqsByProductId(productId: string): Promise<ProductFAQ[]> {
    const all = getStorage<ProductFAQ[]>('product_faqs', SEED_FAQS);
    return all.filter(f => f.product_id === productId).sort((a, b) => a.sort_order - b.sort_order);
  },

  async getAllFaqs(): Promise<ProductFAQ[]> {
    return getStorage<ProductFAQ[]>('product_faqs', SEED_FAQS);
  },

  async saveFaq(faq: Partial<ProductFAQ>): Promise<ProductFAQ> {
    const faqs = getStorage<ProductFAQ[]>('product_faqs', SEED_FAQS);
    let updated: ProductFAQ;
    if (faq.id) {
      const idx = faqs.findIndex(f => f.id === faq.id);
      if (idx >= 0) {
        updated = { ...faqs[idx], ...faq } as ProductFAQ;
        faqs[idx] = updated;
      } else {
        updated = { ...faq, id: faq.id } as ProductFAQ;
        faqs.push(updated);
      }
    } else {
      updated = {
        id: 'faq-' + Date.now(),
        product_id: faq.product_id || '',
        question: faq.question || '',
        answer: faq.answer || '',
        sort_order: faq.sort_order || (faqs.length + 1),
        active: faq.active ?? true
      };
      faqs.push(updated);
    }
    setStorage('product_faqs', faqs);
    return updated;
  },

  async deleteFaq(id: string): Promise<boolean> {
    const faqs = getStorage<ProductFAQ[]>('product_faqs', SEED_FAQS);
    setStorage('product_faqs', faqs.filter(f => f.id !== id));
    return true;
  },

  // TESTIMONIALS
  async getTestimonials(): Promise<Testimonial[]> {
    return getStorage<Testimonial[]>('testimonials', SEED_TESTIMONIALS);
  },

  async getTestimonialsByProductId(productId: string): Promise<Testimonial[]> {
    const all = await this.getTestimonials();
    // Return specific to product or global (product_id is null)
    return all.filter(t => t.active && (!t.product_id || t.product_id === productId));
  },

  async saveTestimonial(test: Partial<Testimonial>): Promise<Testimonial> {
    const tests = getStorage<Testimonial[]>('testimonials', SEED_TESTIMONIALS);
    let updated: Testimonial;
    if (test.id) {
      const idx = tests.findIndex(t => t.id === test.id);
      if (idx >= 0) {
        updated = { ...tests[idx], ...test } as Testimonial;
        tests[idx] = updated;
      } else {
        updated = { ...test, id: test.id } as Testimonial;
        tests.push(updated);
      }
    } else {
      updated = {
        id: 'test-' + Date.now(),
        name: test.name || 'Cliente',
        role: test.role || '',
        company: test.company || '',
        text: test.text || '',
        rating: test.rating || 5,
        product_id: test.product_id || null,
        active: test.active ?? true,
        created_at: new Date().toISOString()
      };
      tests.unshift(updated);
    }
    setStorage('testimonials', tests);
    return updated;
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    const tests = getStorage<Testimonial[]>('testimonials', SEED_TESTIMONIALS);
    setStorage('testimonials', tests.filter(t => t.id !== id));
    return true;
  },

  // BANNERS
  async getBanners(): Promise<Banner[]> {
    return getStorage<Banner[]>('banners', SEED_BANNERS);
  },

  async saveBanner(banner: Partial<Banner>): Promise<Banner> {
    const banners = getStorage<Banner[]>('banners', SEED_BANNERS);
    let updated: Banner;
    if (banner.id) {
      const idx = banners.findIndex(b => b.id === banner.id);
      if (idx >= 0) {
        updated = { ...banners[idx], ...banner } as Banner;
        banners[idx] = updated;
      } else {
        updated = { ...banner, id: banner.id } as Banner;
        banners.push(updated);
      }
    } else {
      updated = {
        id: 'ban-' + Date.now(),
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        button_text: banner.button_text || 'Ver Oferta',
        button_url: banner.button_url || '/produtos',
        position: banner.position || 'top',
        active: banner.active ?? true
      };
      banners.unshift(updated);
    }
    setStorage('banners', banners);
    return updated;
  },

  async deleteBanner(id: string): Promise<boolean> {
    const banners = getStorage<Banner[]>('banners', SEED_BANNERS);
    setStorage('banners', banners.filter(b => b.id !== id));
    return true;
  },

  // OFFERS
  async getOffers(): Promise<Offer[]> {
    return getStorage<Offer[]>('offers', SEED_OFFERS);
  },

  async saveOffer(offer: Partial<Offer>): Promise<Offer> {
    const offers = getStorage<Offer[]>('offers', SEED_OFFERS);
    let updated: Offer;
    if (offer.id) {
      const idx = offers.findIndex(o => o.id === offer.id);
      if (idx >= 0) {
        updated = { ...offers[idx], ...offer } as Offer;
        offers[idx] = updated;
      } else {
        updated = { ...offer, id: offer.id } as Offer;
        offers.push(updated);
      }
    } else {
      updated = {
        id: 'off-' + Date.now(),
        name: offer.name || 'Nova Oferta',
        description: offer.description || '',
        discount_type: offer.discount_type || 'percentage',
        discount_value: Number(offer.discount_value) || 0,
        product_id: offer.product_id,
        bundle_id: offer.bundle_id,
        active: offer.active ?? true
      };
      offers.unshift(updated);
    }
    setStorage('offers', offers);
    return updated;
  },

  async deleteOffer(id: string): Promise<boolean> {
    const offers = getStorage<Offer[]>('offers', SEED_OFFERS);
    setStorage('offers', offers.filter(o => o.id !== id));
    return true;
  },

  // COUPONS
  async getCoupons(): Promise<Coupon[]> {
    return getStorage<Coupon[]>('coupons', SEED_COUPONS);
  },

  async saveCoupon(coupon: Partial<Coupon>): Promise<Coupon> {
    const coupons = getStorage<Coupon[]>('coupons', SEED_COUPONS);
    let updated: Coupon;
    if (coupon.id) {
      const idx = coupons.findIndex(c => c.id === coupon.id);
      if (idx >= 0) {
        updated = { ...coupons[idx], ...coupon } as Coupon;
        coupons[idx] = updated;
      } else {
        updated = { ...coupon, id: coupon.id } as Coupon;
        coupons.push(updated);
      }
    } else {
      updated = {
        id: 'coup-' + Date.now(),
        code: (coupon.code || 'NOVO').toUpperCase().trim(),
        discount_type: coupon.discount_type || 'percentage',
        discount_value: Number(coupon.discount_value) || 10,
        max_uses: Number(coupon.max_uses) || 100,
        used_count: 0,
        active: coupon.active ?? true
      };
      coupons.unshift(updated);
    }
    setStorage('coupons', coupons);
    return updated;
  },

  async deleteCoupon(id: string): Promise<boolean> {
    const coupons = getStorage<Coupon[]>('coupons', SEED_COUPONS);
    setStorage('coupons', coupons.filter(c => c.id !== id));
    return true;
  },

  // LEADS
  async getLeads(): Promise<Lead[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase leads error:', e);
      }
    }
    return getStorage<Lead[]>('leads', SEED_LEADS);
  },

  async saveLead(lead: Omit<Lead, 'id' | 'created_at'>): Promise<Lead> {
    const leads = getStorage<Lead[]>('leads', SEED_LEADS);
    const newLead: Lead = {
      ...lead,
      id: 'lead-' + Date.now(),
      created_at: new Date().toISOString()
    };
    leads.unshift(newLead);
    setStorage('leads', leads);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('leads').insert(newLead);
      } catch (err) {
        console.warn('Supabase save lead error:', err);
      }
    }
    return newLead;
  },

  // ORDERS
  async getOrders(): Promise<Order[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase orders error:', e);
      }
    }
    const orders = getStorage<Order[]>('orders', SEED_ORDERS);
    const products = await this.getProducts();
    const bundles = await this.getBundles();
    return orders.map(o => ({
      ...o,
      product: products.find(p => p.id === o.product_id),
      bundle: bundles.find(b => b.id === o.bundle_id)
    }));
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    const orders = getStorage<Order[]>('orders', SEED_ORDERS);
    const idx = orders.findIndex(o => o.id === id);
    if (idx >= 0) {
      orders[idx].status = status;
      orders[idx].updated_at = new Date().toISOString();
      setStorage('orders', orders);
      return orders[idx];
    }
    return null;
  },

  // BLOG POSTS
  async getBlogPosts(): Promise<BlogPost[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase blog posts error:', e);
      }
    }
    return getStorage<BlogPost[]>('blog_posts', SEED_BLOG_POSTS);
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const posts = await this.getBlogPosts();
    return posts.find(p => p.slug === slug || p.id === slug) || null;
  },

  async saveBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
    const posts = getStorage<BlogPost[]>('blog_posts', SEED_BLOG_POSTS);
    let updated: BlogPost;
    if (post.id) {
      const idx = posts.findIndex(p => p.id === post.id);
      if (idx >= 0) {
        updated = { ...posts[idx], ...post, updated_at: new Date().toISOString() } as BlogPost;
        posts[idx] = updated;
      } else {
        updated = { ...post, id: post.id } as BlogPost;
        posts.push(updated);
      }
    } else {
      updated = {
        id: 'post-' + Date.now(),
        title: post.title || 'Novo Artigo',
        slug: post.slug || ('artigo-' + Date.now()),
        excerpt: post.excerpt || '',
        content: post.content || '',
        cover_image: post.cover_image || '/src/assets/images/hero_nextwin_library_1790756544243.jpg',
        author: post.author || 'Equipe NextWin',
        category: post.category || 'Inteligência Artificial',
        published: post.published ?? true,
        published_at: new Date().toISOString().split('T')[0],
        seo_title: post.seo_title,
        seo_description: post.seo_description,
        created_at: new Date().toISOString()
      };
      posts.unshift(updated);
    }
    setStorage('blog_posts', posts);
    return updated;
  },

  async deleteBlogPost(id: string): Promise<boolean> {
    const posts = getStorage<BlogPost[]>('blog_posts', SEED_BLOG_POSTS);
    setStorage('blog_posts', posts.filter(p => p.id !== id));
    return true;
  },

  // ANALYTICS & VISITS
  async getAnalyticsEvents(): Promise<AnalyticsEvent[]> {
    return getStorage<AnalyticsEvent[]>('analytics_events', SEED_ANALYTICS);
  },

  async recordEvent(event: Omit<AnalyticsEvent, 'id' | 'created_at'>): Promise<AnalyticsEvent> {
    const events = getStorage<AnalyticsEvent[]>('analytics_events', SEED_ANALYTICS);
    const newEvent: AnalyticsEvent = {
      ...event,
      id: 'ev-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      created_at: new Date().toISOString()
    };
    events.unshift(newEvent);
    // Keep max 500 events locally to avoid memory bloat
    if (events.length > 500) events.length = 500;
    setStorage('analytics_events', events);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('analytics_events').insert(newEvent);
      } catch (err) {
        // silent fail in analytics
      }
    }
    return newEvent;
  },

  // SITE SETTINGS
  async getSettings(): Promise<SiteSettings> {
    return getStorage<SiteSettings>('site_settings', SEED_SETTINGS);
  },

  async saveSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    setStorage('site_settings', updated);
    return updated;
  }
};
