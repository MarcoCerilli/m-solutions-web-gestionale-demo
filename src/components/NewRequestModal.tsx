import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Building2, User, Mail, Phone, MapPin, Globe, Euro, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ServiceRequest, RequestStatus } from '../types';
import { DEMO_PRESETS } from '../data/mockData';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newRequest: ServiceRequest) => void;
  isAutoFilling?: boolean;
}

export function NewRequestModal({ isOpen, onClose, onSubmit, isAutoFilling = false }: NewRequestModalProps) {
  const [clientName, setClientName] = useState('');
  const [serviceRequested, setServiceRequested] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [role, setRole] = useState('Titolare');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('Corso Sempione, 48');
  const [vatNumber, setVatNumber] = useState('IT09823410967');
  const [website, setWebsite] = useState('www.bellavista.it');
  const [estimatedBudget, setEstimatedBudget] = useState('€ 3.500');
  const [urgency, setUrgency] = useState<'Alta' | 'Media' | 'Pianificata'>('Alta');
  const [targetDate, setTargetDate] = useState('2026-10-31');
  const [initialNote, setInitialNote] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [autoTypingActive, setAutoTypingActive] = useState(false);

  // Initialize or reset when opened
  useEffect(() => {
    if (isOpen && !isAutoFilling) {
      setClientName('Ristorante Bellini & Sapori');
      setServiceRequested('Sviluppo Sito Web E-commerce & Prenotazioni Online');
      setContactPerson('Marco Bellini');
      setRole('Titolare');
      setEmail('m.bellini@bellinisapori.it');
      setPhone('+39 02 7890 1234');
      setCity('Milano (MI)');
      setAddress('Via Brera, 18');
      setVatNumber('IT09182736450');
      setWebsite('www.bellinisapori.it');
      setEstimatedBudget('€ 3.800');
      setUrgency('Alta');
      setTargetDate('2026-10-31');
      setInitialNote('Richiesta ricevuta tramite form contatti M Solutions Web. Il cliente necessita di rinnovare il sito con carrello degustazioni e modulo prenotazione.');
      setNextAction('Fissare call di briefing tecnico e inviare questionario');
    }
  }, [isOpen, isAutoFilling]);

  // Handle live auto-fill typing when Auto-Play mode is active
  useEffect(() => {
    if (!isOpen || !isAutoFilling) return;

    setAutoTypingActive(true);
    setClientName('');
    setServiceRequested('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setCity('');
    setNextAction('');
    setInitialNote('');

    const targetData = {
      name: 'Ristorante BellaVista Srl',
      service: 'Sito Web E-commerce & Prenotazione Tavoli',
      person: 'Marco Bellini',
      email: 'm.bellini@bellavista.it',
      phone: '+39 02 8945 1200',
      city: 'Milano (MI)',
      budget: '€ 3.500',
      action: 'Apertura scheda e calcolo preventivo',
      note: 'Cliente interessato a rifare il sito con prenotazione tavoli e catalogo degustazioni per M Solutions Web.'
    };

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step === 1) {
        setClientName(targetData.name);
      } else if (step === 2) {
        setServiceRequested(targetData.service);
      } else if (step === 3) {
        setContactPerson(targetData.person);
        setEmail(targetData.email);
        setPhone(targetData.phone);
        setCity(targetData.city);
        setEstimatedBudget(targetData.budget);
      } else if (step === 4) {
        setNextAction(targetData.action);
      } else if (step === 5) {
        setInitialNote(targetData.note);
      } else if (step >= 6) {
        clearInterval(interval);
        setAutoTypingActive(false);
        // Auto submit after a brief pause so viewer sees the filled form
        setTimeout(() => {
          submitWithValues(targetData);
        }, 700);
      }
    }, 280);

    return () => clearInterval(interval);
  }, [isOpen, isAutoFilling]);

  const submitWithValues = (customData?: {
    name: string;
    service: string;
    person: string;
    email: string;
    phone: string;
    city: string;
    budget: string;
    action: string;
    note: string;
  }) => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newReqId = `req-${Date.now()}`;
    const newQuoteId = `q-${Date.now()}`;

    const cName = customData?.name || clientName.trim() || 'Nuovo Cliente Demo';
    const sRequested = customData?.service || serviceRequested.trim() || 'Servizio Web & Software';

    const newRequest: ServiceRequest = {
      id: newReqId,
      code: `MSW-2026-${randomNum}`,
      clientName: cName,
      serviceRequested: sRequested,
      status: 'nuova' as RequestStatus,
      nextAction: customData?.action || nextAction.trim() || 'Apertura scheda e contatto cliente',
      nextActionDate: 'Oggi, entro le 17:00',
      createdAt: new Date().toISOString().split('T')[0],
      contacts: {
        contactPerson: customData?.person || contactPerson.trim() || 'Marco Bellini',
        role: role.trim() || 'Titolare',
        email: customData?.email || email.trim() || 'm.bellini@bellavista.it',
        phone: customData?.phone || phone.trim() || '+39 02 8945 1200',
        address: address.trim() || 'Corso Sempione, 48',
        city: customData?.city || city.trim() || 'Milano (MI)',
        vatNumber: vatNumber.trim() || 'IT09823410967',
        website: website.trim() || 'www.bellavista.it'
      },
      notes: [
        {
          id: `note-${Date.now()}`,
          text: customData?.note || initialNote.trim() || 'Nuova richiesta registrata nel gestionale M Solutions Web.',
          author: 'Team M Solutions Web',
          date: 'Oggi, ' + new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
          type: 'briefing'
        }
      ],
      summary: {
        description: customData?.note || initialNote.trim() || 'Richiesta di sviluppo web e consulenza digitale.',
        channel: 'Sito Web (Form M Solutions Web)',
        estimatedBudget: customData?.budget || estimatedBudget || '€ 3.500',
        urgency: urgency,
        targetDate: targetDate || 'Entro 30 giorni',
        featuresNeeded: [
          'Architettura responsive mobile-first',
          'Modulo prenotazione diretta tavoli online',
          'Catalogo degustazioni e menù dinamico',
          'Ottimizzazione SEO locale Milano e Core Web Vitals'
        ]
      },
      quote: {
        id: newQuoteId,
        number: `PREV-2026/${randomNum}`,
        date: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'bozza',
        paymentTerms: '40% acconto, 30% consegna beta, 30% al saldo',
        deliveryTime: '20 giorni lavorativi',
        notes: 'Preventivo indicativo elaborato da M Solutions Web. Include garanzia e supporto tecnico 90 giorni.',
        items: [
          {
            id: `qi-${Date.now()}-1`,
            description: `Progettazione UI/UX su misura e mockup per ${cName}`,
            category: 'Design',
            quantity: 1,
            unitPrice: 850,
            vatRate: 22
          },
          {
            id: `qi-${Date.now()}-2`,
            description: `Sviluppo Frontend e Backend per ${sRequested}`,
            category: 'Sviluppo',
            quantity: 1,
            unitPrice: 1950,
            vatRate: 22
          },
          {
            id: `qi-${Date.now()}-3`,
            description: 'Ottimizzazione SEO on-page, performance Core Web Vitals e sicurezza SSL',
            category: 'SEO & Sicurezza',
            quantity: 1,
            unitPrice: 400,
            vatRate: 22
          }
        ]
      }
    };

    onSubmit(newRequest);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitWithValues();
  };

  const handleApplyPreset = (index: number) => {
    if (index === 0) {
      setClientName('Ottica Visione Moderna Srl');
      setServiceRequested('Portale E-commerce Occhiali & Prenotazione Visite');
      setContactPerson('Laura Ferri');
      setRole('Titolare');
      setEmail('l.ferri@visionemoderna.it');
      setPhone('+39 02 7788 9911');
      setAddress('Via Manzoni, 15');
      setCity('Milano (MI)');
      setEstimatedBudget('€ 4.200');
      setInitialNote('Richiesta integrazione catalogo montature e prenotazione visite optometriche.');
      setNextAction('Apertura scheda e calcolo preventivo');
    } else {
      setClientName('Palestra & Fitness Olympic');
      setServiceRequested('Gestionale Abbonamenti & App Web');
      setContactPerson('Roberto Conti');
      setRole('Direttore Sportivo');
      setEmail('r.conti@olympicfitness.it');
      setPhone('+39 02 4455 6677');
      setAddress('Via Torino, 88');
      setCity('Milano (MI)');
      setEstimatedBudget('€ 5.000');
      setInitialNote('Necessaria area riservata per prenotazione corsi e rinnovo badge online.');
      setNextAction('Apertura scheda e calcolo preventivo');
    }
  };

  // Listen to Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      id="new-request-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <div id="new-request-modal-content" className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Passo 1 del Percorso Demo
              </span>
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Demo Dimostrativa
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Inserisci Nuova Richiesta Lead
            </h2>
            <p className="text-xs text-slate-500">
              Registra i dettagli del cliente per M Solutions Web prima di aprire la scheda.
            </p>
          </div>
          <button
            id="close-new-request-modal-x-btn"
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Chiudi modale (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auto-Typing notification banner during Auto-Play */}
        {isAutoFilling && (
          <div className="mt-3 p-2.5 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between animate-pulse">
            <span className="flex items-center gap-2 font-medium">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              {autoTypingActive ? 'Autocompilazione campi in corso per la demo...' : 'Dati compilati con successo! Salvataggio...'}
            </span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
              Auto-Play Demo
            </span>
          </div>
        )}

        {/* Quick Fill Demo Presets (ideal for quick recording without typing) */}
        <div className="my-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-500" />
              Compilazione Rapida per Registrazione Video (1-Click):
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              id="preset-btn-bellini"
              onClick={() => {
                setClientName('Ristorante BellaVista Srl');
                setServiceRequested('Sito E-commerce & Prenotazione Tavoli');
                setContactPerson('Marco Bellini');
                setEmail('m.bellini@bellavista.it');
                setPhone('+39 02 8945 1200');
                setCity('Milano (MI)');
                setEstimatedBudget('€ 3.500');
                setInitialNote('Cliente interessato a rifare sito con carrello degustazioni e booking tavoli.');
                setNextAction('Apertura scheda e calcolo preventivo');
              }}
              className="px-2.5 py-1 text-xs font-medium bg-white hover:bg-slate-900 hover:text-white text-slate-800 rounded-lg border border-slate-200 shadow-2xs transition-all"
            >
              🍽️ Ristorante BellaVista
            </button>
            <button
              type="button"
              id="preset-btn-ottica"
              onClick={() => handleApplyPreset(0)}
              className="px-2.5 py-1 text-xs font-medium bg-white hover:bg-slate-900 hover:text-white text-slate-800 rounded-lg border border-slate-200 shadow-2xs transition-all"
            >
              👓 Ottica Visione Moderna
            </button>
            <button
              type="button"
              id="preset-btn-fitness"
              onClick={() => handleApplyPreset(1)}
              className="px-2.5 py-1 text-xs font-medium bg-white hover:bg-slate-900 hover:text-white text-slate-800 rounded-lg border border-slate-200 shadow-2xs transition-all"
            >
              🏋️ Palestra & Fitness Olympic
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Ragione Sociale */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nome Cliente / Azienda *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="input-client-name"
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="es. Ristorante BellaVista"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-hidden"
                />
              </div>
            </div>

            {/* Servizio Richiesto */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Servizio Richiesto *
              </label>
              <input
                id="input-service-requested"
                type="text"
                required
                value={serviceRequested}
                onChange={(e) => setServiceRequested(e.target.value)}
                placeholder="es. Sviluppo Sito Web E-commerce"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Referente */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nome Referente
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="input-contact-person"
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="es. Marco Bellini"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email di Contatto
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="input-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m.bellini@azienda.it"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
                />
              </div>
            </div>

            {/* Telefono */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Telefono
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="input-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+39 02 1234 567"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Città */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Città / Sede
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="input-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Milano (MI)"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
                />
              </div>
            </div>

            {/* Budget Stimato */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Budget Stimato
              </label>
              <div className="relative">
                <Euro className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="input-budget"
                  type="text"
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(e.target.value)}
                  placeholder="€ 3.500"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
                />
              </div>
            </div>

            {/* Urgenza */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Priorità
              </label>
              <select
                id="select-urgency"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden bg-white"
              >
                <option value="Alta">Alta (Entro 30 gg)</option>
                <option value="Media">Media (Entro 60 gg)</option>
                <option value="Pianificata">Pianificata Q4</option>
              </select>
            </div>
          </div>

          {/* Prossima azione (richiesto dal prompt) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Prossima Azione Immediata *
            </label>
            <input
              id="input-next-action"
              type="text"
              required
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="es. Fissare call di briefing o preparare bozza preventivo"
              className="w-full px-3 py-2 text-sm font-medium border border-slate-300 bg-slate-50/70 rounded-lg focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-hidden"
            />
          </div>

          {/* Note Iniziali / Riepilogo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Note del Briefing Iniziale
            </label>
            <textarea
              id="textarea-initial-note"
              rows={2}
              value={initialNote}
              onChange={(e) => setInitialNote(e.target.value)}
              placeholder="Dettagli e requisiti discussi con il cliente..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-hidden resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Annulla
            </button>
            <button
              id="submit-new-request-btn"
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-xl shadow-xs transition-all"
            >
              <span>Salva e Apri Scheda Cliente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
