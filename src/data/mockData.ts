import { ServiceRequest, Invoice, ProductItem, Project, ConfigModuleOption } from '../types';

export const INITIAL_REQUESTS: ServiceRequest[] = [
  {
    id: 'req-001',
    code: 'MSW-2026-081',
    clientName: 'Ristorante BellaVista Srl',
    serviceRequested: 'Sviluppo Sito Web E-commerce & Prenotazione Tavoli',
    status: 'preventivo_bozza',
    nextAction: 'Finalizzare stima voci e inviare proposta al cliente',
    nextActionDate: 'Oggi, entro le 18:00',
    createdAt: '2026-09-18',
    contacts: {
      contactPerson: 'Marco Bellini',
      role: 'Titolare & General Manager',
      email: 'm.bellini@ristorantebellavista.it',
      phone: '+39 02 8945 1200',
      address: 'Via Panoramica, 42',
      city: 'Milano (MI)',
      vatNumber: 'IT09823410156',
      website: 'www.ristorantebellavista.it'
    },
    notes: [
      {
        id: 'note-1',
        text: 'Primo contatto ricevuto dal form web di M Solutions Web. Il cliente vuole rinnovare il vecchio sito fermo al 2018.',
        author: 'Laura - Sales Team',
        date: '18 Set 2026, 10:15',
        type: 'briefing'
      },
      {
        id: 'note-2',
        text: 'Call esplorativa completata (30 min). Richiesto modulo e-commerce per vendita buoni regalo e degustazioni, più sistema di prenotazione integrato.',
        author: 'Matteo - Project Lead',
        date: '18 Set 2026, 15:30',
        type: 'telefonata'
      },
      {
        id: 'note-3',
        text: 'Condiviso link al figma dei competitor di riferimento. Budget confermato nel range 3.000€ - 4.500€.',
        author: 'Matteo - Project Lead',
        date: '19 Set 2026, 09:40',
        type: 'aggiornamento'
      }
    ],
    summary: {
      description: 'Creazione nuovo portale web responsive ad alte prestazioni con catalogo degustazioni, checkout rapido Stripe/PayPal e widget interattivo per la riserva tavoli in tempo reale collegato a WhatsApp aziendale.',
      channel: 'Form Sito Web (m-solutions-web.it)',
      estimatedBudget: '€ 3.500 - € 4.200',
      urgency: 'Alta',
      targetDate: '31 Ottobre 2026',
      featuresNeeded: [
        'Design UI/UX personalizzato mobile-first',
        'Sistema di prenotazione tavoli con notifica automatica',
        'Sezione E-commerce voucher & gift card',
        'Ottimizzazione SEO locale per posizionamento Google Maps',
        'Pannello di controllo admin semplice per aggiornare menù'
      ]
    },
    quote: {
      id: 'q-001',
      number: 'PREV-2026/142',
      date: '2026-09-19',
      validUntil: '2026-10-19',
      status: 'bozza',
      paymentTerms: '40% acconto all\'avvio, 30% consegna beta, 30% al collaudo online',
      deliveryTime: '25 giorni lavorativi dall\'approvazione',
      notes: 'Include 12 mesi di hosting professionale M Solutions Web con certificato SSL e backup giornalieri.',
      items: [
        {
          id: 'qi-1',
          description: 'Progettazione Architettura Informativa e UI/UX Mockup interattivi Figma (Desktop + Mobile)',
          category: 'Design & UX',
          quantity: 1,
          unitPrice: 850,
          vatRate: 22
        },
        {
          id: 'qi-2',
          description: 'Sviluppo Frontend Responsive ad altissima velocità (Next.js / Tailwind CSS)',
          category: 'Sviluppo Web',
          quantity: 1,
          unitPrice: 1400,
          vatRate: 22
        },
        {
          id: 'qi-3',
          description: 'Integrazione Modulo E-commerce Voucher Regalo con gateway di pagamento Stripe',
          category: 'E-commerce',
          quantity: 1,
          unitPrice: 650,
          vatRate: 22
        },
        {
          id: 'qi-4',
          description: 'Configurazione Sistema Booking Tavoli con notifiche email/WhatsApp automatiche',
          category: 'Funzionalità',
          quantity: 1,
          unitPrice: 500,
          vatRate: 22
        },
        {
          id: 'qi-5',
          description: 'Pacchetto Setup SEO Tecnico, Google Search Console e Scheda Google Business Profile',
          category: 'Marketing & SEO',
          quantity: 1,
          unitPrice: 400,
          vatRate: 22
        }
      ]
    }
  },
  {
    id: 'req-002',
    code: 'MSW-2026-080',
    clientName: 'Studio Legale Ferrara & Partners',
    serviceRequested: 'Restyling Portale Istituzionale & Area Riservata Clienti',
    status: 'preventivo_inviato',
    nextAction: 'Richiamare l\'avvocato Ferrara per feedback sulla proposta economica',
    nextActionDate: 'Domani, ore 11:30',
    createdAt: '2026-09-16',
    contacts: {
      contactPerson: 'Avv. Elena Ferrara',
      role: 'Socio Fondatore',
      email: 'e.ferrara@ferraralaw.com',
      phone: '+39 06 6789 3321',
      address: 'Piazza Cavour, 15',
      city: 'Roma (RM)',
      vatNumber: 'IT11223344556',
      website: 'www.ferraralaw.com'
    },
    notes: [
      {
        id: 'note-201',
        text: 'Richiesta di restyling per posizionarsi come studio leader nel diritto societario e tributario.',
        author: 'Marco Cerilli - CEO M Solutions Web',
        date: '16 Set 2026, 11:00',
        type: 'briefing'
      },
      {
        id: 'note-202',
        text: 'Inviato preventivo n. PREV-2026/138 via email con allegato piano tecnico e tempi.',
        author: 'Marco Cerilli - CEO M Solutions Web',
        date: '17 Set 2026, 17:15',
        type: 'aggiornamento'
      }
    ],
    summary: {
      description: 'Rifacimento completo dell\'immagine digitale dello studio, con blog giuridico indicizzato, gestione pubblicazioni e area documentale sicura crittografata.',
      channel: 'Passaparola / Referral',
      estimatedBudget: '€ 4.500 - € 6.000',
      urgency: 'Media',
      targetDate: '15 Novembre 2026',
      featuresNeeded: [
        'Design sobrio, elegante e autorevole',
        'Area riservata download pareri protetti con 2FA',
        'Blog integrato con categorie materie legali',
        'Multilingua Italiano / Inglese'
      ]
    },
    quote: {
      id: 'q-002',
      number: 'PREV-2026/138',
      date: '2026-09-17',
      validUntil: '2026-10-17',
      status: 'inviato',
      paymentTerms: '30% alla firma, 40% approvazione prototipo, 30% messa online',
      deliveryTime: '30 giorni lavorativi',
      notes: 'Preventivo valido 30 giorni. Comprende formazione 3 ore per lo staff interno.',
      items: [
        {
          id: 'qi-201',
          description: 'Restyling Identità Visiva Web e Palette Istituzionale Corporate',
          category: 'Brand & Design',
          quantity: 1,
          unitPrice: 950,
          vatRate: 22
        },
        {
          id: 'qi-202',
          description: 'Sviluppo Portale Web Corporate Multilingua (IT/EN) con CMS Headless',
          category: 'Sviluppo Web',
          quantity: 1,
          unitPrice: 2400,
          vatRate: 22
        },
        {
          id: 'qi-203',
          description: 'Modulo Area Riservata Documentale con autenticazione cifrata e tracciamento accessi',
          category: 'Sicurezza & Cloud',
          quantity: 1,
          unitPrice: 1500,
          vatRate: 22
        }
      ]
    }
  },
  {
    id: 'req-003',
    code: 'MSW-2026-079',
    clientName: 'EcoTech Solutions Srl',
    serviceRequested: 'Web App Gestionale Custom per Monitoraggio Impianti IoT',
    status: 'accettato',
    nextAction: 'Schedulazione Sprint 1 e consegna documenti tecnici preliminari',
    nextActionDate: '22 Set 2026',
    createdAt: '2026-09-12',
    contacts: {
      contactPerson: 'Ing. Davide Rossi',
      role: 'Chief Technology Officer',
      email: 'd.rossi@ecotech-solutions.it',
      phone: '+39 011 5543 890',
      address: 'Corso Francia, 120',
      city: 'Torino (TO)',
      vatNumber: 'IT07896540012',
      website: 'www.ecotech-solutions.it'
    },
    notes: [
      {
        id: 'note-301',
        text: 'Il cliente ha confermato e firmato il preventivo PREV-2026/135. Acconto ricevuto.',
        author: 'Amministrazione M Solutions Web',
        date: '18 Set 2026, 14:20',
        type: 'sistema'
      }
    ],
    summary: {
      description: 'Piattaforma SaaS interna per acquisire telemetrie da inverter fotovoltaici e mostrare grafici real-time a clienti industriali.',
      channel: 'LinkedIn Campaign',
      estimatedBudget: '€ 8.000+',
      urgency: 'Alta',
      targetDate: '15 Dicembre 2026',
      featuresNeeded: [
        'Dashboard dati con grafici interattivi e soglie di alert',
        'Integrazione API MQTT / REST con i dispositivi',
        'Gestione ruoli (Admin, Tecnico, Cliente finale)'
      ]
    },
    quote: {
      id: 'q-003',
      number: 'PREV-2026/135',
      date: '2026-09-14',
      validUntil: '2026-10-14',
      status: 'accettato',
      paymentTerms: '40% acconto, 30% milestone test API, 30% collaudo finale',
      deliveryTime: '60 giorni lavorativi',
      notes: 'Preventivo accettato in data 18/09/2026 con ordine formale.',
      items: [
        {
          id: 'qi-301',
          description: 'Sviluppo Backend API ad alta scalabilità e database relazionale time-series',
          category: 'Backend',
          quantity: 1,
          unitPrice: 3800,
          vatRate: 22
        },
        {
          id: 'qi-302',
          description: 'Dashboard Web App React con grafici live e visualizzazioni metriche energetiche',
          category: 'Frontend Web App',
          quantity: 1,
          unitPrice: 3400,
          vatRate: 22
        },
        {
          id: 'qi-303',
          description: 'Servizio di configurazione infrastruttura Cloud ad alta affidabilità con SLA 99.9%',
          category: 'DevOps & Cloud',
          quantity: 1,
          unitPrice: 1200,
          vatRate: 22
        }
      ]
    }
  },
  {
    id: 'req-004',
    code: 'MSW-2026-082',
    clientName: 'Atelier Moda & Seta',
    serviceRequested: 'Landing Page Promo Collezione Autunno & Campagna Lead',
    status: 'nuova',
    nextAction: 'Richiamare cliente per definire data shooting e materiali grafici',
    nextActionDate: 'Oggi, ore 16:30',
    createdAt: '2026-09-19',
    contacts: {
      contactPerson: 'Serena Marchesi',
      role: 'Marketing Director',
      email: 's.marchesi@ateliermodaset.it',
      phone: '+39 055 2341 789',
      address: 'Via Tornabuoni, 18',
      city: 'Firenze (FI)',
      vatNumber: 'IT04455660481',
      website: 'www.ateliermodaset.it'
    },
    notes: [
      {
        id: 'note-401',
        text: 'Richiesta arrivata stamattina da Instagram Ads. Vogliono lanciare la nuova capsule collection entro metà ottobre.',
        author: 'Laura - Sales Team',
        date: '19 Set 2026, 09:10',
        type: 'briefing'
      }
    ],
    summary: {
      description: 'Creazione di una landing page emozionale con video hero background, catalogo lookbook sfogliabile e form di contatto per prenotare appuntamento in boutique.',
      channel: 'Instagram Ads',
      estimatedBudget: '€ 1.800 - € 2.400',
      urgency: 'Alta',
      targetDate: '10 Ottobre 2026',
      featuresNeeded: [
        'Design haute-couture con micro-animazioni fluide',
        'Lookbook digitale interattivo con zoom su dettagli tessuti',
        'Integrazione pixel tracciamento Meta Ads e Google Tag Manager'
      ]
    },
    quote: {
      id: 'q-004',
      number: 'PREV-2026/143',
      date: '2026-09-19',
      validUntil: '2026-10-19',
      status: 'bozza',
      paymentTerms: '50% all\'avvio, 50% alla pubblicazione online',
      deliveryTime: '12 giorni lavorativi',
      notes: 'Possibilità di affiancare gestione campagne pubblicitarie Meta Ads con canone mensile separato.',
      items: [
        {
          id: 'qi-401',
          description: 'Concept Creativo e Copywriting persuasivo per la campagna autunno',
          category: 'Copywriting & Content',
          quantity: 1,
          unitPrice: 500,
          vatRate: 22
        },
        {
          id: 'qi-402',
          description: 'Sviluppo Landing Page ad alta conversione ottimizzata per mobile traffic',
          category: 'Sviluppo Web',
          quantity: 1,
          unitPrice: 1200,
          vatRate: 22
        },
        {
          id: 'qi-403',
          description: 'Setup Tracking Avanzato Conversioni (Meta CAPI, GA4, Hotjar)',
          category: 'Analytics',
          quantity: 1,
          unitPrice: 350,
          vatRate: 22
        }
      ]
    }
  }
];

