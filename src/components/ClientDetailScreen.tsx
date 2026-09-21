import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  FileCheck, 
  MessageSquare, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Tag, 
  Send,
  AlertCircle,
  FileText
} from 'lucide-react';
import { ServiceRequest, Note, RequestStatus } from '../types';
import { getRequestStatusConfig } from '../utils/formatters';

interface ClientDetailScreenProps {
  request: ServiceRequest;
  allRequests: ServiceRequest[];
  onSelectAnotherRequest: (req: ServiceRequest) => void;
  onBackToRequests: () => void;
  onProceedToQuote: (req: ServiceRequest) => void;
  onAddNote: (requestId: string, newNoteText: string) => void;
  onUpdateStatus: (requestId: string, newStatus: RequestStatus) => void;
  onUpdateNextAction: (requestId: string, nextAction: string) => void;
  autoTypeNoteText?: string | null;
  onAutoNoteComplete?: () => void;
}

export function ClientDetailScreen({
  request,
  allRequests,
  onSelectAnotherRequest,
  onBackToRequests,
  onProceedToQuote,
  onAddNote,
  onUpdateStatus,
  onUpdateNextAction,
  autoTypeNoteText = null,
  onAutoNoteComplete
}: ClientDetailScreenProps) {
  const [newNoteText, setNewNoteText] = useState('');
  const [isEditingAction, setIsEditingAction] = useState(false);
  const [actionText, setActionText] = useState(request.nextAction);

  // Live typing effect during Auto-Play demo
  React.useEffect(() => {
    if (!autoTypeNoteText) return;

    let current = '';
    let index = 0;
    const interval = setInterval(() => {
      if (index < autoTypeNoteText.length) {
        current += autoTypeNoteText[index];
        setNewNoteText(current);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onAddNote(request.id, autoTypeNoteText);
          setNewNoteText('');
          if (onAutoNoteComplete) onAutoNoteComplete();
        }, 500);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [autoTypeNoteText, request.id]);

  const statusCfg = getRequestStatusConfig(request.status);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(request.id, newNoteText.trim());
    setNewNoteText('');
  };

  const handleSaveAction = () => {
    onUpdateNextAction(request.id, actionText);
    setIsEditingAction(false);
  };

  return (
    <div id="screen-client-card" className="space-y-6">
      
      {/* Top Navigation & Client Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            id="btn-back-to-requests"
            onClick={onBackToRequests}
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Torna alle Richieste</span>
          </button>

          <span className="text-slate-300">|</span>

          {/* Quick client selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium hidden md:inline">Cliente attivo:</span>
            <select
              id="select-active-client-dropdown"
              value={request.id}
              onChange={(e) => {
                const found = allRequests.find(r => r.id === e.target.value);
                if (found) onSelectAnotherRequest(found);
              }}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-slate-400 outline-hidden"
            >
              {allRequests.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.clientName} ({r.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action to proceed to step 3: Preventivo */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            id="btn-go-to-quote-step3"
            onClick={() => onProceedToQuote(request)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            <span>Passo 3: Prepara Preventivo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hero Client Card Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-2xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Scheda Cliente • {request.code}
                </span>
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Demo dimostrativa
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusCfg.badgeBg} ${statusCfg.badgeText} ${statusCfg.borderColor}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotColor}`} />
                  {statusCfg.label}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                {request.clientName}
              </h1>
              <p className="text-sm text-slate-600 font-medium mt-0.5 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <span>Richiesta: <strong className="text-slate-900">{request.serviceRequested}</strong></span>
              </p>
            </div>
          </div>

          {/* Next action editable card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-w-[300px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Prossima Azione Operativa
              </span>
              <button
                onClick={() => {
                  if (isEditingAction) handleSaveAction();
                  else setIsEditingAction(true);
                }}
                className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 underline"
              >
                {isEditingAction ? 'Salva' : 'Modifica'}
              </button>
            </div>
            
            {isEditingAction ? (
              <div className="space-y-2 mt-1">
                <input
                  type="text"
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white outline-hidden focus:ring-1 focus:ring-slate-500"
                />
                <button
                  onClick={handleSaveAction}
                  className="px-2 py-1 bg-slate-900 text-white rounded text-[11px] font-semibold"
                >
                  Conferma
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold text-slate-900">{request.nextAction}</p>
                {request.nextActionDate && (
                  <p className="text-[11px] text-slate-500 mt-0.5">Scadenza: {request.nextActionDate}</p>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Grid: Contatti (Left) + Riepilogo Richiesta (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Contatti del Cliente */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-600" />
              Contatti & Dati Aziendali
            </h2>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium border border-slate-200">
              Verificati
            </span>
          </div>

          <div className="space-y-3 text-sm">
            {/* Referente & Ruolo */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-xs text-slate-500 font-medium block">Referente Principale</span>
              <div className="font-bold text-slate-900 mt-0.5">{request.contacts.contactPerson}</div>
              {request.contacts.role && (
                <div className="text-xs text-slate-600 font-medium">{request.contacts.role}</div>
              )}
            </div>

            {/* Email */}
            <div className="flex items-start gap-3 p-2">
              <div className="p-2 rounded-lg bg-slate-100 text-slate-600 shrink-0 border border-slate-200/80">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Email Ufficiale</span>
                <a 
                  href={`mailto:${request.contacts.email}`} 
                  className="font-medium text-slate-900 hover:underline text-xs sm:text-sm break-all"
                >
                  {request.contacts.email}
                </a>
              </div>
            </div>

            {/* Telefono */}
            <div className="flex items-start gap-3 p-2">
              <div className="p-2 rounded-lg bg-slate-100 text-slate-600 shrink-0 border border-slate-200/80">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Recapito Telefonico</span>
                <a 
                  href={`tel:${request.contacts.phone}`} 
                  className="font-medium text-slate-900 hover:underline text-xs sm:text-sm"
                >
                  {request.contacts.phone}
                </a>
              </div>
            </div>

            {/* Indirizzo / Sede */}
            <div className="flex items-start gap-3 p-2">
              <div className="p-2 rounded-lg bg-slate-100 text-slate-600 shrink-0 border border-slate-200/80">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Sede Operativa</span>
                <div className="font-medium text-slate-900 text-xs sm:text-sm">
                  {request.contacts.address}, {request.contacts.city}
                </div>
              </div>
            </div>

            {/* Partita IVA */}
            <div className="flex items-start gap-3 p-2">
              <div className="p-2 rounded-lg bg-slate-100 text-slate-600 shrink-0 border border-slate-200/80">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Partita IVA / Cod. Fiscale</span>
                <div className="font-mono font-medium text-slate-900 text-xs sm:text-sm">
                  {request.contacts.vatNumber}
                </div>
              </div>
            </div>

            {/* Sito web se presente */}
            {request.contacts.website && (
              <div className="flex items-start gap-3 p-2">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-600 shrink-0 border border-slate-200/80">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Sito Web Attuale</span>
                  <div className="font-medium text-slate-900 text-xs sm:text-sm">
                    {request.contacts.website}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => onProceedToQuote(request)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition-colors border border-slate-200"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Vedi Preventivo per questo Cliente ({request.quote.number})</span>
            </button>
          </div>
        </div>

        {/* Right Column (2 cols): Riepilogo della Richiesta & Note Cronologiche */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Riepilogo della Richiesta (richiesto esplicitamente dal prompt) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-slate-600" />
                  Riepilogo della Richiesta
                </h2>
                <span className="text-xs text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Briefing Progetto
                </span>
              </div>
              <span className="text-xs text-slate-500">
                Data acquisizione: {request.createdAt}
              </span>
            </div>

            {/* Description */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Obiettivo & Descrizione
              </span>
              <p className="text-sm text-slate-800 leading-relaxed">
                {request.summary.description}
              </p>
            </div>

            {/* Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block">Budget Indicativo</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {request.summary.estimatedBudget}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block">Canale di Contatto</span>
                <span className="text-sm font-semibold text-slate-800 mt-0.5 block">
                  {request.summary.channel}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block">Data Target / Scadenza</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {request.summary.targetDate}
                </span>
              </div>
            </div>

            {/* Requisiti e Funzionalità Chiave */}
            {request.summary.featuresNeeded && request.summary.featuresNeeded.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-700 mb-2 block">
                  Requisiti Tecnici Richiesti a M Solutions Web:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {request.summary.featuresNeeded.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section: Note e Diario di Bordo (richiesto esplicitamente dal prompt) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-600" />
                  Note del Briefing & Diario Attività
                </h2>
                <span className="text-xs text-slate-500">
                  ({request.notes.length} note registrate)
                </span>
              </div>
            </div>

            {/* Add Note Form (Interactive for live demo recording) */}
            <form onSubmit={handleCreateNote} className="mb-4">
              <div className="flex gap-2">
                <input
                  id="input-new-note"
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Aggiungi una nota al briefing (es. cliente richiede call di allineamento)..."
                  className="flex-1 text-xs sm:text-sm px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-hidden"
                />
                <button
                  id="btn-add-note-submit"
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shrink-0 shadow-2xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Aggiungi Nota</span>
                </button>
              </div>
            </form>

            {/* Notes List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {request.notes.map((note) => (
                <div key={note.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="font-semibold text-slate-900">{note.author}</span>
                    <span>{note.date}</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-normal">
                    {note.text}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
