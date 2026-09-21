import React from 'react';
import { 
  LayoutDashboard, 
  LayoutGrid, 
  UserCheck, 
  FileText, 
  Plus, 
  Euro, 
  Package, 
  Briefcase, 
  Sparkles, 
  Database 
} from 'lucide-react';
import { ActiveScreen, ServiceRequest } from '../types';

interface HeaderProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  selectedRequest: ServiceRequest | null;
  requestsCount: number;
  invoicesCount?: number;
  projectsCount?: number;
  onOpenNewRequest: () => void;
  onOpenConfigurator?: () => void;
  onOpenSchemaViewer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  onNavigate,
  selectedRequest,
  requestsCount,
  invoicesCount = 4,
  projectsCount = 3,
  onOpenNewRequest,
  onOpenConfigurator,
  onOpenSchemaViewer
}) => {
  return (
    <header id="app-main-header" className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Row: Brand, Actions & CTA */}
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center gap-3 shrink-0 cursor-pointer select-none" 
            onClick={() => onNavigate('dashboard')}
          >
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-lg shadow-xs ring-1 ring-slate-800">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900">
                  M Solutions <span className="font-semibold text-slate-600">Web</span>
                </span>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-indigo-200">
                  Suite Demo
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Software Gestionale Modulare su Misura
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {onOpenSchemaViewer && (
              <button
                onClick={onOpenSchemaViewer}
                title="Visualizza schema Drizzle ORM e PostgreSQL"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Schema DB</span>
              </button>
            )}

            {onOpenConfigurator && (
              <button
                onClick={onOpenConfigurator}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-95 text-white shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                <span>Configura su Misura</span>
              </button>
            )}

            <button
              id="header-new-request-btn"
              onClick={onOpenNewRequest}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 active:scale-95 text-white shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuovo Lead</span>
            </button>
          </div>

        </div>

        {/* Navigation Tabs Bar (Scrollable horizontally) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 -mt-1 pt-1 no-scrollbar border-t border-slate-100">
          
          {/* 0. Dashboard */}
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeScreen === 'dashboard'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          {/* 1. CRM / Richieste */}
          <button
            id="nav-tab-requests"
            onClick={() => onNavigate('requests')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeScreen === 'requests'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>1. CRM & Lead</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeScreen === 'requests' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {requestsCount}
            </span>
          </button>

          {/* 2. Scheda Cliente */}
          <button
            id="nav-tab-client-card"
            onClick={() => onNavigate('client_card')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeScreen === 'client_card'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>2. Scheda Cliente</span>
            {selectedRequest && (
              <span className={`text-[10px] font-normal truncate max-w-25 ${
                activeScreen === 'client_card' ? 'text-slate-300' : 'text-slate-400'
              }`}>
                ({selectedRequest.clientName.split(' ')[0]})
              </span>
            )}
          </button>

          {/* 3. Preventivi */}
          <button
            id="nav-tab-quote"
            onClick={() => onNavigate('quote')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeScreen === 'quote'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>3. Preventivo</span>
            {selectedRequest && (
              <span className={`text-[10px] font-bold uppercase px-1 rounded ${
                activeScreen === 'quote' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {selectedRequest.quote.status}
              </span>
            )}
          </button>

          {/* 4. Fatturazione & SDI */}
          <button
            onClick={() => onNavigate('invoices')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeScreen === 'invoices'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Euro className="w-3.5 h-3.5" />
            <span>4. Fatture & SDI</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeScreen === 'invoices' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {invoicesCount}
            </span>
          </button>

          {/* 5. Magazzino & Catalogo */}
          <button
            onClick={() => onNavigate('warehouse')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeScreen === 'warehouse'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>5. Magazzino & WMS</span>
          </button>

          {/* 6. Commesse & SAL */}
          <button
            onClick={() => onNavigate('projects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeScreen === 'projects'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>6. Commesse & SAL</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeScreen === 'projects' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {projectsCount}
            </span>
          </button>

        </div>

      </div>
    </header>
  );
};
