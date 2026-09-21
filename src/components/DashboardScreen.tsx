import React from 'react';
import { 
  TrendingUp, 
  Euro, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Briefcase, 
  Package, 
  ArrowUpRight, 
  Sparkles, 
  Database, 
  Calendar,
  Building2,
  ChevronRight
} from 'lucide-react';
import { ActiveScreen, Invoice, ProductItem, Project, ServiceRequest } from '../types';
import { formatCurrency } from '../utils/formatters';

interface DashboardScreenProps {
  requests: ServiceRequest[];
  invoices: Invoice[];
  products: ProductItem[];
  projects: Project[];
  onNavigate: (screen: ActiveScreen) => void;
  onOpenConfigurator: () => void;
  onOpenSchemaViewer: () => void;
  onSelectRequest: (id: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  requests,
  invoices,
  products,
  projects,
  onNavigate,
  onOpenConfigurator,
  onOpenSchemaViewer,
  onSelectRequest
}) => {
  // Calcoli metriche reali
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const paidInvoices = invoices.filter(inv => inv.paymentStatus === 'pagata');
  const paidAmount = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  
  const pendingInvoices = invoices.filter(inv => inv.paymentStatus === 'in_scadenza');
  const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  const overdueInvoices = invoices.filter(inv => inv.paymentStatus === 'scaduta');
  const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  const activeProjects = projects.filter(p => p.status === 'in_corso' || p.status === 'in_revisione');
  const lowStockProducts = products.filter(p => p.stockQuantity <= p.minStockAlert);
  
  const acceptedQuotes = requests.filter(r => r.status === 'accettato' || r.status === 'completato');
  const conversionRate = requests.length > 0 
    ? Math.round((acceptedQuotes.length / requests.length) * 100) 
    : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner: Presentazione Gestionale Sartoriale */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-slate-700/60">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Piattaforma Gestionale Enterprise Sartoriale • M Solutions Web</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Panoramica Direzionale & Attività
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Sistema modulare completo: dal primo contatto nel <strong>CRM</strong>, alla <strong>Preventivazione rapida</strong>, 
              fino all'emissione di <strong>Fatture Elettroniche SDI</strong>, controllo <strong>Magazzino</strong> e 
              avanzamento <strong>Commesse</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenConfigurator}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Configura Software su Misura</span>
            </button>
            <button
              onClick={onOpenSchemaViewer}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 active:scale-95 text-slate-200 font-medium text-xs sm:text-sm border border-slate-600/60 transition-all cursor-pointer"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Architettura Drizzle & Postgres</span>
            </button>
          </div>
        </div>

        {/* Background glow deco */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* KPI 1: Fatturato Emesso */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">Fatturato Emesso Q3</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Euro className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalInvoiced)}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Incassati: {formatCurrency(paidAmount)}</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Crediti in Sospeso & Insoluti */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">Scadenziario / Crediti</span>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${overdueAmount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
              {overdueAmount > 0 ? <AlertTriangle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(pendingAmount + overdueAmount)}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-rose-600 font-medium">
              {overdueAmount > 0 ? (
                <span>⚠️ {formatCurrency(overdueAmount)} scaduto ({overdueInvoices.length} fattura)</span>
              ) : (
                <span className="text-emerald-600">Nessun insoluto scaduto</span>
              )}
            </div>
          </div>
        </div>

        {/* KPI 3: Pipeline Trattative & Conversione */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">Pipeline CRM Attiva</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">{requests.length} Opportunità</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-indigo-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tasso di conversione preventivi: {conversionRate}%</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Commesse & Operatività */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">Commesse in Esecuzione</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">{activeProjects.length} Progetti Attivi</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-purple-600 font-medium">
              <span>SAL medio: 48% • Consegne puntuali</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Section: 2 Columns (Commesse & Scadenze a SX, Attività Recenti & Quick Nav a DX) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Colonna Sinistra (2 cols): Commesse in Corso & Scadenziario immediato */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Commesse con SAL (Stato Avanzamento Lavori) */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-base text-slate-900">Commesse & Progetti Attivi</h2>
                <p className="text-xs text-slate-500">Monitoraggio SAL %, budget preventivato vs costi reali</p>
              </div>
              <button 
                onClick={() => onNavigate('projects')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Vedi tutte ({projects.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {projects.map((proj) => (
                <div key={proj.id} className="p-5 hover:bg-slate-50/70 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {proj.code}
                        </span>
                        <h4 className="font-semibold text-sm text-slate-900">{proj.title}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="font-medium text-slate-700">{proj.clientName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Consegna: {proj.deadline}
                        </span>
                      </div>
                    </div>

                    <div className="text-right sm:shrink-0">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        proj.status === 'in_corso' ? 'bg-indigo-50 text-indigo-700' :
                        proj.status === 'in_revisione' ? 'bg-amber-50 text-amber-700' :
                        proj.status === 'completato' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {proj.status === 'in_corso' ? 'In Corso' : 
                         proj.status === 'in_revisione' ? 'In Revisione' : 
                         proj.status === 'completato' ? 'Completato' : 'Pianificato'}
                      </span>
                      <div className="text-xs font-bold text-slate-900 mt-1">
                        {formatCurrency(proj.budgetEstimated)}
                      </div>
                    </div>
                  </div>

                  {/* SAL Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Avanzamento SAL ({proj.salPercentage}%)</span>
                      <span>{proj.loggedHours}h consuntivate / {proj.estimatedHours}h stimate</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          proj.salPercentage >= 80 ? 'bg-emerald-500' :
                          proj.salPercentage >= 40 ? 'bg-indigo-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${proj.salPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scadenziario Pagamenti & Fatture Recenti */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-base text-slate-900">Scadenziario Fatture & Incassi</h2>
                <p className="text-xs text-slate-500">Stato SDI Agenzia Entrate e previsione cassa</p>
              </div>
              <button 
                onClick={() => onNavigate('invoices')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Gestione Fatture ({invoices.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      inv.paymentStatus === 'pagata' ? 'bg-emerald-100 text-emerald-700' :
                      inv.paymentStatus === 'scaduta' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      <Euro className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{inv.number}</span>
                        <span className="text-xs text-slate-500">• {inv.clientName}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span>Scadenza: <strong>{inv.dueDate}</strong></span>
                        <span>•</span>
                        <span className="text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                          SDI: {inv.sdiStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:shrink-0">
                    <div className="font-bold text-sm text-slate-900">{formatCurrency(inv.totalAmount)}</div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold mt-0.5 ${
                      inv.paymentStatus === 'pagata' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      inv.paymentStatus === 'scaduta' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {inv.paymentStatus === 'pagata' ? '✓ Pagata' :
                       inv.paymentStatus === 'scaduta' ? '⚠️ Scaduta' : '⏳ In Scadenza'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Colonna Destra (1 col): Lead Caldi CRM, Alert Magazzino & Vantaggi Software su Misura */}
        <div className="space-y-6">
          
          {/* Card: Opportunità CRM Recenti */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900">Richieste CRM Recenti</h3>
              <button 
                onClick={() => onNavigate('requests')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Vedi Pipeline
              </button>
            </div>
            
            <div className="space-y-3">
              {requests.slice(0, 3).map((req) => (
                <div 
                  key={req.id}
                  onClick={() => {
                    onSelectRequest(req.id);
                    onNavigate('client_card');
                  }}
                  className="p-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {req.clientName}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{req.serviceRequested}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>{req.createdAt}</span>
                    <span className="font-semibold text-slate-700">{req.summary.estimatedBudget}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Allerte Magazzino / Sotto-Scorta */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900">Alert Magazzino & Licenze</h3>
              </div>
              <button 
                onClick={() => onNavigate('warehouse')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Catalogo
              </button>
            </div>

            {lowStockProducts.length > 0 ? (
              <div className="space-y-2.5">
                {lowStockProducts.map((prod) => (
                  <div key={prod.id} className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs">
                    <div className="flex items-center justify-between font-semibold text-amber-900">
                      <span>{prod.name}</span>
                      <span className="text-rose-600 font-bold">Giacenza: {prod.stockQuantity}</span>
                    </div>
                    <div className="flex items-center justify-between text-amber-700 text-[11px] mt-1">
                      <span className="font-mono">{prod.sku}</span>
                      <span>Soglia min: {prod.minStockAlert} {prod.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-2">Tutte le scorte e licenze sono a livello ottimale.</p>
            )}
          </div>

          {/* Banner Promozionale M Solutions Web: "Perché il software su misura" */}
          <div className="rounded-xl bg-linear-to-br from-indigo-900 to-slate-900 p-5 text-white shadow-md border border-indigo-800/50">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-3">
              <Building2 className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-white">Pronto per i Tuoi Clienti</h4>
            <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
              Questo gestionale è sviluppato da <strong>M Solutions Web</strong> come architettura base 
              cucita sulle esigenze specifiche di ogni azienda: niente licenze mensili per utente, 
              controllo totale del codice e prestazioni istantanee con Next.js e PostgreSQL.
            </p>
            <button
              onClick={onOpenConfigurator}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/20"
            >
              <span>Configura la soluzione ideale</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