// Realistic presets ready for "Nuova Richiesta" quick-fill during video demo recordings!
export const DEMO_PRESETS = [
  {
    clientName: 'Ottica Visione Moderna',
    serviceRequested: 'E-commerce B2C Montature e Prenotazione Visite Optometriche',
    contactPerson: 'Dott.ssa Silvia Conti',
    role: 'Titolare',
    email: 'info@visionemoderna.it',
    phone: '+39 051 4567 890',
    address: 'Via dell\'Indipendenza, 77',
    city: 'Bologna (BO)',
    vatNumber: 'IT06543210378',
    channel: 'Sito web',
    estimatedBudget: '€ 3.800',
    urgency: 'Alta' as const,
    targetDate: '30 Novembre 2026',
    description: 'Il cliente desidera lanciare una piattaforma di vendita montature con prova virtuale e modulo di appuntamento per controllo della vista in sede.',
    features: ['Catalogo montature con filtri avanzati', 'Prenotazione slot orario visita', 'Integrazione pagamenti con Klarna e PayPal'],
    items: [
      { description: 'Design UI/UX E-commerce Eyewear con prototipo navigabile', category: 'UI/UX Design', quantity: 1, unitPrice: 900, vatRate: 22 },
      { description: 'Sviluppo Negozio E-commerce con gestione varianti colore e lenti', category: 'Sviluppo E-commerce', quantity: 1, unitPrice: 2200, vatRate: 22 },
      { description: 'Modulo Calendario Appuntamenti Visite con sincronizzazione Google Calendar', category: 'Integrazioni', quantity: 1, unitPrice: 650, vatRate: 22 }
    ]
  },
  {
    clientName: 'Palestra & Fitness Club Olympic',
    serviceRequested: 'Web App Gestionale Abbonamenti e Corsi per Iscritti',
    contactPerson: 'Alessio Neri',
    role: 'Club Director',
    email: 'amministrazione@olympicfitness.it',
    phone: '+39 06 9876 543',
    address: 'Viale Europa, 110',
    city: 'Roma (RM)',
    vatNumber: 'IT08765430589',
    channel: 'Referral',
    estimatedBudget: '€ 4.500',
    urgency: 'Media' as const,
    targetDate: '15 Dicembre 2026',
    description: 'Realizzazione di un\'applicazione web progressiva (PWA) con cui gli iscritti possono prenotare le lezioni di Crossfit/Pilates e rinnovare abbonamenti online.',
    features: ['Area riservata soci con QR Code ingresso', 'Prenotazione lezioni con lista d\'attesa', 'Notifiche push promemoria allenamenti'],
    items: [
      { description: 'Progettazione PWA Mobile-First con dashboard socio', category: 'Design & UX', quantity: 1, unitPrice: 1100, vatRate: 22 },
      { description: 'Sviluppo Modulo Prenotazione Corsi in tempo reale con capienza sale', category: 'Web App', quantity: 1, unitPrice: 2300, vatRate: 22 },
      { description: 'Integrazione Gateway Pagamenti ricorrenti Stripe Billing', category: 'Pagamenti', quantity: 1, unitPrice: 850, vatRate: 22 }
    ]
  }
];

