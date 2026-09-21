import { useState, useEffect, useRef } from 'react';
import { 
  ServiceRequest, 
  ActiveScreen, 
  QuoteStatus, 
  QuoteItem, 
  RequestStatus,
  Invoice,
  PaymentStatus,
  ProductItem,
  Project,
  ProjectTimeEntry
} from './types';
import { 
  INITIAL_REQUESTS, 
  INITIAL_INVOICES, 
  INITIAL_PRODUCTS, 
  INITIAL_PROJECTS 
} from './data/mockData';
import { Header } from './components/Header';
import { WalkthroughGuide } from './components/WalkthroughGuide';
import { RequestsScreen } from './components/RequestsScreen';
import { ClientDetailScreen } from './components/ClientDetailScreen';
import { QuoteScreen } from './components/QuoteScreen';
import { NewRequestModal } from './components/NewRequestModal';
import { AutoPlayController } from './components/AutoPlayController';
import { DashboardScreen } from './components/DashboardScreen';
import { InvoicesScreen } from './components/InvoicesScreen';
import { WarehouseScreen } from './components/WarehouseScreen';
import { ProjectsScreen } from './components/ProjectsScreen';
import { CustomConfiguratorModal } from './components/CustomConfiguratorModal';
import { SchemaViewerModal } from './components/SchemaViewerModal';

const STORAGE_KEY_REQUESTS = 'msw_gestionale_demo_requests_v2';
const STORAGE_KEY_INVOICES = 'msw_gestionale_demo_invoices_v2';
const STORAGE_KEY_PRODUCTS = 'msw_gestionale_demo_products_v2';
const STORAGE_KEY_PROJECTS = 'msw_gestionale_demo_projects_v2';

