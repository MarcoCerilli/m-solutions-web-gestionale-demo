import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  ShieldCheck, 
  Zap, 
  Server, 
  TrendingUp, 
  Send, 
  Building2, 
  Lock,
  Database,
  CheckCircle2
} from 'lucide-react';
import { ConfigModuleOption } from '../types';
import { CONFIG_MODULES } from '../data/mockData';

interface CustomConfiguratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const CustomConfiguratorModal: React.FC<CustomConfiguratorModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>(() => 
    CONFIG_MODULES.filter(m => m.defaultSelected).map(m => m.id)
  );

  const [contactData, setContactData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    employeesCount: '5-20 dipendenti',
    currentSoftware: 'Fogli Excel / Software obsoleto',
    notes: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleModule = (id: string) => {
    setSelectedModuleIds(prev => 
      prev.includes(id) 
        ? prev.filter(mId => mId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.companyName || !contactData.email) {
      onShowToast('Inserisci almeno Ragione Sociale ed Email aziendale.');
      return;
    }
    setIsSubmitted(true);
    onShowToast('Richiesta inviata a Marco Cerilli • M Solutions Web!');
  };

  const selectedModules = CONFIG_MODULES.filter(m => selectedModuleIds.includes(m.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Header Modale */}
        <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white relative">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Configuratore Software Sartoriale • M Solutions Web</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Componi il Gestionale Cucito su Misura per la tua Azienda
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Seleziona i moduli di cui hai realmente bisogno. Elimina le funzioni inutili e i canoni mensili a utente 
                delle piattaforme preconfezionate: ricevi un software proprietario veloce, sicuro e scalabile.
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corpo Configuratore */}
        {!isSubmitted ? (
          <div className="p-6 sm:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
            
            {/* 1. Selezione Moduli */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    1. Moduli Funzionali Disponibili
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clicca sui blocchi per includere o escludere i moduli dalla tua configurazione
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  {selectedModuleIds.length} Moduli Selezionati
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {CONFIG_MODULES.map((mod) => {
                  const isSelected = selectedModuleIds.includes(mod.id);
                  return (
                    <div
                      key={mod.id}
                      onClick={() => toggleModule(mod.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-600' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {mod.category}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 mt-0.5">{mod.name}</h4>
                          <p className="text-xs font-semibold text-indigo-700 mt-1">{mod.tagline}</p>
                          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{mod.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-1 transition-colors ${
                          isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-3" />}
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100/80 text-[11px] text-slate-500 flex items-center gap-1">
                        <span className="font-medium text-slate-700">Consigliato:</span>
                        <span className="truncate">{mod.recommendedFor}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Confronto Software su Misura vs Piattaforme Standard */}
            <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Perché un Gestionale su Misura con M Solutions Web?</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    €
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm mt-2">Zero Canoni per Utente</h5>
                  <p className="text-slate-500 leading-relaxed">
                    Nessun abbonamento da 40€ - 120€/mese per ogni collaboratore aggiunto. Il software è tuo e puoi avere utenti illimitati.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm mt-2">Flussi 100% Personalizzati</h5>
                  <p className="text-slate-500 leading-relaxed">
                    Non devi adattare la tua azienda a campi rigidi di altri software. Il gestionale viene programmato attorno al tuo reale metodo di lavoro.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Database className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm mt-2">Dati & Codice di Proprietà</h5>
                  <p className="text-slate-500 leading-relaxed">
                    PostgreSQL dedicato, backup automatici quotidiani e codice sorgente completo in Next.js / TypeScript. Massima sicurezza GDPR.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Modulo Contatto e Richiesta Consulenza */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                2. Richiedi una Valutazione di Fattibilità & Preventivo Personalizzato
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Invieremo un'analisi tecnica preliminare e una proposta di sviluppo adatta al tuo volume aziendale.
              </p>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ragione Sociale Azienda *</label>
                  <input
                    type="text"
                    placeholder="es. Officine Meccaniche Rossi Srl"
                    value={contactData.companyName}
                    onChange={(e) => setContactData({ ...contactData, companyName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Referente / Ruolo</label>
                  <input
                    type="text"
                    placeholder="es. Mario Rossi (Titolare)"
                    value={contactData.contactPerson}
                    onChange={(e) => setContactData({ ...contactData, contactPerson: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Aziendale *</label>
                  <input
                    type="email"
                    placeholder="mario.rossi@azienda.it"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Telefono / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+39 340 1234567"
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dimensione Aziendale</label>
                  <select
                    value={contactData.employeesCount}
                    onChange={(e) => setContactData({ ...contactData, employeesCount: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="1-4 dipendenti">1-4 collaboratori / Studio Professionale</option>
                    <option value="5-20 dipendenti">5-20 dipendenti (Piccola Impresa)</option>
                    <option value="20-50 dipendenti">20-50 dipendenti (Media Impresa)</option>
                    <option value="50+ dipendenti">Oltre 50 dipendenti</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cosa utilizzate attualmente?</label>
                  <input
                    type="text"
                    value={contactData.currentSoftware}
                    onChange={(e) => setContactData({ ...contactData, currentSoftware: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Dettagli o Esigenze Specifiche</label>
                  <textarea
                    rows={2}
                    placeholder="Descrivi particolari procedure, integrazioni con altri macchinari o software..."
                    value={contactData.notes}
                    onChange={(e) => setContactData({ ...contactData, notes: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2 pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Dati trattati nel rispetto del GDPR da M Solutions Web. Nessun costo o vincolo.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Invia Richiesta Progetto a M Solutions Web</span>
                  </button>
                </div>
              </form>
            </div>

          </div>
        ) : (
          /* Messaggio di Ringraziamento / Conferma */
          <div className="p-8 sm:p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Grazie {contactData.contactPerson || contactData.companyName}!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              La tua configurazione con <strong>{selectedModules.length} moduli</strong> è stata registrata. 
              <strong> Marco Cerilli (M Solutions Web)</strong> analizzerà le tue specifiche e ti risponderà 
              all'indirizzo <strong>{contactData.email}</strong> entro 24 ore con una proposta su misura.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
              >
                Torna alla Demo
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
