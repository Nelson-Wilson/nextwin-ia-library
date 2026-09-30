# NEXTWIN AI LIBRARY

> Plataforma completa de e-commerce e CMS dinâmico para ebooks, packs de prompts, templates, cursos, materiais digitais e bundles com foco em Inteligência Artificial e integração de checkout externo com **EscalePay** e backend **Supabase**.

---

## 1. Visão Geral da Arquitetura

A plataforma foi projetada seguindo as 5 regras fundamentais do projeto:
- **Zero Páginas Hardcoded**: Nenhuma landing page específica para produtos foi codificada manualmente.
- **Componente Dinâmico Universal**: O componente `ProductPage` renderiza qualquer produto do catálogo a partir da rota `/produto/:slug`.
- **Alterações Imediatas sem Deploy**: Se o administrador alterar o preço de 147 MT para 197 MT, ou trocar a URL de checkout do EscalePay no painel administrativo, a alteração entra em vigor instantaneamente.
- **Escala Infinita**: Suporte nativo para dezenas, centenas ou milhares de produtos digitais sem qualquer alteração no código-fonte.

---

## 2. Stack Tecnológica

### Frontend
- **React 19 & TypeScript**
- **Vite** (Build ultra-rápido)
- **Tailwind CSS v4** (Estilização moderna)
- **React Router 7** (Roteamento dinâmico SPA)
- **Lucide React** (Ícones modernos e leves)

### Backend & Database
- **Supabase** (PostgreSQL, Supabase Auth, Supabase Storage, Row Level Security)
- **EscalePay** (Processamento de pagamentos externos seguro)

---

## 3. Estrutura de Rotas

### Site Público
- `/` — Home Page dinâmica com seções integradas ao banco
- `/produtos` — Catálogo completo com filtros por categoria, busca e ordenação
- `/produto/:slug` — Página dinâmica individual de produto
- `/categoria/:slug` — Listagem de produtos filtrados por categoria
- `/combo/:slug` — Página dinâmica de bundles/combos
- `/blog` — Lista de artigos do blog
- `/blog/:slug` — Artigo individual
- `/captura` — Página de captura de leads ("10 Prompts Gratuitos de ChatGPT") com tracking UTM
- `/sobre` — Página institucional
- `/contacto` — Página de contato com canais de suporte (WhatsApp e Email)
- `/politica-privacidade` — Termos e diretrizes de privacidade
- `/politica-reembolso` — Garantia incondicional de 7 dias
- `/termos` — Termos de uso e direitos autorais

### Painel Administrativo
- `/admin/login` — Autenticação de administradores (com acesso demo imediato)
- `/admin` — Dashboard principal com métricas, faturamento, leads e gráficos de tráfego UTM (TikTok, Facebook, Instagram, Google)
- `/admin/products` — CRUD de produtos com ativação e destaques em 1 clique
- `/admin/products/new` — Cadastro de novo produto com compositor de blocos
- `/admin/products/:id/edit` — Edição completa de produtos
- `/admin/categories` — Gerenciamento de categorias
- `/admin/bundles` — Gerenciamento de combos com múltiplos produtos
- `/admin/offers` — Ofertas e descontos temporários
- `/admin/coupons` — Cupons de desconto
- `/admin/banners` — Banners de topo configuráveis
- `/admin/testimonials` — Depoimentos e prova social
- `/admin/faqs` — Perguntas frequentes para quebra de objeções
- `/admin/leads` — Tabela de leads com parâmetros UTM e exportação CSV
- `/admin/orders` — Acompanhamento de pedidos e status EscalePay
- `/admin/analytics` — Métricas internas de funil e eventos em tempo real
- `/admin/blog` — CMS completo de artigos
- `/admin/settings` — Configurações globais (Moeda, WhatsApp, Redes Sociais, SEO)

---

## 4. Como Configurar o Supabase

1. Crie uma conta ou acesse seu painel em [supabase.com](https://supabase.com).
2. Crie um novo projeto (ex: `nextwin-ai-library`).
3. Abra o **SQL Editor** no menu lateral esquerdo do Supabase.
4. Abra o arquivo `supabase-schema.sql` deste projeto, copie todo o conteúdo e cole no SQL Editor do Supabase.
5. Clique em **Run** para executar as migrations. Isso criará:
   - Todas as tabelas (`products`, `categories`, `bundles`, `leads`, `orders`, `blog_posts`, etc.)
   - Índices de performance
   - Políticas de segurança Row Level Security (RLS)
   - Dados iniciais de demonstração (IA Lucrativa, ChatGPT na Prática, Automação com IA, Combo IA Completa)
6. Vá em **Project Settings** -> **API**:
   - Copie o **Project URL**
   - Copie a chave **anon public**
7. Adicione essas informações nas variáveis de ambiente do seu projeto:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-public
   ```

*Nota: Em ambiente de desenvolvimento local, a plataforma conta com um repositório inteligente com fallback em LocalStorage, permitindo testar e administrar tudo imediatamente mesmo antes de configurar o Supabase.*

---

## 5. Como Fazer Deploy na Vercel

1. Suba este repositório para o seu **GitHub** ou **GitLab**.
2. Acesse [vercel.com](https://vercel.com) e conecte sua conta.
3. Clique em **Add New Project** e selecione o repositório da `nextwin-ai-library`.
4. Em **Environment Variables**, adicione:
   - `VITE_SUPABASE_URL` = sua URL do Supabase
   - `VITE_SUPABASE_ANON_KEY` = sua anon key do Supabase
5. O framework detectará automaticamente como **Vite**.
6. Clique em **Deploy**.
7. Após o deploy, a Vercel fornecerá o link público (ex: `nextwin-library.vercel.app`).
8. Você pode apontar seu domínio personalizado (ex: `loja.nextwin.ai`) nas configurações da Vercel em **Domains**.

---

## 6. Fluxo de Tráfego e Vendas (Exemplo)

```
Tráfego Social (TikTok / Instagram Ads / Facebook)
           ↓
URL com UTM: /produto/ia-lucrativa?utm_source=tiktok&utm_medium=video
           ↓
NextWin captura os parâmetros UTM e registra a visualização
           ↓
Página /produto/ia-lucrativa carrega os dados e blocos configurados no banco
           ↓
Cliente lê os benefícios, depoimentos e clica em "Comprar agora"
           ↓
Evento de clique registrado internamente
           ↓
Cliente redirecionado para o checkout seguro do EscalePay
```

---

## 7. Credenciais de Teste do Painel Admin

- **URL de Acesso**: `/admin/login`
- **Email Padrão**: `admin@nextwin.com`
- **Senha Padrão**: `admin123`
- *Ou utilize o botão de acesso rápido "Entrar com Conta Demo de Administrador".*
