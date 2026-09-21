import React, { useState } from 'react';
import { 
  FileText, 
  Euro, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Send, 
  Eye, 
  X,
  FileCode,
  Building,
  Calendar,
  CreditCard
} from 'lucide-react';
import { Invoice, PaymentStatus, SdiStatus } from '../types';
import { formatCurrency } from '../utils/formatters';

interface InvoicesScreenProps {
  invoices: Invoice[];
  onAddInvoice: (invoice: Invoice) => void;
  onUpdateInvoiceStatus: (id: string, paymentStatus: PaymentStatus) => void;
  onShowToast: (msg: string) => void;
}

export const InvoicesScreen: React.FC<InvoicesScreenProps> = ({
  invoices,
  onAddInvoice,
  onUpdateInvoiceStatus,
  onShowToast
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);

  // Form nuova fattura
  const [formData, setFormData] = useState({
    number: `FATT-2026/0${invoices.length + 50}`,
    clientName: '',
    clientVat: '',
    clientSdi: '0000000',
    clientPec: '',
    dueDate: '2026-10-31',
    description: '',
    amount: '',
    paymentMethod: 'Bonifico 30 gg d.f.f.m.' as const
  });

  const filteredInvoices = invoices.filter(inv => {
    // Filtro Tab
    if (filterTab === 'pending' && inv.paymentStatus !== 'in_scadenza') return false;
    if (filterTab === 'paid' && inv.paymentStatus !== 'pagata') return false;
    if (filterTab === 'overdue' && inv.paymentStatus !== 'scaduta') return false;

    // Ricerca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        inv.number.toLowerCase().includes(term) ||
        inv.clientName.toLowerCase().includes(term) ||
        inv.clientVat.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Somme
  const totalAmount = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const paidAmount = invoices.filter(i => i.paymentStatus === 'pagata').reduce((s, i) => s + i.totalAmount, 0);
  const overdueAmount = invoices.filter(i => i.paymentStatus === 'scaduta').reduce((s, i) => s + i.totalAmount, 0);
  const pendingAmount = invoices.filter(i => i.paymentStatus === 'in_scadenza').reduce((s, i) => s + i.totalAmount, 0);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.amount) {
      onShowToast('Compila almeno il nome cliente e l\'importo.');
      return;
    }

    const subtotal = parseFloat(formData.amount);
    const vat = subtotal * 0.22;
    const total = subtotal + vat;

    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      number: formData.number,
      date: new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate,
      clientName: formData.clientName,
      clientVat: formData.clientVat || 'IT00000000000',
      clientSdi: formData.clientSdi,
      clientPec: formData.clientPec,
      sdiStatus: 'consegnata_sdi',
      paymentStatus: 'in_scadenza',
      paymentMethod: formData.paymentMethod,
      subtotal,
      vatAmount: vat,
      totalAmount: total,
      items: [
        {
          id: `item-${Date.now()}`,
          description: formData.description || 'Prestazione servizi professionali software',
          quantity: 1,
          unitPrice: subtotal,
          vatRate: 22,
          total: subtotal
        }
      ]
    };

    onAddInvoice(newInv);
    setIsNewInvoiceModalOpen(false);
    onShowToast(`Fattura ${newInv.number} emessa con successo e inviata a SDI!`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header con Titolo & Azioni */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Fatturazione Elettronica & Scadenziario
            </h1>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full border border-indigo-200">
              Sistema SDI Attivo
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestisci fatture elettroniche XML a norma Agenzia Entrate, monitora incassi e scadenziario cassa.
          </p>
        </div>

        <button
          onClick={() => setIsNewInvoiceModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Emetti Nuova Fattura</span>
        </button>
      </div>

      {/* KPI Cards Finanziarie */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Totale Fatturato</span>
          <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalAmount)}</div>
          <span className="text-[11px] text-slate-400">{invoices.length} fatture totali</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-emerald-600">Incassato a Cassa</span>
          <div className="text-lg sm:text-xl font-bold text-emerald-600 mt-1">{formatCurrency(paidAmount)}</div>
          <span className="text-[11px] text-slate-400">Pagate regolarmente</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-amber-600">In Scadenza (Prossimi 30 gg)</span>
          <div className="text-lg sm:text-xl font-bold text-amber-600 mt-1">{formatCurrency(pendingAmount)}</div>
          <span className="text-[11px] text-slate-400">Previsione di cassa</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-rose-600">Insoluti & Scaduti</span>
          <div className="text-lg sm:text-xl font-bold text-rose-600 mt-1">{formatCurrency(overdueAmount)}</div>
          <span className="text-[11px] text-rose-500 font-semibold">Richiede sollecito</span>
        </div>
      </div>

      {/* Barra Filtri & Ricerca */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tab Filtri */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-full md:w-auto">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tutte ({invoices.length})
          </button>
          <button
            onClick={() => setFilterTab('pending')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filterTab === 'pending' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Scadenza
          </button>
          <button
            onClick={() => setFilterTab('paid')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filterTab === 'paid' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pagate
          </button>
          <button
            onClick={() => setFilterTab('overdue')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filterTab === 'overdue' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scadute
          </button>
        </div>

        {/* Input Ricerca */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cerca numero fattura o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Tabella Fatture */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Numero & Data</th>
                <th className="py-3 px-4">Cliente & Dati Fiscali</th>
                <th className="py-3 px-4">Scadenza</th>
                <th className="py-3 px-4">Stato SDI</th>
                <th className="py-3 px-4">Stato Pagamento</th>
                <th className="py-3 px-4 text-right">Totale IVA Incl.</th>
                <th className="py-3 px-4 text-center">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900">{inv.number}</span>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{inv.date}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{inv.clientName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      P.IVA: {inv.clientVat} {inv.clientSdi && `• SDI: ${inv.clientSdi}`}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-700">{inv.dueDate}</div>
                    <div className="text-[11px] text-slate-400">{inv.paymentMethod}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                      inv.sdiStatus === 'consegnata_sdi' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      inv.sdiStatus === 'inviata_sdi' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      inv.sdiStatus === 'scartata_sdi' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>
                        {inv.sdiStatus === 'consegnata_sdi' ? 'SDI Consegnata' :
                         inv.sdiStatus === 'inviata_sdi' ? 'Inviata SDI' : 'Bozza'}
                      </span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      inv.paymentStatus === 'pagata' ? 'bg-emerald-100 text-emerald-800' :
                      inv.paymentStatus === 'scaduta' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {inv.paymentStatus === 'pagata' ? '✓ Pagata' :
                       inv.paymentStatus === 'scaduta' ? '⚠️ Scaduta' : '⏳ In Scadenza'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="font-bold text-slate-900">{formatCurrency(inv.totalAmount)}</span>
                    <div className="text-[11px] text-slate-400">
                      Imponibile: {formatCurrency(inv.subtotal)}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Dettaglio e Azioni"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dettaglio Fattura */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    Dettaglio {selectedInvoice.number}
                  </h3>
                  <p className="text-xs text-slate-500">Documento Fiscale Elettronico (FatturaPA XML)</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Cliente Destinatario</span>
                <p className="font-bold text-slate-900 text-sm">{selectedInvoice.clientName}</p>
                <p className="text-slate-600 font-mono">P.IVA: {selectedInvoice.clientVat}</p>
                <p className="text-slate-600 font-mono">Codice SDI: {selectedInvoice.clientSdi}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Condizioni Pagamento</span>
                <p className="font-semibold text-slate-800">{selectedInvoice.paymentMethod}</p>
                <p className="text-slate-600">Data emissione: {selectedInvoice.date}</p>
                <p className="text-slate-600">Data scadenza: <strong className="text-slate-900">{selectedInvoice.dueDate}</strong></p>
              </div>
            </div>

            {/* Voci Fattura */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Voci del Documento</h4>
              <div className="border border-slate-100 rounded-lg overflow-hidden divide-y divide-slate-100 text-xs">
                {selectedInvoice.items.map(item => (
                  <div key={item.id} className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800">{item.description}</span>
                      <span className="text-slate-400 ml-2">x{item.quantity}</span>
                    </div>
                    <div className="font-bold text-slate-900">{formatCurrency(item.total)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Riepilogo Totali */}
            <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Stato: </span>
                <strong className={`text-xs uppercase font-bold ml-1 ${
                  selectedInvoice.paymentStatus === 'pagata' ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  {selectedInvoice.paymentStatus}
                </strong>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Totale Documento (IVA 22% incl.)</div>
                <div className="text-xl font-black text-slate-900">{formatCurrency(selectedInvoice.totalAmount)}</div>
              </div>
            </div>

            {/* Bottoni Azione */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onShowToast(`Scaricato file XML FatturaPA per ${selectedInvoice.number}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <FileCode className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Esporta XML SDI</span>
                </button>
                <button
                  onClick={() => onShowToast(`Inviata copia PDF per email al cliente`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Send className="w-3.5 h-3.5 text-slate-500" />
                  <span>Invia via PEC / Email</span>
                </button>
              </div>

              {selectedInvoice.paymentStatus !== 'pagata' ? (
                <button
                  onClick={() => {
                    onUpdateInvoiceStatus(selectedInvoice.id, 'pagata');
                    setSelectedInvoice({ ...selectedInvoice, paymentStatus: 'pagata' });
                    onShowToast(`Fattura ${selectedInvoice.number} registrata come PAGATA!`);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Registra Incasso</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Incasso già registrato
                </span>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Modal Nuova Fattura */}
      {isNewInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Emissione Fattura Elettronica</h3>
              <button onClick={() => setIsNewInvoiceModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Numero Fattura</label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ragione Sociale Cliente</label>
                  <input
                    type="text"
                    placeholder="es. Bar Ristorante Duomo Srl"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Partita IVA / CF</label>
                  <input
                    type="text"
                    placeholder="IT01234567890"
                    value={formData.clientVat}
                    onChange={(e) => setFormData({ ...formData, clientVat: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Codice SDI Univoco</label>
                  <input
                    type="text"
                    maxLength={7}
                    value={formData.clientSdi}
                    onChange={(e) => setFormData({ ...formData, clientSdi: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Data Scadenza</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descrizione Prestazione / Servizio</label>
                <input
                  type="text"
                  placeholder="Sviluppo portale web personalizzato e configurazione database"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Importo Netto (€ Imponibile)</label>
                <input
                  type="number"
                  placeholder="2500"
                  step="50"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Verrà calcolata automaticamente l'IVA 22% per il Sistema di Interscambio.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all shadow-xs"
                >
                  Conferma & Emetti Fattura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
