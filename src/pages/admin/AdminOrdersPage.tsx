import React, { useEffect, useState } from 'react';
import { db } from '../../lib/database';
import { Order, OrderStatus } from '../../types';
import { ShoppingBag, CheckCircle2, Clock, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const data = await db.getOrders();
    setOrders(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    await db.updateOrderStatus(id, newStatus);
    loadData();
  };

  const statusBadges: Record<OrderStatus, { label: string; color: string }> = {
    paid: { label: 'Pago', color: 'bg-emerald-950 text-emerald-400 border-emerald-800/60' },
    pending: { label: 'Pendente', color: 'bg-amber-950 text-amber-400 border-amber-800/60' },
    failed: { label: 'Falhou', color: 'bg-rose-950 text-rose-400 border-rose-800/60' },
    refunded: { label: 'Reembolsado', color: 'bg-purple-950 text-purple-400 border-purple-800/60' },
    cancelled: { label: 'Cancelado', color: 'bg-slate-800 text-slate-400 border-slate-700' }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Pedidos & Transações EscalePay</h2>
          <p className="text-xs text-slate-400">
            Acompanhamento de vendas externas e preparação para webhooks de pagamentos.
          </p>
        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Atualizar Pedidos</span>
        </button>
      </div>

      {/* Info notice about EscalePay webhook readiness */}
      <div className="p-4 bg-slate-900/60 border border-indigo-900/40 rounded-xl text-xs text-slate-300 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">Integração EscalePay Externa</p>
          <p className="text-slate-400">
            O checkout é processado nos links oficiais do EscalePay. Esta tabela está estruturada para sincronização direta via Webhook (payment_pending, payment_approved, payment_refunded) assim que as chaves de API forem vinculadas.
          </p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            Nenhum pedido registrado até o momento.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">ID Transação</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Item Comprado</th>
                  <th className="py-3 px-4">Valor</th>
                  <th className="py-3 px-4">Método</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Alterar Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {orders.map((ord) => {
                  const badge = statusBadges[ord.status] || statusBadges.pending;
                  return (
                    <tr key={ord.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-mono font-semibold text-indigo-400">
                        {ord.external_order_id || ord.id}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-white">{ord.customer_name}</p>
                        <p className="text-[11px] text-slate-500">{ord.customer_email}</p>
                      </td>
                      <td className="py-3 px-4 max-w-[200px] truncate">
                        {ord.product?.name || ord.bundle?.name || 'Material Digital'}
                      </td>
                      <td className="py-3 px-4 font-bold text-white tabular-nums">
                        {ord.amount} {ord.currency}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {ord.payment_method || 'EscalePay'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                          className="bg-slate-950 border border-slate-800 text-[11px] rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="pending">Pendente</option>
                          <option value="paid">Pago (Aprovado)</option>
                          <option value="refunded">Reembolsado</option>
                          <option value="failed">Falhou</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