// -------------------------------------------------------------
// FATTURE ELETTRONICHE & SCADENZIARIO (M Solutions Web)
// -------------------------------------------------------------
export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-001',
    number: 'FATT-2026/048',
    date: '2026-09-01',
    dueDate: '2026-09-30',
    clientName: 'Ristorante BellaVista Srl',
    clientVat: 'IT09823410156',
    clientSdi: 'M5UXCR1',
    clientPec: 'bellavistasrl@pec.it',
    sdiStatus: 'consegnata_sdi',
    paymentStatus: 'in_scadenza',
    paymentMethod: 'Bonifico 30 gg d.f.f.m.',
    subtotal: 1800,
    vatAmount: 396,
    totalAmount: 2196,
    notes: 'Acconto 40% per sviluppo nuovo portale web e booking tavoli.',
    items: [
      { id: 'ii-1', description: 'Acconto 40% su Commessa COMM-2026-012 (Sviluppo Portale & Booking)', quantity: 1, unitPrice: 1800, vatRate: 22, total: 1800 }
    ]
  },
  {
    id: 'inv-002',
    number: 'FATT-2026/047',
    date: '2026-08-15',
    dueDate: '2026-09-15',
    paidDate: '2026-09-14',
    clientName: 'Studio Legale Ferrara & Partners',
    clientVat: 'IT11223344556',
    clientSdi: 'SUBM70N',
    clientPec: 'ferrara.law@pec.ordineavvocati.it',
    sdiStatus: 'consegnata_sdi',
    paymentStatus: 'pagata',
    paymentMethod: 'Bonifico a Vista',
    subtotal: 3200,
    vatAmount: 704,
    totalAmount: 3904,
    notes: 'Saldo realizzazione nuova brand identity e portale studio legale.',
    items: [
      { id: 'ii-2', description: 'Restyling completo brand identity, UI/UX e area documentale riservata', quantity: 1, unitPrice: 3200, vatRate: 22, total: 3200 }
    ]
  },
  {
    id: 'inv-003',
    number: 'FATT-2026/046',
    date: '2026-07-20',
    dueDate: '2026-08-31',
    clientName: 'EcoVibe Cosmetics Milano',
    clientVat: 'IT04561230987',
    clientSdi: 'KRRH6B9',
    clientPec: 'ecovibe@legalmail.it',
    sdiStatus: 'consegnata_sdi',
    paymentStatus: 'scaduta',
    paymentMethod: 'RiBa 60 gg',
    subtotal: 2450,
    vatAmount: 539,
    totalAmount: 2989,
    notes: 'Sollecito inviato il 10 Settembre 2026. In attesa di bonifico di rientro.',
    items: [
      { id: 'ii-3', description: 'Setup e gestione campagna advertising Google Ads & Social Meta Q3', quantity: 1, unitPrice: 1650, vatRate: 22, total: 1650 },
      { id: 'ii-4', description: 'Ottimizzazione conversion rate checkout Shopify & bundle gift', quantity: 1, unitPrice: 800, vatRate: 22, total: 800 }
    ]
  },
  {
    id: 'inv-004',
    number: 'FATT-2026/049',
    date: '2026-09-18',
    dueDate: '2026-10-31',
    clientName: 'Manifattura Tessile Veronese SpA',
    clientVat: 'IT07894560231',
    clientSdi: 'W7YVJK9',
    clientPec: 'amministrazione@manifatturaveronese.pec.it',
    sdiStatus: 'inviata_sdi',
    paymentStatus: 'in_scadenza',
    paymentMethod: 'Bonifico 30 gg d.f.f.m.',
    subtotal: 4800,
    vatAmount: 1056,
    totalAmount: 5856,
    notes: 'Prima tranche migrazione gestionale legacy a Next.js / PostgreSQL.',
    items: [
      { id: 'ii-5', description: 'Studio architettura software, data migration da AS400 a Postgres', quantity: 1, unitPrice: 2800, vatRate: 22, total: 2800 },
      { id: 'ii-6', description: 'Sviluppo MVP Dashboard Operativa Produzione & Logistica', quantity: 1, unitPrice: 2000, vatRate: 22, total: 2000 }
    ]
  }
];

