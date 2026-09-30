import React, { useEffect, useState } from 'react';
import { db } from '../../lib/database';
import { AnalyticsEvent } from '../../types';
import { BarChart3, TrendingUp, Users, MousePointer, Share2, Globe } from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    db.getAnalyticsEvents().then((evs) => {
      setEvents(evs);
      setIsLoading(false);
    });
  }, []);

  const pageViews = events.filter(e => e.event_name === 'page_view').length;
  const productViews = events.filter(e => e.event_name === 'product_view').length;
  const checkoutClicks = events.filter(e => e.event_name === 'checkout_click').length;
  const leadSubmits = events.filter(e => e.event_name === 'lead_submit').length;

  const conversionRate = productViews > 0 
    ? ((checkoutClicks / productViews) * 100).toFixed(1) 
    : '0';

  const visitsByChannel = events.reduce<Record<string, number>>((totals, event) => {
    if (event.source && (event.event_name === 'page_view' || event.event_name === 'product_view')) {
      totals[event.source] = (totals[event.source] || 0) + 1;
    }
    return totals;
  }, {});
  const totalChannelVisits = Object.values(visitsByChannel).reduce((total, visits) => total + visits, 0);
  const channelColors = ['bg-rose-500', 'bg-blue-600', 'bg-pink-500', 'bg-emerald-500'];
  const channels = Object.entries(visitsByChannel).map(([name, visits], index) => ({
    name,
    visits,
    share: totalChannelVisits ? Math.round((visits / totalChannelVisits) * 100) : 0,
    color: channelColors[index % channelColors.length]
  }));

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h2 className="text-xl font-bold text-white font-display">Analytics Interno & Rastreamento UTM</h2>
        <p className="text-xs text-slate-400">
          Monitoramento de funil, origens de campanhas sociais e taxas de conversão para o checkout EscalePay.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase">Visualizações Página</p>
          <p className="text-2xl font-black text-white font-display tabular-nums">{pageViews}</p>
          <p className="text-[11px] text-slate-500">Métricas acumuladas</p>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase">Acessos a Produtos</p>
          <p className="text-2xl font-black text-indigo-400 font-display tabular-nums">{productViews}</p>
          <p className="text-[11px] text-slate-500">Visualizações em /produto/*</p>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase">Cliques no Checkout</p>
          <p className="text-2xl font-black text-amber-400 font-display tabular-nums">{checkoutClicks}</p>
          <p className="text-[11px] text-slate-500">Intenção de compra EscalePay</p>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase">Taxa de Conversão</p>
          <p className="text-2xl font-black text-emerald-400 font-display tabular-nums">{conversionRate}%</p>
          <p className="text-[11px] text-slate-500">Cliques / Visualizações</p>
        </div>
      </div>

      {/* Channel Performance */}
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-6">
        <div>
          <h3 className="text-sm font-bold text-white font-display">Performance por Canal de Tráfego</h3>
          <p className="text-xs text-slate-400">Origens capturadas automaticamente através de parâmetros ?utm_source=...</p>
        </div>

        <div className="space-y-4">
          {channels.map(c => (
            <div key={c.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{c.name}</span>
                <span className="text-slate-300 tabular-nums">
                  {c.visits.toLocaleString()} visitantes ({c.share}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden">
                <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.share}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Raw Analytics Events Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl space-y-3 p-6">
        <h3 className="text-sm font-bold text-white font-display">Registro em Tempo Real de Eventos</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Evento</th>
                <th className="py-2.5 px-3">Origem (UTM)</th>
                <th className="py-2.5 px-3">Campanha</th>
                <th className="py-2.5 px-3">Sessão</th>
                <th className="py-2.5 px-3">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {events.slice(0, 10).map(e => (
                <tr key={e.id}>
                  <td className="py-2.5 px-3">
                    <span className="font-mono text-indigo-400 font-semibold">{e.event_name}</span>
                  </td>
                  <td className="py-2.5 px-3 capitalize">{e.source || 'direto'}</td>
                  <td className="py-2.5 px-3 text-slate-400">{e.campaign || '-'}</td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono text-[10px]">{e.session_id.substring(0, 16)}...</td>
                  <td className="py-2.5 px-3 text-slate-500 tabular-nums text-[10px]">
                    {new Date(e.created_at).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
