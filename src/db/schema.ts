/**
 * Architettura Database PostgreSQL con Drizzle ORM
 * M Solutions Web - Suite Gestionale Modulare su Misura
 * 
 * Questo schema definisce la struttura dati relazionale completa,
 * conforme allo standard Drizzle ORM per Next.js 15+ (App Router & Server Actions).
 */

import { 
  pgTable, 
  uuid, 
  varchar, 
  text, 
  numeric, 
  integer, 
  timestamp, 
  boolean, 
  pgEnum, 
  index 
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// -------------------------------------------------------------
// ENUM PERSONALIZZATI
// -------------------------------------------------------------
export const userRoleEnum = pgEnum('user_role', ['admin', 'manager', 'commerciale', 'tecnico', 'collaboratore']);
export const requestStatusEnum = pgEnum('request_status', [
  'nuova', 
  'in_valutazione', 
  'preventivo_bozza', 
  'preventivo_inviato', 
  'accettato', 
  'completato'
]);
export const quoteStatusEnum = pgEnum('quote_status', ['bozza', 'inviato', 'accettato', 'rifiutato']);
export const sdiStatusEnum = pgEnum('sdi_status', ['bozza', 'inviata_sdi', 'consegnata_sdi', 'scartata_sdi']);
export const paymentStatusEnum = pgEnum('payment_status', ['pagata', 'in_scadenza', 'scaduta', 'stornata']);
export const productTypeEnum = pgEnum('product_type', ['servizio', 'prodotto_fisico', 'licenza_software']);
export const projectStatusEnum = pgEnum('project_status', ['pianificato', 'in_corso', 'in_revisione', 'completato', 'in_pausa']);

// -------------------------------------------------------------
// TABELLA UTENTI & OPERATORI
// -------------------------------------------------------------
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: userRoleEnum('role').default('commerciale').notNull(),
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// -------------------------------------------------------------
// TABELLA CLIENTI & ANAGRAFICHE AZIENDALI
// -------------------------------------------------------------
export const clients = pgTable('clients', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  contactPerson: varchar('contact_person', { length: 255 }).notNull(),
  contactRole: varchar('contact_role', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  vatNumber: varchar('vat_number', { length: 50 }).notNull(), // P.IVA o CF
  sdiCode: varchar('sdi_code', { length: 7 }).default('0000000').notNull(), // Codice SDI Univoco
  pec: varchar('pec', { length: 255 }),
  website: varchar('website', { length: 255 }),
  tags: text('tags').array(), // es: ['Lead Caldo', 'Enterprise', 'E-commerce']
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_clients_vat').on(table.vatNumber),
  index('idx_clients_company').on(table.companyName),
]);

// -------------------------------------------------------------
// TABELLA RICHIESTE COMMERCIALI & LEAD (CRM)
// -------------------------------------------------------------
export const serviceRequests = pgTable('service_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(), // es: MSW-2026-081
  clientId: uuid('client_id').references(() => clients.id, { onDelete: 'cascade' }).notNull(),
  serviceRequested: varchar('service_requested', { length: 255 }).notNull(),
  status: requestStatusEnum('status').default('nuova').notNull(),
  channel: varchar('channel', { length: 100 }).default('Sito web').notNull(),
  estimatedBudget: varchar('estimated_budget', { length: 100 }),
  urgency: varchar('urgency', { length: 50 }).default('Media').notNull(),
  targetDate: varchar('target_date', { length: 50 }),
  nextAction: text('next_action'),
  nextActionDate: varchar('next_action_date', { length: 100 }),
  featuresNeeded: text('features_needed').array(),
  assignedUserId: uuid('assigned_user_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_requests_client').on(table.clientId),
  index('idx_requests_status').on(table.status),
]);

// -------------------------------------------------------------
// TABELLA NOTE & TIMELINE CRM
// -------------------------------------------------------------
export const crmNotes = pgTable('crm_notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  requestId: uuid('request_id').references(() => serviceRequests.id, { onDelete: 'cascade' }).notNull(),
  author: varchar('author', { length: 100 }).notNull(),
  text: text('text').notNull(),
  type: varchar('type', { length: 50 }).default('aggiornamento').notNull(), // briefing, telefonata, aggiornamento, sistema
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// -------------------------------------------------------------
// TABELLA PREVENTIVI & CPQ
// -------------------------------------------------------------
export const quotes = pgTable('quotes', {
  id: uuid('id').defaultRandom().primaryKey(),
  number: varchar('number', { length: 50 }).notNull().unique(), // PREV-2026/142
  requestId: uuid('request_id').references(() => serviceRequests.id, { onDelete: 'set null' }),
  clientId: uuid('client_id').references(() => clients.id, { onDelete: 'cascade' }).notNull(),
  status: quoteStatusEnum('status').default('bozza').notNull(),
  date: timestamp('date').defaultNow().notNull(),
  validUntil: timestamp('valid_until').notNull(),
  paymentTerms: text('payment_terms').notNull(),
  deliveryTime: text('delivery_time').notNull(),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).default('0').notNull(),
  vatAmount: numeric('vat_amount', { precision: 12, scale: 2 }).default('0').notNull(),
  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).default('0').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const quoteItems = pgTable('quote_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  quoteId: uuid('quote_id').references(() => quotes.id, { onDelete: 'cascade' }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }),
  quantity: numeric('quantity', { precision: 10, scale: 2 }).default('1').notNull(),
  unitPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull(),
  vatRate: integer('vat_rate').default(22).notNull(), // 22%
  orderIndex: integer('order_index').default(0).notNull(),
});