// -------------------------------------------------------------
// MAGAZZINO, SERVIZI & LISTINI (WMS Light)
// -------------------------------------------------------------
export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-001',
    sku: 'MSW-DEV-SRV',
    name: 'Sviluppo Frontend Next.js / TypeScript',
    category: 'Sviluppo Web',
    type: 'servizio',
    unit: 'ore',
    costPrice: 35,
    sellingPrice: 75,
    stockQuantity: 180, // ore disponibili/mese
    minStockAlert: 30,
    description: 'Sviluppo ad alte performance con React 19, Next.js App Router, Tailwind CSS.'
  },
  {
    id: 'prod-002',
    sku: 'MSW-UIX-DSN',
    name: 'Progettazione UI/UX & Prototipazione Figma',
    category: 'Design & UX',
    type: 'servizio',
    unit: 'forfait',
    costPrice: 400,
    sellingPrice: 950,
    stockQuantity: 12, // slot progetti
    minStockAlert: 2,
    description: 'Design system personalizzato, user flow, wireframe interattivi e handoff dev.'
  },
  {
    id: 'prod-003',
    sku: 'MSW-DB-PGSQL',
    name: 'Architettura Database PostgreSQL & Drizzle ORM',
    category: 'Sviluppo Web',
    type: 'servizio',
    unit: 'forfait',
    costPrice: 500,
    sellingPrice: 1200,
    stockQuantity: 8,
    minStockAlert: 2,
    description: 'Modellazione relazionale, indicizzazione, migrazioni Drizzle e Server Actions.'
  },
  {
    id: 'prod-004',
    sku: 'MSW-HOST-ENT',
    name: 'Hosting Cloud Enterprise M Solutions Web (12 Mesi)',
    category: 'Hardware & Server',
    type: 'licenza_software',
    unit: 'mese',
    costPrice: 18,
    sellingPrice: 45,
    stockQuantity: 4, // 4 licenze disponibili
    minStockAlert: 5, // Allarme sotto-scorta!
    description: 'Server dedicato VPS su rete europea NVMe, backup giornaliero off-site, SSL e CDN.'
  },
  {
    id: 'prod-005',
    sku: 'MSW-SEO-TECH',
    name: 'Audit SEO Tecnico & Ottimizzazione Core Web Vitals',
    category: 'Marketing & SEO',
    type: 'servizio',
    unit: 'pz',
    costPrice: 250,
    sellingPrice: 650,
    stockQuantity: 15,
    minStockAlert: 3,
    description: 'Analisi Lighthouse 100/100, schema markup JSON-LD, sitemap e indicizzazione.'
  },
  {
    id: 'prod-006',
    sku: 'MSW-API-SDI',
    name: 'Connettore API Fatturazione Elettronica SDI',
    category: 'Sviluppo Web',
    type: 'licenza_software',
    unit: 'pz',
    costPrice: 120,
    sellingPrice: 380,
    stockQuantity: 3, // Allarme sotto-scorta!
    minStockAlert: 5,
    description: 'Modulo integrazione invio/ricezione XML verso Sistema di Interscambio Agenzia Entrate.'
  }
];

