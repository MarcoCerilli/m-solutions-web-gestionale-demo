import React, { useState } from 'react';
import { 
  Database, 
  Code2, 
  Server, 
  Layers, 
  Check, 
  Copy, 
  X, 
  ShieldCheck, 
  Zap, 
  Cpu 
} from 'lucide-react';

interface SchemaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const SchemaViewerModal: React.FC<SchemaViewerModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'tables' | 'architecture'>('schema');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const schemaSnippet = `// Architettura Database PostgreSQL con Drizzle ORM
// M Solutions Web - Suite Gestionale Modulare su Misura
// src/db/schema.ts

import { pgTable, uuid, varchar, text, numeric, integer, timestamp, boolean, pgEnum, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Clienti & Anagrafiche Aziendali
export const clients = pgTable('clients', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  vatNumber: varchar('vat_number', { length: 50 }).notNull(), // P.IVA o CF
  sdiCode: varchar('sdi_code', { length: 7 }).default('0000000').notNull(),
  pec: varchar('pec', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Richieste Commerciali & Pipeline CRM
export const serviceRequests = pgTable('service_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  status: requestStatusEnum('status').default('nuova').notNull(),
  serviceRequested: varchar('service_requested', { length: 255 }).notNull(),
});

// 3. Preventivi & CPQ
export const quotes = pgTable('quotes', {
  id: uuid('id').defaultRandom().primaryKey(),
  number: varchar('number', { length: 50 }).notNull().unique(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
  vatAmount: numeric('vat_amount', { precision: 12, scale: 2 }).notNull(),
  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
});

// 4. Fatture Elettroniche SDI & Scadenziario
export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  number: varchar('number', { length: 50 }).notNull().unique(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  sdiStatus: sdiStatusEnum('sdi_status').default('bozza').notNull(),
  paymentStatus: paymentStatusEnum('payment_status').default('in_scadenza').notNull(),
  dueDate: timestamp('due_date').notNull(),
  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
});

// 5. Magazzino & Servizi (WMS Light)
export const warehouseProducts = pgTable('warehouse_products', {
  id: uuid('id').defaultRandom().primaryKey(),
  sku: varchar('sku', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  costPrice: numeric('cost_price', { precision: 12, scale: 2 }).notNull(),
  sellingPrice: numeric('selling_price', { precision: 12, scale: 2 }).notNull(),
  stockQuantity: integer('stock_quantity').default(0).notNull(),
  minStockAlert: integer('min_stock_alert').default(5).notNull(),
});

// 6. Commesse & Project Management
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  salPercentage: integer('sal_percentage').default(0).notNull(),
  budgetEstimated: numeric('budget_estimated', { precision: 12, scale: 2 }).notNull(),
});`;

  const copyCode = () => {
    navigator.clipboard.writeText(schemaSnippet);
    setIsCopied(true);
    onShowToast('Codice schema Drizzle copiato negli appunti!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Header Modale */}
        <div className="bg-slate-900 p-6 sm:p-7 text-white flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/30">
              <Database className="w-3.5 h-3.5" />
              <span>Next.js 15 • TypeScript • PostgreSQL • Drizzle ORM</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Architettura Ingegneristica & Database Schema
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Ispezione tecnica della base dati relazionale e delle scelte tecnologiche del gestionale.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab di Navigazione */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 pt-3 flex gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2.5 rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'schema'
                ? 'bg-white text-slate-900 border-t-2 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Code2 className="w-4 h-4 text-indigo-600" />
            <span>Schema Drizzle ORM (TypeScript)</span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`px-4 py-2.5 rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'tables'
                ? 'bg-white text-slate-900 border-t-2 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Tabelle Relazionali & Vincoli</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2.5 rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'architecture'
                ? 'bg-white text-slate-900 border-t-2 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Cpu className="w-4 h-4 text-purple-600" />
            <span>Vantaggi vs Prisma & SaaS</span>
          </button>
        </div>

        {/* Contenuto Tab */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          
          {/* TAB 1: Schema Drizzle Code */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">
                  File sorgente reale: <code className="text-indigo-600 font-bold">src/db/schema.ts</code>
                </span>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copiato!' : 'Copia Schema'}</span>
                </button>
              </div>

              <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                <pre>{schemaSnippet}</pre>
              </div>
            </div>
          )}

          {/* TAB 2: Modello Dati Relazionale */}
          {activeTab === 'tables' && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                La base dati PostgreSQL è progettata secondo i principi di normalizzazione (3NF), garantendo 
                integrità referenziale a livello di motore con vincoli di chiave esterna (Foreign Keys) e indici 
                B-Tree ad alte prestazioni per ricerche istantanee.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between font-mono font-bold text-slate-900">
                    <span>1. clients</span>
                    <span className="text-indigo-600">Anagrafiche</span>
                  </div>
                  <p className="text-slate-500">
                    Perno centrale del sistema: memorizza ragione sociale, P.IVA, codice destinatario SDI a 7 cifre, 
                    PEC e indirizzi. Collegata 1-a-molti con tutte le altre entità.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between font-mono font-bold text-slate-900">
                    <span>2. service_requests & quotes</span>
                    <span className="text-indigo-600">CRM & CPQ</span>
                  </div>
                  <p className="text-slate-500">
                    Gestione lead commerciali, stadi pipeline, voci di preventivo dettagliate con scorporo 
                    IVA (22%, 10%, 4%, esente) e calcolo totali in tempo reale.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between font-mono font-bold text-slate-900">
                    <span>3. invoices & items</span>
                    <span className="text-indigo-600">Fatturazione SDI</span>
                  </div>
                  <p className="text-slate-500">
                    Fatture elettroniche con tracciamento stato consegna SDI (FatturaPA XML), calcolo automatico 
                    delle scadenze a 30/60 gg d.f.f.m. e solleciti insoluti.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between font-mono font-bold text-slate-900">
                    <span>4. projects & time_logs</span>
                    <span className="text-indigo-600">Commesse & SAL</span>
                  </div>
                  <p className="text-slate-500">
                    Controllo commesse a progetto con Stato Avanzamento Lavori (SAL %), registrazione ore dei tecnici 
                    e verifica redditività tra costo orario interno e prezzo fatturato.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Confronto Architettura */}
          {activeTab === 'architecture' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                  <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 text-sm">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span>Drizzle ORM (Scelta M Solutions Web)</span>
                  </h4>
                  <ul className="space-y-1.5 text-emerald-900 list-disc list-inside">
                    <li><strong>Zero overhead binario:</strong> compila direttamente in SQL nativo senza motori intermedi in Rust.</li>
                    <li><strong>Cold-start immediato:</strong> ideale per serverless Next.js e deploy su Vercel, VPS o Docker.</li>
                    <li><strong>100% Type-Safe:</strong> ogni campo del DB è un tipo TypeScript reale senza comandi di generazione pesanti.</li>
                    <li><strong>Migrazioni SQL pulite:</strong> script SQL trasparenti versionabili su Git.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                    <Server className="w-4 h-4 text-slate-600" />
                    <span>Confronto con Prisma ORM</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                    <li>Prisma richiede un engine binario (~40MB) che rallenta l'avvio a freddo in serverless.</li>
                    <li>Meno flessibilità per query complesse con join multipli o window functions SQL.</li>
                    <li>Richiede continua esecuzione di <code className="font-mono">prisma generate</code> ad ogni modifica.</li>
                  </ul>
                </div>

              </div>

              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 space-y-1">
                <span className="font-bold">Perché Server Components & Server Actions di Next.js?</span>
                <p className="text-slate-600 leading-relaxed">
                  Tutte le operazioni critiche (creazione fatture, calcolo scadenziario, interrogazione database) 
                  avvengono <strong>sul server in un ambiente protetto</strong>. Il browser riceve HTML pre-renderizzato 
                  con zero rischio di injection e tempi di caricamento inferiori a 150ms.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Architettura ingegnerizzata da <strong>M Solutions Web</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
          >
            Chiudi Scheda Tecnica
          </button>
        </div>

      </div>
    </div>
  );
};