// -------------------------------------------------------------
// TABELLA FATTURE ELETTRONICHE & SCADENZIARIO
// -------------------------------------------------------------
export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  number: varchar('number', { length: 50 }).notNull().unique(), // FATT-2026/048
  clientId: uuid('client_id').references(() => clients.id, { onDelete: 'restrict' }).notNull(),
  quoteId: uuid('quote_id').references(() => quotes.id, { onDelete: 'set null' }),
  sdiStatus: sdiStatusEnum('sdi_status').default('bozza').notNull(),
  paymentStatus: paymentStatusEnum('payment_status').default('in_scadenza').notNull(),
  date: timestamp('date').defaultNow().notNull(),
  dueDate: timestamp('due_date').notNull(),
  paidDate: timestamp('paid_date'),
  paymentMethod: varchar('payment_method', { length: 100 }).notNull(),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
  vatAmount: numeric('vat_amount', { precision: 12, scale: 2 }).notNull(),
  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_invoices_client').on(table.clientId),
  index('idx_invoices_due_date').on(table.dueDate),
  index('idx_invoices_payment_status').on(table.paymentStatus),
]);

export const invoiceItems = pgTable('invoice_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  invoiceId: uuid('invoice_id').references(() => invoices.id, { onDelete: 'cascade' }).notNull(),
  description: text('description').notNull(),
  quantity: numeric('quantity', { precision: 10, scale: 2 }).default('1').notNull(),
  unitPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull(),
  vatRate: integer('vat_rate').default(22).notNull(),
  total: numeric('total', { precision: 12, scale: 2 }).notNull(),
});

// -------------------------------------------------------------
// TABELLA CATALOGO & MAGAZZINO (WMS Light)
// -------------------------------------------------------------
export const warehouseProducts = pgTable('warehouse_products', {
  id: uuid('id').defaultRandom().primaryKey(),
  sku: varchar('sku', { length: 50 }).notNull().unique(), // es: MSW-SRV-01
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  type: productTypeEnum('type').default('servizio').notNull(),
  unit: varchar('unit', { length: 20 }).default('ore').notNull(),
  costPrice: numeric('cost_price', { precision: 12, scale: 2 }).notNull(),
  sellingPrice: numeric('selling_price', { precision: 12, scale: 2 }).notNull(),
  stockQuantity: integer('stock_quantity').default(0).notNull(),
  minStockAlert: integer('min_stock_alert').default(5).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_products_sku').on(table.sku),
  index('idx_products_category').on(table.category),
]);

// -------------------------------------------------------------
// TABELLA COMMESSE & PROJECT MANAGEMENT
// -------------------------------------------------------------
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(), // COMM-2026-012
  title: varchar('title', { length: 255 }).notNull(),
  clientId: uuid('client_id').references(() => clients.id, { onDelete: 'cascade' }).notNull(),
  quoteId: uuid('quote_id').references(() => quotes.id, { onDelete: 'set null' }),
  status: projectStatusEnum('status').default('in_corso').notNull(),
  salPercentage: integer('sal_percentage').default(0).notNull(), // 0 - 100%
  budgetEstimated: numeric('budget_estimated', { precision: 12, scale: 2 }).notNull(),
  costActual: numeric('cost_actual', { precision: 12, scale: 2 }).default('0').notNull(),
  estimatedHours: numeric('estimated_hours', { precision: 8, scale: 1 }).notNull(),
  loggedHours: numeric('logged_hours', { precision: 8, scale: 1 }).default('0').notNull(),
  startDate: timestamp('start_date').notNull(),
  deadline: timestamp('deadline').notNull(),
  description: text('description'),
  team: text('team').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_projects_client').on(table.clientId),
  index('idx_projects_status').on(table.status),
]);

export const projectTimeLogs = pgTable('project_time_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  author: varchar('author', { length: 100 }).notNull(),
  hours: numeric('hours', { precision: 5, scale: 2 }).notNull(),
  description: text('description').notNull(),
  date: timestamp('date').defaultNow().notNull(),
});

// -------------------------------------------------------------
// RELAZIONI DRIZZLE ORM (Per Query Tipizzate Automatiche)
// -------------------------------------------------------------
export const clientsRelations = relations(clients, ({ many }) => ({
  requests: many(serviceRequests),
  quotes: many(quotes),
  invoices: many(invoices),
  projects: many(projects),
}));

export const serviceRequestsRelations = relations(serviceRequests, ({ one, many }) => ({
  client: one(clients, {
    fields: [serviceRequests.clientId],
    references: [clients.id],
  }),
  notes: many(crmNotes),
  quote: one(quotes, {
    fields: [serviceRequests.id],
    references: [quotes.requestId],
  }),
}));

export const quotesRelations = relations(quotes, ({ one, many }) => ({
  client: one(clients, {
    fields: [quotes.clientId],
    references: [clients.id],
  }),
  request: one(serviceRequests, {
    fields: [quotes.requestId],
    references: [serviceRequests.id],
  }),
  items: many(quoteItems),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  client: one(clients, {
    fields: [invoices.clientId],
    references: [clients.id],
  }),
  quote: one(quotes, {
    fields: [invoices.quoteId],
    references: [quotes.id],
  }),
  items: many(invoiceItems),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(clients, {
    fields: [projects.clientId],
    references: [clients.id],
  }),
  timeLogs: many(projectTimeLogs),
}));
