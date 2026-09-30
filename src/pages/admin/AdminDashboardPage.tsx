import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/database';
import { Product, Lead, Order, AnalyticsEvent } from '../../types';
import { 
  Package, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  MousePointerClick, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  Globe, 
  Share2 
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      db.getProducts(),
      db.getLeads(),
      db.getOrders(),
      db.getAnalyticsEvents()
    ]).then(([prods, lds, ords, evs]) => {
      setProducts(prods);
      setLeads(lds);
      setOrders(ords);
      setEvents(evs);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const activeProductsCount = products.filter(p => p.active && p.published).length;
  const paidOrders = orders.filter(o => o.status === 'paid');
  const totalRevenue = paidOrders.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const checkoutClicksCount = events.filter(e => e.event_name === 'checkout_click').length;
  const totalViewsCount = events.filter(e => e.event_name === 'page_view' || e.event_name === 'product_view').length;

  // Traffic origins calculated from events and leads
  const visitsBySource = events.reduce<Record<string, number>>((totals, event) => {
    if (event.source && (event.event_name === 'page_view' || event.event_name === 'product_view')) {
      totals[event.source] = (totals[event.source] || 0) + 1;
    }
    return totals;
  }, {});
  const totalVisitsBySource = Object.values(visitsBySource).reduce((total, visits) => total + visits, 0);
  const sourceColors = ['bg-rose-500', 'bg-blue-600', 'bg-pink-500', 'bg-emerald-500'];
  const trafficOrigins = Object.entries(visitsBySource).map(([name, count], index) => ({
    name,
    count,
    percentage: totalVisitsBySource ? Math.round((count / totalVisitsBySource) * 100) : 0,
    color: sourceColors[index % sourceColors.length]
  }));

  return (
    <div className="space-y-8">
      
      {/* Top Header & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Visão Geral do E-commerce</h2>
          <p className="text-xs text-slate-400">Métricas em tempo real de tráfego, conversão e pedidos</p>
        </div>

        {/* Timeframe segmented control */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs self-start sm:self-auto">
          {(['7d', '30d', '90d'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                timeframe === t
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Últimos {t.replace('d', ' dias')}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Revenue */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Receita Total</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-display tabular-nums">
              {totalRevenue.toLocaleString()} MT
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>{paidOrders.length} pedidos confirmados</span>
            </div>
          </div>
        </div>

        {/* Leads */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total de Leads</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-800/80 flex items-center justify-center text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-display tabular-nums">
              {leads.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Campanha "10 Prompts Grátis"
            </div>
          </div>
        </div>

        {/* Checkout Clicks */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cliques Checkout</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-800/80 flex items-center justify-center text-amber-400">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-display tabular-nums">
              {checkoutClicksCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Redirecionamentos EscalePay
            </div>
          </div>
        </div>

        {/* Active Products */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Produtos Ativos</span>
            <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-800/80 flex items-center justify-center text-purple-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-display tabular-nums">
              {activeProductsCount} <span className="text-sm font-normal text-slate-500">/ {products.length}</span>
            </div>
            <div className="text-[11px] text-indigo-400 mt-1">
              {products.length} cadastrados no banco
            </div>
          </div>
        </div>

      </div>

      {/* Traffic Origins & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Traffic Origins Breakdown */}
        <div className="lg:col-span-6 p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-display">Origem dos Visitantes (UTM)</h3>
              <p className="text-xs text-slate-400">Canais de tráfego que direcionam para as páginas de venda</p>
            </div>
            <Share2 className="w-4 h-4 text-slate-500" />
          </div>

          <div className="space-y-4 pt-2">
            {trafficOrigins.map((origin) => (
              <div key={origin.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300">{origin.name}</span>
                  <span className="font-semibold text-white tabular-nums">
                    {origin.count.toLocaleString()} visitas ({origin.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${origin.color}`} 
                    style={{ width: `${origin.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Parâmetros UTM capturados automaticamente nas URLs</span>
            <Link to="/admin/analytics" className="text-indigo-400 hover:underline">
              Ver Analytics Completo &rarr;
            </Link>
          </div>
        </div>

        {/* Most Viewed Products */}
        <div className="lg:col-span-6 p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-display">Produtos Mais Acessados</h3>
              <p className="text-xs text-slate-400">Páginas de produto com maior tráfego e interesse</p>
            </div>
            <Link to="/admin/products" className="text-xs text-indigo-400 hover:underline">
              Gerenciar Produtos
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {products.slice(0, 4).map((p, idx) => (
              <div 
                key={p.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-slate-500 w-4 text-center">{idx + 1}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{p.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">/produto/{p.slug}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-white tabular-nums">
                    {p.price} {p.currency}
                  </span>
                  <p className="text-[10px] text-emerald-400 font-medium">Ativo</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Orders & Leads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Orders */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-display">Últimos Pedidos EscalePay</h3>
            <Link to="/admin/orders" className="text-xs text-indigo-400 hover:underline">
              Ver todos os pedidos ({orders.length}) &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500 border-b border-slate-800 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="pb-2.5">Cliente</th>
                  <th className="pb-2.5">Item</th>
                  <th className="pb-2.5">Valor</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {orders.slice(0, 4).map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/30">
                    <td className="py-3">
                      <p className="font-semibold text-white">{ord.customer_name}</p>
                      <p className="text-[10px] text-slate-500">{ord.customer_email}</p>
                    </td>
                    <td className="py-3 max-w-[150px] truncate">
                      {ord.product?.name || ord.bundle?.name || 'Material Digital'}
                    </td>
                    <td className="py-3 font-semibold tabular-nums text-white">
                      {ord.amount} {ord.currency}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        ord.status === 'paid'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                          : ord.status === 'pending'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800/50'
                          : 'bg-rose-950 text-rose-400 border border-rose-800/50'
                      }`}>
                        {ord.status === 'paid' ? 'Pago' : ord.status === 'pending' ? 'Pendente' : ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-display">Leads Capturados</h3>
            <Link to="/admin/leads" className="text-xs text-indigo-400 hover:underline">
              Ver Leads ({leads.length}) &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {leads.slice(0, 4).map((lead) => (
              <div key={lead.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{lead.name}</p>
                  <p className="text-[11px] text-slate-400">{lead.email}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900">
                    {lead.source || 'Orgânico'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
