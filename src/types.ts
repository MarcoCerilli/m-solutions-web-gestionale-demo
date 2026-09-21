export type RequestStatus = 
  | 'nuova' 
  | 'in_valutazione' 
  | 'preventivo_bozza' 
  | 'preventivo_inviato' 
  | 'accettato' 
  | 'completato';

export type QuoteStatus = 'bozza' | 'inviato' | 'accettato' | 'rifiutato';

export interface Note {
  id: string;
  text: string;
  author: string;
  date: string;
  type?: 'briefing' | 'telefonata' | 'aggiornamento' | 'sistema';
}

export interface QuoteItem {
  id: string;
  description: string;
  category?: string;
  quantity: number;
  unitPrice: number;
  vatRate: number; // e.g. 22
}

export interface Quote {
  id: string;
  number: string;
  date: string;
  validUntil: string;
  status: QuoteStatus;
  items: QuoteItem[];
  paymentTerms: string;
  deliveryTime: string;
  notes?: string;
}

export interface ClientContact {
  contactPerson: string;
  role?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  vatNumber: string; // P.IVA / CF
  sdiCode?: string; // Codice Univoco SDI (7 caratteri)
  pec?: string;
  website?: string;
}

export interface RequestSummary {
  description: string;
  channel: string; // 'Sito web', 'Referral', 'Email diretta', 'LinkedIn'
  estimatedBudget: string;
  urgency: 'Alta' | 'Media' | 'Pianificata';
  targetDate: string;
  featuresNeeded: string[];
}

export interface ServiceRequest {
  id: string;
  code: string;
  clientName: string;
  serviceRequested: string;
  status: RequestStatus;
  nextAction: string;
  nextActionDate?: string;
  createdAt: string;
  contacts: ClientContact;
  notes: Note[];
  summary: RequestSummary;
  quote: Quote;
}

// -------------------------------------------------------------
// Modulo Fatturazione & Scadenziario
// -------------------------------------------------------------
export type SdiStatus = 'bozza' | 'inviata_sdi' | 'consegnata_sdi' | 'scartata_sdi';
export type PaymentStatus = 'pagata' | 'in_scadenza' | 'scaduta' | 'stornata';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  total: number;
}

export interface Invoice {
  id: string;
  number: string; // es: FATT-2026/048
  date: string;
  dueDate: string;
  clientName: string;
  clientVat: string;
  clientSdi: string;
  clientPec?: string;
  sdiStatus: SdiStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'Bonifico 30 gg d.f.f.m.' | 'Bonifico a Vista' | 'RiBa 60 gg' | 'Carta / Stripe';
  items: InvoiceItem[];
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  notes?: string;
  paidDate?: string;
}

// -------------------------------------------------------------
// Modulo Magazzino & Catalogo Servizi / Prodotti (WMS Light)
// -------------------------------------------------------------
export type ProductType = 'servizio' | 'prodotto_fisico' | 'licenza_software';

export interface ProductItem {
  id: string;
  sku: string; // Codice articolo es. MSW-SRV-01
  name: string;
  category: 'Sviluppo Web' | 'Design & UX' | 'Marketing & SEO' | 'Hardware & Server' | 'Consulenza';
  type: ProductType;
  unit: 'ore' | 'pz' | 'mese' | 'forfait';
  costPrice: number; // Prezzo di costo interno
  sellingPrice: number; // Prezzo di listino cliente
  stockQuantity: number; // Giacenza attuale
  minStockAlert: number; // Livello di riordino / allarme
  description: string;
}

// -------------------------------------------------------------
// Modulo Commesse & Project Management
// -------------------------------------------------------------
export type ProjectStatus = 'pianificato' | 'in_corso' | 'in_revisione' | 'completato' | 'in_pausa';

export interface ProjectTimeEntry {
  id: string;
  date: string;
  author: string;
  hours: number;
  description: string;
}

export interface Project {
  id: string;
  code: string; // es: COMM-2026-012
  title: string;
  clientName: string;
  status: ProjectStatus;
  salPercentage: number; // Stato Avanzamento Lavori %
  budgetEstimated: number; // Budget concordato (€)
  costActual: number; // Costo sostenuto finora (€)
  estimatedHours: number;
  loggedHours: number;
  startDate: string;
  deadline: string;
  team: string[];
  description: string;
  recentLogs?: ProjectTimeEntry[];
}

// -------------------------------------------------------------
// KPI Dashboard
// -------------------------------------------------------------
export interface DashboardStats {
  monthlyRevenue: number;
  yearlyRevenue: number;
  openCredits: number;
  overdueCredits: number;
  activeRequestsCount: number;
  conversionRate: number;
  activeProjectsCount: number;
  avgProfitMargin: number;
}

// -------------------------------------------------------------
// Configuratore "Cucito su Misura" (M Solutions Web)
// -------------------------------------------------------------
export interface ConfigModuleOption {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'Vendite & Clienti' | 'Amministrazione' | 'Operatività' | 'Integrazioni Enterprise';
  defaultSelected: boolean;
  recommendedFor: string;
}

// -------------------------------------------------------------
// Navigazione & Walkthrough
// -------------------------------------------------------------
export type ActiveScreen = 
  | 'dashboard' 
  | 'requests' 
  | 'client_card' 
  | 'quote' 
  | 'invoices' 
  | 'warehouse' 
  | 'projects';

export interface WalkthroughStep {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  actionText: string;
  targetScreen: ActiveScreen;
}
