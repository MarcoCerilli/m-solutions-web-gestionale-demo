import { useState } from 'react';
import { 
  Search, 
  Plus, 
  ArrowRight, 
  Calendar, 
  FileText, 
  Sparkles,
  Phone,
  Mail,
  User,
  Clock
} from 'lucide-react';
import { ServiceRequest, RequestStatus } from '../types';
import { getRequestStatusConfig, formatCurrency } from '../utils/formatters';

interface RequestsScreenProps {
  requests: ServiceRequest[];
  onSelectRequest: (request: ServiceRequest) => void;
  onOpenClientCard: (request: ServiceRequest) => void;
  onOpenQuote: (request: ServiceRequest) => void;
  onOpenNewRequest: () => void;
  selectedRequestId?: string;
}

export function RequestsScreen({
  requests,
  onSelectRequest,
  onOpenClientCard,
  onOpenQuote,
  onOpenNewRequest,
  selectedRequestId
}: RequestsScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = 
      req.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.serviceRequested.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.nextAction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.contacts.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate quick stats for M Solutions Web overview
  const totalRequests = requests.length;
  const newRequests = requests.filter(r => r.status === 'nuova').length;
  const quotesInProgress = requests.filter(r => r.status === 'preventivo_bozza' || r.status === 'preventivo_inviato').length;
  const acceptedRequests = requests.filter(r => r.status === 'accettato').length;

  return (
    <div id="screen-requests" className="space-y-6">
      
      {/* Top Section: Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
              Schermata 1 • M Solutions Web
            </span>
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Demo dimostrativa
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Gestione Richieste & Pipeline Clienti
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitora le nuove richieste in ingresso, lo stato di avanzamento e la prossima azione operativa.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-add-request-hero"
            onClick={onOpenNewRequest}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nuova Richiesta</span>
          </button>
        </div>
      </div>

      {/* Metric Cards (KPI Pipeline) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Totale Richieste</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalRequests}</div>
          <span className="text-[11px] text-slate-400">Database gestionale</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            Nuove da Gestire
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{newRequests}</div>
          <span className="text-[11px] text-slate-500">Richiedono contatto iniziale</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Preventivi in Corso
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{quotesInProgress}</div>
          <span className="text-[11px] text-slate-500">Bozza o inviati al cliente</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Accettati & Conclusi
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{acceptedRequests}</div>
          <span className="text-[11px] text-slate-500">Pronti per avvio sviluppo</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="search-requests-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cerca cliente, servizio, azione..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-hidden bg-slate-50/70 text-slate-900"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Tutte' },
            { id: 'nuova', label: 'Nuove' },
            { id: 'preventivo_bozza', label: 'Bozza Preventivo' },
            { id: 'preventivo_inviato', label: 'Preventivo Inviato' },
            { id: 'accettato', label: 'Accettate' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table: Richieste (Nome cliente, servizio richiesto, stato e prossima azione) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-900 text-base">
              Elenco Richieste Attive
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              ({filteredRequests.length} di {requests.length})
            </span>
          </div>
          <div className="text-xs text-slate-400">
            Fai clic su una riga per aprire la scheda cliente o il preventivo
          </div>
        </div>

        <div className="overflow-x-auto">
          <table id="requests-main-table" className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Nome Cliente</th>
                <th className="py-3 px-4">Servizio Richiesto</th>
                <th className="py-3 px-4">Stato</th>
                <th className="py-3 px-4">Prossima Azione</th>
                <th className="py-3 px-4 text-right">Azioni Rapide</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRequests.map((req) => {
                const statusCfg = getRequestStatusConfig(req.status);
                const isSelected = selectedRequestId === req.id;

                return (
                  <tr
                    key={req.id}
                    id={`request-row-${req.id}`}
                    onClick={() => onSelectRequest(req)}
                    className={`cursor-pointer transition-colors group ${
                      isSelected 
                        ? 'bg-slate-100/90' 
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* 1. Nome Cliente */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-slate-950 transition-colors flex items-center gap-2">
                          <span>{req.clientName}</span>
                          {isSelected && (
                            <span className="text-[10px] bg-slate-900 text-white px-1.5 py-0.2 rounded font-semibold">
                              Selezionato
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            {req.contacts.contactPerson}
                          </span>
                          <span>•</span>
                          <span>{req.contacts.city}</span>
                        </div>
                      </div>
                    </td>

                    {/* 2. Servizio Richiesto */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-slate-900 line-clamp-1">
                        {req.serviceRequested}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-slate-700 font-medium">Cod: {req.code}</span>
                        <span>•</span>
                        <span>Budget: {req.summary.estimatedBudget}</span>
                      </div>
                    </td>

                    {/* 3. Stato */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusCfg.badgeBg} ${statusCfg.badgeText} ${statusCfg.borderColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotColor}`} />
                        {statusCfg.label}
                      </span>
                    </td>

                    {/* 4. Prossima Azione */}
                    <td className="py-3.5 px-4">
                      <div className="p-2 bg-slate-50 group-hover:bg-white rounded-lg border border-slate-200/80">
                        <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                          <span>{req.nextAction}</span>
                        </div>
                        {req.nextActionDate && (
                          <div className="text-[11px] text-slate-500 mt-0.5 pl-4">
                            Scadenza: {req.nextActionDate}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 5. Azioni Rapide */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Open Scheda */}
                        <button
                          id={`btn-open-card-${req.id}`}
                          onClick={() => onOpenClientCard(req)}
                          title="Apri Scheda Cliente (Step 2)"
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors"
                        >
                          <span>Scheda</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        {/* Open Preventivo */}
                        <button
                          id={`btn-open-quote-${req.id}`}
                          onClick={() => onOpenQuote(req)}
                          title="Apri Preventivo (Step 3 & 4)"
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-600" />
                          <span>Preventivo</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredRequests.length === 0 && (
          <div className="p-10 text-center text-slate-500">
            <p className="font-semibold text-base">Nessuna richiesta trovata per i criteri selezionati.</p>
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
              className="mt-2 text-xs font-semibold text-slate-900 hover:underline"
            >
              Reimposta filtri
            </button>
          </div>
        )}

      </div>

      {/* Recording Workflow Banner at Bottom */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700">
            <Sparkles className="w-4 h-4 text-slate-300" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Suggerimento per il video
            </div>
            <div className="text-sm font-medium text-slate-200">
              Seleziona un cliente (es. <span className="font-bold text-white">Ristorante BellaVista</span>) o clicca su <span className="underline decoration-slate-500 font-semibold">"Nuova Richiesta"</span> per registrare il flusso completo.
            </div>
          </div>
        </div>
        <button
          onClick={onOpenNewRequest}
          className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-semibold whitespace-nowrap shadow-xs transition-colors"
        >
          Avvia con Nuova Richiesta →
        </button>
      </div>

    </div>
  );
}
