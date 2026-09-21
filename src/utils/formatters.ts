import { RequestStatus, QuoteStatus } from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  } catch {
    return dateString;
  }
}

export function getRequestStatusConfig(status: RequestStatus): {
  label: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  dotColor: string;
} {
  switch (status) {
    case 'nuova':
      return {
        label: 'Nuova Richiesta',
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-800',
        borderColor: 'border-slate-300',
        dotColor: 'bg-blue-600'
      };
    case 'in_valutazione':
      return {
        label: 'In Valutazione',
        badgeBg: 'bg-blue-50',
        badgeText: 'text-blue-900',
        borderColor: 'border-blue-200',
        dotColor: 'bg-blue-600'
      };
    case 'preventivo_bozza':
      return {
        label: 'Preventivo in Bozza',
        badgeBg: 'bg-amber-50',
        badgeText: 'text-amber-900',
        borderColor: 'border-amber-200',
        dotColor: 'bg-amber-600'
      };
    case 'preventivo_inviato':
      return {
        label: 'Preventivo Inviato',
        badgeBg: 'bg-sky-50',
        badgeText: 'text-sky-900',
        borderColor: 'border-sky-200',
        dotColor: 'bg-sky-600'
      };
    case 'accettato':
      return {
        label: 'Accettato & Confermato',
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-900',
        borderColor: 'border-emerald-200',
        dotColor: 'bg-emerald-600'
      };
    case 'completato':
      return {
        label: 'Completato',
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-800',
        borderColor: 'border-slate-200',
        dotColor: 'bg-slate-600'
      };
    default:
      return {
        label: status,
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-800',
        borderColor: 'border-slate-200',
        dotColor: 'bg-slate-400'
      };
  }
}

export function getQuoteStatusConfig(status: QuoteStatus): {
  label: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  description: string;
} {
  switch (status) {
    case 'bozza':
      return {
        label: 'Bozza Interna',
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-800',
        borderColor: 'border-slate-300',
        description: 'Preventivo in fase di redazione e calcolo voci di spesa'
      };
    case 'inviato':
      return {
        label: 'Inviato al Cliente',
        badgeBg: 'bg-blue-50',
        badgeText: 'text-blue-900',
        borderColor: 'border-blue-200',
        description: 'Documento trasmesso al cliente, in attesa di approvazione'
      };
    case 'accettato':
      return {
        label: 'Accettato & Firmato',
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-900',
        borderColor: 'border-emerald-200',
        description: 'Proposta approvata formalmente: commessa pronta per lo sviluppo'
      };
    default:
      return {
        label: status,
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-800',
        borderColor: 'border-slate-200',
        description: ''
      };
  }
}
