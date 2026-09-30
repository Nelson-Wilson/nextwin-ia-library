import React, { useEffect, useState } from 'react';
import { db } from '../../lib/database';
import { Lead } from '../../types';
import { Users, Download, Search, MessageCircle, Mail } from 'lucide-react';

export const AdminLeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    db.getLeads().then((data) => {
      setLeads(data);
      setIsLoading(false);
    });
  }, []);

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.whatsapp && l.whatsapp.includes(searchTerm)) ||
    (l.source && l.source.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportCSV = () => {
    const headers = ['Nome', 'Email', 'WhatsApp', 'Origem', 'Campanha', 'UTM Source', 'UTM Medium', 'Data'];
    const rows = filtered.map(l => [
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.whatsapp || ''}"`,
      `"${l.source || ''}"`,
      `"${l.campaign || ''}"`,
      `"${l.utm_source || ''}"`,
      `"${l.utm_medium || ''}"`,
      `"${l.created_at}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_nextwin_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Leads Capturados</h2>
          <p className="text-xs text-slate-400">Contatos capturados na página /captura e nas campanhas de tráfego.</p>
        </div>

        <button
          onClick={exportCSV}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Planilha CSV ({filtered.length})</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl max-w-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar por nome, email ou canal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            Nenhum lead encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Nome & Contato</th>
                  <th className="py-3 px-4">WhatsApp</th>
                  <th className="py-3 px-4">Origem / Canal</th>
                  <th className="py-3 px-4">Campanha UTM</th>
                  <th className="py-3 px-4">Data Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{l.name}</p>
                      <p className="text-[11px] text-indigo-400">{l.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      {l.whatsapp ? (
                        <a
                          href={`https://wa.me/${l.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-400 hover:underline"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{l.whatsapp}</span>
                        </a>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-950 text-indigo-400 border border-indigo-900">
                        {l.utm_source || l.source || 'Orgânico'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {l.utm_campaign || l.campaign || 'padrão'}
                    </td>
                    <td className="py-3 px-4 text-slate-500 tabular-nums text-[11px]">
                      {new Date(l.created_at).toLocaleString()}
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
