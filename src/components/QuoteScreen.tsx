import { useState } from 'react';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  FileEdit, 
  Plus, 
  Trash2, 
  Printer, 
  ArrowLeft, 
  Clock, 
  Euro, 
  Building2, 
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { ServiceRequest, QuoteStatus, QuoteItem } from '../types';
import { formatCurrency, getQuoteStatusConfig } from '../utils/formatters';

interface QuoteScreenProps {
  request: ServiceRequest;
  allRequests: ServiceRequest[];
  onSelectAnotherRequest: (req: ServiceRequest) => void;
  onBackToClientCard: () => void;
  onBackToRequests: () => void;
  onUpdateQuoteStatus: (requestId: string, newStatus: QuoteStatus) => void;
  onUpdateQuoteItems: (requestId: string, newItems: QuoteItem[]) => void;
}

export function QuoteScreen({
  request,
  allRequests,
  onSelectAnotherRequest,
  onBackToClientCard,
  onBackToRequests,
  onUpdateQuoteStatus,
  onUpdateQuoteItems
}: QuoteScreenProps) {
  const quote = request.quote;
  const statusConfig = getQuoteStatusConfig(quote.status);

  // New item draft state
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Sviluppo Web');
  const [newItemPrice, setNewItemPrice] = useState<number>(500);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [printSuccessNotice, setPrintSuccessNotice] = useState(false);

  // Totals calculation
  const subtotal = quote.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vatRate = 0.22;
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemDesc.trim()) return;

    const newItem: QuoteItem = {
      id: `qi-${Date.now()}`,
      description: newItemDesc.trim(),
      category: newItemCategory,
      quantity: 1,
      unitPrice: Number(newItemPrice) || 0,
      vatRate: 22
    };

    const updated = [...quote.items, newItem];
    onUpdateQuoteItems(request.id, updated);
    setNewItemDesc('');
    setNewItemPrice(500);
    setShowAddItemForm(false);
  };

  const handleRemoveItem = (itemId: string) => {
    const updated = quote.items.filter(item => item.id !== itemId);
    onUpdateQuoteItems(request.id, updated);
  };

  const handlePrintDemo = () => {
    setPrintSuccessNotice(true);
    setTimeout(() => {
      window.print();
      setPrintSuccessNotice(false);
    }, 400);
  };

  return (
    <div id="screen-quote" className="space-y-6">
      
      {/* Top Bar: Navigation & Step 4 Callout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToClientCard}
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Torna a Scheda Cliente</span>
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={onBackToRequests}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Tutte le Richieste
          </button>
        </div>

        {/* Client switcher dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Preventivo per:</span>
          <select
            value={request.id}
            onChange={(e) => {
              const found = allRequests.find(r => r.id === e.target.value);
              if (found) onSelectAnotherRequest(found);
            }}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-slate-400 outline-hidden"
          >
            {allRequests.map((r) => (
              <option key={r.id} value={r.id}>
                {r.clientName} ({r.quote.number}) - {r.quote.status.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Print / Action */}
        <div className="flex items-center gap-2">
          <button
            id="btn-print-quote"
            onClick={handlePrintDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Stampa / PDF Demo</span>
          </button>
        </div>
      </div>

      {/* Step 4 Highlighting Banner: AGGIORNAMENTO STATO */}
      <div id="step-4-status-updater" className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Passo 4 del Percorso Demo: Aggiornamento Stato
              </span>
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Demo dimostrativa
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Stato Attuale del Preventivo: <span className="text-slate-900 font-bold">{statusConfig.label}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {statusConfig.description}. Fai clic su uno dei pulsanti per cambiare stato e completare la registrazione demo:
            </p>
          </div>

          {/* Interactive 3-State Switcher: Bozza | Inviato | Accettato (richiesto dal prompt) */}
          <div className="flex items-center flex-wrap gap-2">
            
            {/* 1. Bozza */}
            <button
              id="btn-set-status-bozza"
              onClick={() => onUpdateQuoteStatus(request.id, 'bozza')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                quote.status === 'bozza'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileEdit className="w-4 h-4 text-slate-400" />
              <span>1. Bozza</span>
            </button>

            {/* 2. Inviato */}
            <button
              id="btn-set-status-inviato"
              onClick={() => onUpdateQuoteStatus(request.id, 'inviato')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                quote.status === 'inviato'
                  ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Send className="w-4 h-4 text-blue-400" />
              <span>2. Inviato al Cliente</span>
            </button>

            {/* 3. Accettato */}
            <button
              id="btn-set-status-accettato"
              onClick={() => onUpdateQuoteStatus(request.id, 'accettato')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                quote.status === 'accettato'
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>3. Accettato & Confermato</span>
            </button>

          </div>
        </div>

        {/* Feedback visual alert when status is updated */}
        {quote.status === 'accettato' && (
          <div className="mt-3 p-3 bg-slate-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Commessa confermata!</strong> Il preventivo è stato <strong>Accettato</strong>. La commessa per <strong>{request.clientName}</strong> è registrata ed è pronta per la fase operativa.
              </span>
            </div>
            <button
              onClick={onBackToRequests}
              className="px-2.5 py-1 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              Vedi in Elenco Richieste →
            </button>
          </div>
        )}
      </div>

      {/* Main Quote Sheet Document Preview */}
      <div id="quote-printable-document" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-6">
          
          {/* Agency Brand Data */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-base shadow-xs">
                M
              </div>
              <div className="text-xl font-bold tracking-tight text-slate-900">
                M Solutions <span className="font-semibold text-slate-600">Web</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-tight">
              Consulenza Strategica & Sviluppo Soluzioni Web<br />
              Via dell'Innovazione Digitale, 12 - Milano (MI)<br />
              P.IVA: 09876540961 • Cod. Fiscale: MSW90A01H501Z<br />
              Email: info@msolutionsweb.it • www.msolutionsweb.it
            </p>
          </div>

          {/* Quote Meta & Status Badge */}
          <div className="sm:text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-slate-200 bg-slate-50 text-slate-700">
              <span>Stato:</span>
              <span className={`px-2 py-0.5 rounded-full ${statusConfig.badgeBg} ${statusConfig.badgeText} border ${statusConfig.borderColor}`}>
                {quote.status.toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              PREVENTIVO
            </h1>
            <div className="text-xs text-slate-600 space-y-0.5 mt-1">
              <div>Numero: <strong className="text-slate-900">{quote.number}</strong></div>
              <div>Data emissione: <strong>{quote.date}</strong></div>
              <div>Valido fino al: <strong>{quote.validUntil}</strong></div>
            </div>
          </div>

        </div>

        {/* Client Recipient & Project Context */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Destinatario / Spettabile
            </span>
            <div className="font-bold text-slate-900 text-base">{request.clientName}</div>
            <div className="text-xs text-slate-600 mt-1 space-y-0.5">
              <div>All'attenzione di: <strong>{request.contacts.contactPerson}</strong> ({request.contacts.role})</div>
              <div>{request.contacts.address}, {request.contacts.city}</div>
              <div>P.IVA / CF: <span className="font-mono">{request.contacts.vatNumber}</span></div>
              <div>Email: {request.contacts.email} • Tel: {request.contacts.phone}</div>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Oggetto della Proposta
            </span>
            <div className="font-bold text-slate-900 text-sm">
              {request.serviceRequested}
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {request.summary.description}
            </p>
          </div>
        </div>

        {/* Line Items Table (Voci del preventivo - richieste esplicitamente dal prompt) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600" />
              Voci Dettagliate di Spesa
            </h3>
            
            <button
              onClick={() => setShowAddItemForm(!showAddItemForm)}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 print:hidden underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddItemForm ? 'Chiudi' : 'Aggiungi Voce'}</span>
            </button>
          </div>

          {/* Optional inline form to add a line item */}
          {showAddItemForm && (
            <form onSubmit={handleAddItem} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 print:hidden">
              <div className="text-xs font-bold text-slate-800">Nuova Voce Preventivo</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    required
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    placeholder="Descrizione servizio (es. Configurazione Google Analytics 4)"
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    required
                    min="50"
                    step="50"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    placeholder="Prezzo (€)"
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-slate-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddItemForm(false)}
                  className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800"
                >
                  Inserisci Voce
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-y border-slate-200">
                  <th className="py-2.5 px-3 w-12 text-center">#</th>
                  <th className="py-2.5 px-3">Descrizione Servizio</th>
                  <th className="py-2.5 px-3 w-28">Ambito</th>
                  <th className="py-2.5 px-3 w-16 text-center">Q.tà</th>
                  <th className="py-2.5 px-3 w-28 text-right">Prezzo Unit.</th>
                  <th className="py-2.5 px-3 w-28 text-right">Totale</th>
                  <th className="py-2.5 px-2 w-10 text-center print:hidden"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {quote.items.map((item, idx) => {
                  const rowTotal = item.quantity * item.unitPrice;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 text-center text-slate-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900">
                        {item.description}
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                          {item.category || 'Generale'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-medium text-slate-700">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-slate-700">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">
                        {formatCurrency(rowTotal)}
                      </td>
                      <td className="py-3 px-2 text-center print:hidden">
                        {quote.items.length > 1 && (
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            title="Rimuovi voce"
                            className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals Section (Subtotale, IVA 22%, Totale Complessivo - richiesto dal prompt) */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-200">
          
          {/* Delivery & Payment Terms */}
          <div className="text-xs text-slate-600 space-y-2 max-w-md">
            <div>
              <span className="font-bold text-slate-800 block">Condizioni di Pagamento:</span>
              <span>{quote.paymentTerms}</span>
            </div>
            <div>
              <span className="font-bold text-slate-800 block">Tempi di Consegna Stimati:</span>
              <span>{quote.deliveryTime}</span>
            </div>
            {quote.notes && (
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500">
                <strong>Note aggiuntive:</strong> {quote.notes}
              </div>
            )}
          </div>

          {/* Financial Calculation Box */}
          <div className="w-full sm:w-72 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Imponibile Voci:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>IVA (22%):</span>
              <span className="font-semibold text-slate-800">{formatCurrency(vatAmount)}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
              <span className="font-bold text-slate-900 text-sm">TOTALE PREVENTIVO:</span>
              <span className="font-black text-slate-900 text-base">{formatCurrency(total)}</span>
            </div>
          </div>

        </div>

        {/* Signature Box (Demo) */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-xs text-slate-500">
          <div>
            <span className="block font-semibold text-slate-700">Per M Solutions Web</span>
            <div className="h-12 border-b border-dashed border-slate-300 flex items-end pb-1 font-serif italic text-slate-800">
              Marco Cerilli • M Solutions Web
            </div>
          </div>
          <div>
            <span className="block font-semibold text-slate-700">Per Accettazione il Cliente</span>
            <div className="h-12 border-b border-dashed border-slate-300 flex items-end pb-1 text-slate-400">
              {quote.status === 'accettato' ? (
                <span className="font-serif italic text-emerald-700 font-bold">
                  Firmato digitalmente da {request.contacts.contactPerson} ({quote.date})
                </span>
              ) : (
                'Timbro e Firma'
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
