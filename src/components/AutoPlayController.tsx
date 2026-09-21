import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Video, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { globalScreenRecorder } from '../services/screenRecorder';
import { ServiceRequest, QuoteStatus } from '../types';

interface AutoPlayControllerProps {
  requests: ServiceRequest[];
  triggerAutoPlay?: { timestamp: number; recordVideo: boolean } | null;
  onStateUpdate?: (state: {
    isPlaying: boolean;
    isRecordingVideo: boolean;
    recDuration: number;
    currentNarrative: string;
    isPaused: boolean;
  }) => void;
  onStartNewRequestWithAutoFill: () => void;
  onTriggerAutoTypeNote: (noteText: string) => void;
  onOpenQuote: (req: ServiceRequest) => void;
  onUpdateQuoteStatus: (requestId: string, status: QuoteStatus) => void;
  onStopSimulationRef?: React.MutableRefObject<(() => void) | null>;
  onPauseToggleRef?: React.MutableRefObject<(() => void) | null>;
}

export function AutoPlayController({
  requests,
  triggerAutoPlay,
  onStateUpdate,
  onStartNewRequestWithAutoFill,
  onTriggerAutoTypeNote,
  onOpenQuote,
  onUpdateQuoteStatus,
  onStopSimulationRef,
  onPauseToggleRef
}: AutoPlayControllerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState<boolean>(false);
  const [recDuration, setRecDuration] = useState<number>(0);
  const [speed] = useState<number>(1);
  const [currentNarrative, setCurrentNarrative] = useState<string>('');
  const [countdownNum, setCountdownNum] = useState<number>(3);
  const [lastRecordedBlob, setLastRecordedBlob] = useState<Blob | null>(null);
  const [completedModalOpen, setCompletedModalOpen] = useState<boolean>(false);
  const [recordingErrorModalOpen, setRecordingErrorModalOpen] = useState<boolean>(false);
  const [recordingErrorMessage, setRecordingErrorMessage] = useState<string>('');
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number; visible: boolean; clicking: boolean }>({
    x: 0,
    y: 0,
    visible: false,
    clicking: false
  });

  const isPausedRef = useRef<boolean>(false);
  const cancelRequestedRef = useRef<boolean>(false);
  const latestRequestsRef = useRef<ServiceRequest[]>(requests);

  useEffect(() => {
    latestRequestsRef.current = requests;
  }, [requests]);

  // Sync state with parent (WalkthroughGuide header)
  useEffect(() => {
    if (onStateUpdate) {
      onStateUpdate({
        isPlaying,
        isRecordingVideo,
        recDuration,
        currentNarrative,
        isPaused: isPausedRef.current
      });
    }
  }, [isPlaying, isRecordingVideo, recDuration, currentNarrative, onStateUpdate]);

  // Helper sleep that respects pause and cancel
  const sleep = (ms: number): Promise<void> => {
    const adjustedMs = ms / speed;
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        if (cancelRequestedRef.current) {
          reject(new Error('Simulation cancelled'));
          return;
        }
        if (!isPausedRef.current) {
          if (Date.now() - start >= adjustedMs) {
            resolve();
            return;
          }
        }
        requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
    });
  };

  // Move virtual cursor to element or coordinates
  const moveCursorTo = async (selectorOrPos: string | { x: number; y: number }, click = true) => {
    try {
      let targetX = 0;
      let targetY = 0;

      if (typeof selectorOrPos === 'string') {
        const el = document.querySelector(selectorOrPos);
        if (el) {
          const rect = el.getBoundingClientRect();
          targetX = rect.left + rect.width / 2;
          targetY = rect.top + rect.height / 2;
        } else {
          return;
        }
      } else {
        targetX = selectorOrPos.x;
        targetY = selectorOrPos.y;
      }

      setCursorPos({
        x: targetX,
        y: targetY,
        visible: true,
        clicking: false
      });

      await sleep(400);

      if (click) {
        setCursorPos(prev => ({ ...prev, clicking: true }));
        await sleep(150);
        setCursorPos(prev => ({ ...prev, clicking: false }));
      }
    } catch {
      // ignore
    }
  };

  const handlePauseToggle = () => {
    isPausedRef.current = !isPausedRef.current;
    if (onStateUpdate) {
      onStateUpdate({
        isPlaying,
        isRecordingVideo,
        recDuration,
        currentNarrative,
        isPaused: isPausedRef.current
      });
    }
  };

  const handleStop = () => {
    cancelRequestedRef.current = true;
    setIsPlaying(false);
    if (globalScreenRecorder.isRecording()) {
      globalScreenRecorder.stopRecording();
    }
    setIsRecordingVideo(false);
    setCursorPos(prev => ({ ...prev, visible: false }));
    setCurrentNarrative('Auto-play interrotto.');
  };

  if (onStopSimulationRef) {
    onStopSimulationRef.current = handleStop;
  }
  if (onPauseToggleRef) {
    onPauseToggleRef.current = handlePauseToggle;
  }

  // Trigger from outside
  useEffect(() => {
    if (triggerAutoPlay && triggerAutoPlay.timestamp > 0 && !isPlaying) {
      runSimulation(triggerAutoPlay.recordVideo);
    }
  }, [triggerAutoPlay]);

  // Run the full automated sequence
  const runSimulation = async (recordVideo: boolean) => {
    cancelRequestedRef.current = false;
    isPausedRef.current = false;
    setIsPlaying(true);
    setLastRecordedBlob(null);

    // 1. If video recording is requested, trigger browser capture first
    if (recordVideo) {
      setCurrentNarrative('Seleziona la scheda del browser da registrare...');
      const started = await globalScreenRecorder.startRecording(
        (sec) => setRecDuration(sec),
        (blob) => {
          setLastRecordedBlob(blob);
          globalScreenRecorder.downloadVideo(blob, 'Demo_M_Solutions_Web_Gestionale.webm');
        }
      );

      if (!started) {
        setIsRecordingVideo(false);
        setIsPlaying(false);
        setRecordingErrorMessage(
          'La registrazione video dello schermo richiede l\'autorizzazione del browser o l\'apertura in una nuova scheda indipendente.'
        );
        setRecordingErrorModalOpen(true);
        return;
      } else {
        setIsRecordingVideo(true);
      }
    }

    try {
      // 2. Countdown phase (clean start for video)
      for (let i = 3; i >= 1; i--) {
        setCountdownNum(i);
        setCurrentNarrative(`Avvio demo dimostrativa tra ${i}...`);
        await sleep(1000);
      }

      // 3. STEP 1: Nuova Richiesta Lead (Autocompilazione Visibile dei campi)
      setCurrentNarrative('Passo 1/4: Apertura modale e autocompilazione richiesta per "Ristorante BellaVista Srl"...');
      
      // Move cursor to "Nuova Richiesta" button
      await moveCursorTo('#header-new-request-btn', true);
      onStartNewRequestWithAutoFill();

      // Wait while NewRequestModal types all fields and submits automatically
      await sleep(3400);

      // Identify the freshly created request (or the first one in list)
      const currentList = latestRequestsRef.current;
      const targetReq = currentList[0] || requests[0];
      const targetId = targetReq?.id || 'req-auto';

      // 4. STEP 2: Apertura Scheda Cliente & Aggiunta Nota
      setCurrentNarrative('Passo 2/4: Apertura Scheda Cliente, verifica dati e inserimento nota al briefing...');
      await sleep(1500);

      // Move cursor down to note input field
      await moveCursorTo('#input-new-note', false);
      setCurrentNarrative('Digitazione nota operativa al briefing del cliente...');
      
      // Trigger character-by-character note typing in ClientDetailScreen
      onTriggerAutoTypeNote('Briefing conoscitivo completato: confermata integrazione modulo booking tavoli e catalogo degustazioni.');
      
      // Wait for note typing and submission
      await sleep(2800);

      // Move cursor to "Passa al Preventivo" button
      setCurrentNarrative('Passo 2 completato! Apertura del preventivo collegato...');
      await moveCursorTo('#btn-go-to-quote-step3', true);
      onOpenQuote(targetReq);
      await sleep(1500);

      // 5. STEP 3: Preparazione Preventivo
      setCurrentNarrative('Passo 3/4: Revisione voci di spesa, subtotale e calcolo preventivo (€ 3.904,00)...');
      await sleep(2400);

      // 6. STEP 4: Aggiornamento Stato Preventivo
      setCurrentNarrative('Passo 4/4: Invio del preventivo al cliente (da Bozza a INVIATO)...');
      await moveCursorTo('#btn-set-status-inviato', true);
      onUpdateQuoteStatus(targetId, 'inviato');
      await sleep(2200);

      setCurrentNarrative('Cliente accetta la proposta: Aggiornamento stato a "ACCETTATO & CONFERMATO"...');
      await moveCursorTo('#btn-set-status-accettato', true);
      onUpdateQuoteStatus(targetId, 'accettato');
      await sleep(2400);

      // 7. COMPLETION
      setCursorPos(prev => ({ ...prev, visible: false }));
      setCurrentNarrative('🎉 Demo completata con successo! Il flusso in 4 passi è stato eseguito.');

      if (globalScreenRecorder.isRecording()) {
        globalScreenRecorder.stopRecording();
      }
      setIsRecordingVideo(false);
      setIsPlaying(false);
      setCompletedModalOpen(true);

    } catch (err: unknown) {
      console.log('Simulation stopped or interrupted:', err);
      setIsPlaying(false);
      setIsRecordingVideo(false);
      setCursorPos(prev => ({ ...prev, visible: false }));
      if (globalScreenRecorder.isRecording()) {
        globalScreenRecorder.stopRecording();
      }
    }
  };

  return (
    <>
      {/* 1. Animated Virtual Cursor (Smooth realistic pointer for recording) */}
      {cursorPos.visible && (
        <div
          id="auto-play-virtual-cursor"
          className="fixed pointer-events-none z-50 transition-all duration-300 ease-out"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            transform: 'translate(-30%, -30%)'
          }}
        >
          <div className="relative">
            <svg
              className={`w-7 h-7 drop-shadow-lg transition-transform duration-150 ${
                cursorPos.clicking ? 'scale-75 text-slate-900 fill-slate-900' : 'text-slate-900 fill-slate-900'
              }`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4 0l16 12.279-6.951 1.17 4.325 8.817-3.596 1.734-4.35-8.879-5.428 5.428v-20.549z" />
            </svg>
            {cursorPos.clicking && (
              <span className="absolute -top-1 -left-1 w-9 h-9 rounded-full bg-slate-900/30 animate-ping" />
            )}
          </div>
        </div>
      )}

      {/* 2. Subtitle Bar during playback for video viewer clarity */}
      {isPlaying && currentNarrative && (
        <div
          id="auto-play-subtitle-bar"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 text-white px-5 py-2.5 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-3 max-w-2xl text-center"
        >
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-spin" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide">
            {currentNarrative}
          </span>
        </div>
      )}

      {/* 3. Countdown Overlay when recording starts */}
      {isPlaying && currentNarrative.includes('Avvio demo dimostrativa tra') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs">
          <div className="text-center">
            <div className="w-24 h-24 rounded-3xl bg-slate-900 text-white border-2 border-slate-700 flex items-center justify-center text-5xl font-black shadow-2xl mx-auto mb-3 animate-bounce">
              {countdownNum}
            </div>
            <p className="text-sm font-semibold text-slate-200">
              Avvio sequenza automatica in corso...
            </p>
          </div>
        </div>
      )}

      {/* 4. Completed Modal with video download */}
      {completedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Flusso Demo Registrato con Successo!
            </h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Tutti i 4 passi (Nuova Richiesta, Scheda Cliente, Preventivo, Stato Accettato) sono stati eseguiti e compilati automaticamente.
            </p>

            {lastRecordedBlob ? (
              <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-left">
                <div className="flex items-center justify-between text-xs text-slate-700 mb-1">
                  <span className="font-semibold">File Video Generato:</span>
                  <span className="text-slate-500">{(lastRecordedBlob.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Il download del file video <strong>Demo_M_Solutions_Web_Gestionale.webm</strong> è stato avviato automaticamente nel tuo browser.
                </p>
                <button
                  onClick={() => globalScreenRecorder.downloadVideo(lastRecordedBlob, 'Demo_M_Solutions_Web_Gestionale.webm')}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Scarica Video Manualmente</span>
                </button>
              </div>
            ) : (
              <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                La simulazione visiva è terminata. Puoi avviarla di nuovo o scegliere di registrare il video tramite il pulsante in alto.
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCompletedModalOpen(false)}
                className="flex-1 py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Permission / Iframe Error Dialog with Direct Solution */}
      {recordingErrorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2">
              Come registrare e scaricare il video
            </h3>
            
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              La registrazione video dello schermo del computer è una funzionalità sicura del browser che viene limitata all'interno dei riquadri di anteprima (iframe).
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-5 space-y-2 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                <span>Clicca su <strong>"Apri in Nuova Scheda"</strong> qui sotto per aprire l'app a schermo intero nel tuo browser.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                <span>Clicca su <strong>"🎥 Registra Video"</strong> e seleziona la scheda per avviare il flusso.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                <span>Al termine, il file video <strong>.webm</strong> verrà scaricato direttamente nella tua cartella Download!</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setRecordingErrorModalOpen(false);
                  window.open(window.location.href, '_blank');
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Apri in Nuova Scheda e Registra</span>
              </button>
              <button
                type="button"
                onClick={() => setRecordingErrorModalOpen(false)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