// -------------------------------------------------------------
// COMMESSE & PROJECT MANAGEMENT
// -------------------------------------------------------------
export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    code: 'COMM-2026-012',
    title: 'Piattaforma E-commerce & Prenotazione Tavoli',
    clientName: 'Ristorante BellaVista Srl',
    status: 'in_corso',
    salPercentage: 45,
    budgetEstimated: 3800,
    costActual: 1580,
    estimatedHours: 52,
    loggedHours: 24,
    startDate: '2026-09-20',
    deadline: '2026-10-31',
    team: ['Marco Cerilli (Lead)', 'Davide (Frontend)', 'Sara (UI/UX)'],
    description: 'Rifacimento completo presenza digitale, catalogo voucher regalo Stripe e booking tavoli interattivo.',
    recentLogs: [
      { id: 'tl-1', date: '2026-09-21', author: 'Sara', hours: 4.5, description: 'Finalizzazione schermate menù e booking mobile' },
      { id: 'tl-2', date: '2026-09-20', author: 'Davide', hours: 6, description: 'Setup Next.js 15, componenti UI e Drizzle ORM schema' }
    ]
  },
  {
    id: 'proj-002',
    code: 'COMM-2026-010',
    title: 'Portale Istituzionale & Area Riservata Giuridica',
    clientName: 'Studio Legale Ferrara & Partners',
    status: 'in_revisione',
    salPercentage: 90,
    budgetEstimated: 5200,
    costActual: 4100,
    estimatedHours: 70,
    loggedHours: 64,
    startDate: '2026-08-10',
    deadline: '2026-09-28',
    team: ['Marco Cerilli (Lead)', 'Davide (Fullstack)'],
    description: 'Nuovo sito web con blog categorizzato per aree del diritto e repository pareri protetto con 2FA.',
    recentLogs: [
      { id: 'tl-3', date: '2026-09-18', author: 'Marco Cerilli', hours: 3, description: 'Test di sicurezza autenticazione e caricamento documenti' }
    ]
  },
  {
    id: 'proj-003',
    code: 'COMM-2026-014',
    title: 'Software Gestionale Produzione & Tracciabilità',
    clientName: 'Manifattura Tessile Veronese SpA',
    status: 'pianificato',
    salPercentage: 10,
    budgetEstimated: 12500,
    costActual: 1100,
    estimatedHours: 160,
    loggedHours: 15,
    startDate: '2026-09-15',
    deadline: '2026-12-15',
    team: ['Marco Cerilli (Lead Architect)', 'Davide (Backend)', 'Luca (Data Specialist)'],
    description: 'Modernizzazione da vecchio AS400 a web app Next.js / PostgreSQL per gestione avanzamento telai e rotoli.',
    recentLogs: [
      { id: 'tl-4', date: '2026-09-17', author: 'Luca', hours: 7.5, description: 'Estrazione dump schema AS400 e mappatura tabelle PostgreSQL' }
    ]
  }
];