export default function App() {
  // Richieste & CRM
  const [requests, setRequests] = useState<ServiceRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REQUESTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_REQUESTS;
  });

  // Fatture Elettroniche
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INVOICES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_INVOICES;
  });

  // Magazzino & Prodotti
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Commesse & Progetti
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_PROJECTS;
  });

  const [selectedRequestId, setSelectedRequestId] = useState<string>(() => {
    return requests[0]?.id || 'req-001';
  });

  // Inizia dalla Dashboard per dare una visione d'insieme del gestionale
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard');
  const [currentWalkthroughStep, setCurrentWalkthroughStep] = useState<number>(1);
  
  // Modals
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState<boolean>(false);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState<boolean>(false);
  const [isSchemaViewerOpen, setIsSchemaViewerOpen] = useState<boolean>(false);
  const [isAutoFillingModal, setIsAutoFillingModal] = useState<boolean>(false);
  const [autoTypeNoteText, setAutoTypeNoteText] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [triggerAutoPlay, setTriggerAutoPlay] = useState<{ timestamp: number; recordVideo: boolean } | null>(null);

  const [autoPlayState, setAutoPlayState] = useState({
    isPlaying: false,
    isRecordingVideo: false,
    recDuration: 0,
    currentNarrative: '',
    isPaused: false
  });

  const stopSimulationRef = useRef<(() => void) | null>(null);
  const pauseToggleRef = useRef<(() => void) | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
    } catch {}
  }, [requests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(invoices));
    } catch {}
  }, [invoices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch {}
  }, [projects]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const selectedRequest = requests.find((r) => r.id === selectedRequestId) || requests[0] || null;

  // Handlers CRM & Preventivi
  const handleSelectRequest = (req: ServiceRequest) => {
    setSelectedRequestId(req.id);
  };

  const handleOpenClientCard = (req: ServiceRequest) => {
    setSelectedRequestId(req.id);
    setActiveScreen('client_card');
    if (currentWalkthroughStep === 1) {
      setCurrentWalkthroughStep(2);
    }
  };

  const handleOpenQuote = (req: ServiceRequest) => {
    setSelectedRequestId(req.id);
    setActiveScreen('quote');
    if (currentWalkthroughStep <= 2) {
      setCurrentWalkthroughStep(3);
    }
  };

  const handleCreateNewRequest = (newRequest: ServiceRequest) => {
    setRequests([newRequest, ...requests]);
    setSelectedRequestId(newRequest.id);
    setActiveScreen('client_card');
    setCurrentWalkthroughStep(2);
    setIsNewRequestModalOpen(false);
    setIsAutoFillingModal(false);
    showToast(`✓ Richiesta creata per ${newRequest.clientName}! Scheda cliente aperta.`);
  };

  const handleUpdateQuoteStatus = (requestId: string, newStatus: QuoteStatus) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;

        let newReqStatus: RequestStatus = r.status;
        let newNextAction = r.nextAction;

        if (newStatus === 'bozza') {
          newReqStatus = 'preventivo_bozza';
          newNextAction = 'Completare stima voci e inviare preventivo';
        } else if (newStatus === 'inviato') {
          newReqStatus = 'preventivo_inviato';
          newNextAction = 'Follow-up telefonico per verifica ricezione preventivo';
        } else if (newStatus === 'accettato') {
          newReqStatus = 'accettato';
          newNextAction = 'Preparazione kickoff e avvio sviluppo software';
        }

        const updatedQuote = {
          ...r.quote,
          status: newStatus
        };

        const statusNote = {
          id: `note-${Date.now()}`,
          text: `Aggiornamento stato preventivo: ${newStatus.toUpperCase()} da pannello gestionale.`,
          author: 'M Solutions Web - Admin',
          date: 'Oggi, ' + new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
          type: 'sistema' as const
        };

        return {
          ...r,
          status: newReqStatus,
          nextAction: newNextAction,
          quote: updatedQuote,
          notes: [statusNote, ...r.notes]
        };
      })
    );

    setCurrentWalkthroughStep(4);
    showToast(`✓ Stato preventivo aggiornato a "${newStatus.toUpperCase()}"!`);
  };

  const handleUpdateQuoteItems = (requestId: string, newItems: QuoteItem[]) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        return {
          ...r,
          quote: {
            ...r.quote,
            items: newItems
          }
        };
      })
    );
    showToast('✓ Voci preventivo aggiornate');
  };

  const handleAddNote = (requestId: string, text: string) => {
    const newNote = {
      id: `note-${Date.now()}`,
      text,
      author: 'Marco Cerilli - M Solutions Web',
      date: 'Oggi, ' + new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      type: 'briefing' as const
    };

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        return {
          ...r,
          notes: [newNote, ...r.notes]
        };
      })
    );
    showToast('✓ Nuova nota aggiunta al briefing!');
  };

  const handleUpdateNextAction = (requestId: string, nextAction: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        return {
          ...r,
          nextAction
        };
      })
    );
    showToast('✓ Prossima azione aggiornata');
  };

  // Handlers Fatturazione
  const handleAddInvoice = (newInvoice: Invoice) => {
    setInvoices([newInvoice, ...invoices]);
  };

  const handleUpdateInvoiceStatus = (id: string, paymentStatus: PaymentStatus) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, paymentStatus } : inv));
  };

  // Handlers Magazzino
  const handleAddProduct = (newProduct: ProductItem) => {
    setProducts([newProduct, ...products]);
  };

  const handleUpdateStock = (id: string, delta: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const newStock = Math.max(0, p.stockQuantity + delta);
      return { ...p, stockQuantity: newStock };
    }));
  };

  // Handlers Commesse
  const handleAddProject = (newProject: Project) => {
    setProjects([newProject, ...projects]);
  };

  const handleLogHours = (projectId: string, entry: ProjectTimeEntry) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const newLogged = p.loggedHours + entry.hours;
      const recent = [entry, ...(p.recentLogs || [])];
      return {
        ...p,
        loggedHours: newLogged,
        recentLogs: recent
      };
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* 1. Walkthrough & Autoplay bar per demo e video recording */}
      <WalkthroughGuide
        isPlaying={autoPlayState.isPlaying}
        isRecordingVideo={autoPlayState.isRecordingVideo}
        recDuration={autoPlayState.recDuration}
        currentNarrative={autoPlayState.currentNarrative}
        isPaused={autoPlayState.isPaused}
        onStartAutoPlay={(recordVideo) => setTriggerAutoPlay({ timestamp: Date.now(), recordVideo })}
        onPauseToggle={() => pauseToggleRef.current?.()}
        onStop={() => stopSimulationRef.current?.()}
      />

      {/* Auto-Play Automation Controller */}
      <AutoPlayController
        requests={requests}
        triggerAutoPlay={triggerAutoPlay}
        onStateUpdate={setAutoPlayState}
        onStopSimulationRef={stopSimulationRef}
        onPauseToggleRef={pauseToggleRef}
        onStartNewRequestWithAutoFill={() => {
          setActiveScreen('requests');
          setCurrentWalkthroughStep(1);
          setIsAutoFillingModal(true);
          setIsNewRequestModalOpen(true);
        }}
        onTriggerAutoTypeNote={(noteText) => {
          setAutoTypeNoteText(noteText);
        }}
        onOpenQuote={(req) => {
          handleOpenQuote(req);
        }}
        onUpdateQuoteStatus={handleUpdateQuoteStatus}
      />

      {/* 2. Main Navigation Header con tutti i moduli */}
      <Header
        activeScreen={activeScreen}
        onNavigate={(screen) => setActiveScreen(screen)}
        selectedRequest={selectedRequest}
        requestsCount={requests.length}
        invoicesCount={invoices.length}
        projectsCount={projects.length}
        onOpenNewRequest={() => {
          setIsAutoFillingModal(false);
          setIsNewRequestModalOpen(true);
        }}
        onOpenConfigurator={() => setIsConfiguratorOpen(true)}
        onOpenSchemaViewer={() => setIsSchemaViewerOpen(true)}
      />

      {/* 3. Schermata Attiva */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Schermata 0: Dashboard Direzionale */}
        {activeScreen === 'dashboard' && (
          <DashboardScreen
            requests={requests}
            invoices={invoices}
            products={products}
            projects={projects}
            onNavigate={(screen) => setActiveScreen(screen)}
            onOpenConfigurator={() => setIsConfiguratorOpen(true)}
            onOpenSchemaViewer={() => setIsSchemaViewerOpen(true)}
            onSelectRequest={(id) => setSelectedRequestId(id)}
          />
        )}

        {/* Schermata 1: CRM & Richieste */}
        {activeScreen === 'requests' && (
          <RequestsScreen
            requests={requests}
            onSelectRequest={handleSelectRequest}
            onOpenClientCard={handleOpenClientCard}
            onOpenQuote={handleOpenQuote}
            onOpenNewRequest={() => {
              setIsAutoFillingModal(false);
              setIsNewRequestModalOpen(true);
            }}
            selectedRequestId={selectedRequestId}
          />
        )}

        {/* Schermata 2: Scheda Cliente 360° */}
        {activeScreen === 'client_card' && selectedRequest && (
          <ClientDetailScreen
            request={selectedRequest}
            allRequests={requests}
            onSelectAnotherRequest={(req) => setSelectedRequestId(req.id)}
            onBackToRequests={() => setActiveScreen('requests')}
            onProceedToQuote={(req) => {
              handleOpenQuote(req);
              setCurrentWalkthroughStep(3);
            }}
            onAddNote={handleAddNote}
            onUpdateStatus={(reqId, status) => {
              setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status } : r));
            }}
            onUpdateNextAction={handleUpdateNextAction}
            autoTypeNoteText={autoTypeNoteText}
            onAutoNoteComplete={() => setAutoTypeNoteText(null)}
          />
        )}

        {/* Schermata 3: Preventivatore CPQ */}
        {activeScreen === 'quote' && selectedRequest && (
          <QuoteScreen
            request={selectedRequest}
            allRequests={requests}
            onSelectAnotherRequest={(req) => setSelectedRequestId(req.id)}
            onBackToClientCard={() => setActiveScreen('client_card')}
            onBackToRequests={() => setActiveScreen('requests')}
            onUpdateQuoteStatus={handleUpdateQuoteStatus}
            onUpdateQuoteItems={handleUpdateQuoteItems}
          />
        )}

        {/* Schermata 4: Fatturazione Elettronica & SDI */}
        {activeScreen === 'invoices' && (
          <InvoicesScreen
            invoices={invoices}
            onAddInvoice={handleAddInvoice}
            onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
            onShowToast={showToast}
          />
        )}

        {/* Schermata 5: Magazzino & Catalogo WMS */}
        {activeScreen === 'warehouse' && (
          <WarehouseScreen
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateStock={handleUpdateStock}
            onShowToast={showToast}
          />
        )}

        {/* Schermata 6: Commesse & SAL */}
        {activeScreen === 'projects' && (
          <ProjectsScreen
            projects={projects}
            onAddProject={handleAddProject}
            onLogHours={handleLogHours}
            onShowToast={showToast}
          />
        )}

      </main>

      {/* Modal: Nuova Richiesta */}
      <NewRequestModal
        isOpen={isNewRequestModalOpen}
        onClose={() => {
          setIsNewRequestModalOpen(false);
          setIsAutoFillingModal(false);
        }}
        onSubmit={(newReq) => {
          setIsNewRequestModalOpen(false);
          setIsAutoFillingModal(false);
          handleCreateNewRequest(newReq);
        }}
        isAutoFilling={isAutoFillingModal}
      />

      {/* Modal: Configuratore Gestionale su Misura */}
      <CustomConfiguratorModal
        isOpen={isConfiguratorOpen}
        onClose={() => setIsConfiguratorOpen(false)}
        onShowToast={showToast}
      />

      {/* Modal: Ispezione Schema DB Drizzle & PostgreSQL */}
      <SchemaViewerModal
        isOpen={isSchemaViewerOpen}
        onClose={() => setIsSchemaViewerOpen(false)}
        onShowToast={showToast}
      />

      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 <strong>M Solutions Web</strong> • Software House & Soluzioni Digitali Sartoriali
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSchemaViewerOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              Architettura Next.js & Drizzle
            </button>
            <span>•</span>
            <button
              onClick={() => setIsConfiguratorOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              Richiedi Software su Misura
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