// -------------------------------------------------------------
// OPZIONI DEL CONFIGURATORE "CUCITO SU MISURA" (M Solutions Web)
// -------------------------------------------------------------
export const CONFIG_MODULES: ConfigModuleOption[] = [
  {
    id: 'crm_leads',
    name: 'CRM & Pipeline Trattative',
    tagline: 'Gestisci lead, trattative e contatti commerciali con vista Kanban',
    description: 'Monitora ogni contatto dal primo messaggio alla firma, con timeline telefonate, note e notifiche promemoria.',
    category: 'Vendite & Clienti',
    defaultSelected: true,
    recommendedFor: 'Tutte le aziende che vogliono aumentare le vendite'
  },
  {
    id: 'cpq_quotes',
    name: 'Preventivatore CPQ & Firme Digitali',
    tagline: 'Crea preventivi professionali in 2 minuti con calcolo IVA e scorporo',
    description: 'Listini articoli personalizzati, generazione PDF con logo aziendale e link per accettazione con firma digitale.',
    category: 'Vendite & Clienti',
    defaultSelected: true,
    recommendedFor: 'Chi invia più di 5 preventivi a settimana'
  },
  {
    id: 'sdi_invoices',
    name: 'Fatturazione Elettronica & SDI',
    tagline: 'Emissione fatture XML, scadenziario cassa e riconciliazione',
    description: 'Generazione automatica dal preventivo accettato, invio al Sistema di Interscambio e allerta insoluti automatica.',
    category: 'Amministrazione',
    defaultSelected: true,
    recommendedFor: 'Aziende e professionisti con partita IVA italiana'
  },
  {
    id: 'wms_warehouse',
    name: 'Magazzino & Inventario (WMS Light)',
    tagline: 'Controllo giacenze, allerta sotto-scorta e lettore barcode',
    description: 'Traccia prodotti fisici e servizi, calcola il margine reale tra prezzo di fornitura e prezzo di vendita.',
    category: 'Operatività',
    defaultSelected: false,
    recommendedFor: 'Negozi, magazzini e distributori di merci'
  },
  {
    id: 'pm_projects',
    name: 'Gestione Commesse & Ore (Time Tracking)',
    tagline: 'SAL % avanzamento lavori, ore collaboratori e marginalità reale',
    description: 'Consuntivazione ore per progetto, confronto budget concordato vs costi sostenuti e allegati tecnici.',
    category: 'Operatività',
    defaultSelected: true,
    recommendedFor: 'Agenzie, software house, studi tecnici, artigiani e cantieri'
  },
  {
    id: 'ai_assistant',
    name: 'Assistente AI & Automazioni Smart',
    tagline: 'Compilazione automatica note, riassunti vocali e preventivi con AI',
    description: 'Sfrutta l\'intelligenza artificiale per estrarre dati da email e messaggi WhatsApp, compilando schede cliente.',
    category: 'Integrazioni Enterprise',
    defaultSelected: true,
    recommendedFor: 'Aziende che vogliono risparmiare 10 ore alla settimana'
  },
  {
    id: 'custom_api',
    name: 'Integrazioni API E-commerce & ERP Legacy',
    tagline: 'Sincronizzazione bidirezionale con Shopify, WooCommerce, Zucchetti',
    description: 'Collega il nuovo gestionale al tuo negozio online o ad altri software esistenti senza interruzioni operative.',
    category: 'Integrazioni Enterprise',
    defaultSelected: false,
    recommendedFor: 'Aziende con e-commerce o software preesistenti'
  }
];

