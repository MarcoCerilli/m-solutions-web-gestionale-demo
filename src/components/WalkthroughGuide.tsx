import { Play, Pause, Square, Video, Sparkles, ExternalLink } from 'lucide-react';

interface WalkthroughGuideProps {
  isPlaying: boolean;
  isRecordingVideo: boolean;
  recDuration: number;
  currentNarrative: string;
  isPaused: boolean;
  onStartAutoPlay: (recordVideo: boolean) => void;
  onPauseToggle: () => void;
  onStop: () => void;
}

export function WalkthroughGuide({
  isPlaying,
  isRecordingVideo,
  recDuration,
  currentNarrative,
  isPaused,
  onStartAutoPlay,
  onPauseToggle,
  onStop
}: WalkthroughGuideProps) {
  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const openInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div id="walkthrough-guide-banner" className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        {/* Left: Brand Context / Live Demo Sequence */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shrink-0">
            {isPlaying ? (
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                M Solutions Web
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded font-medium">
                Demo Dimostrativa
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {isPlaying && currentNarrative ? (
                <span className="font-semibold text-white animate-pulse">
                  {currentNarrative}
                </span>
              ) : (
                <span>
                  Flusso automatico: <strong className="text-white">Nuova Richiesta → Scheda Cliente → Preventivo → Aggiornamento Stato</strong>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right: ONLY Auto-Play buttons for the automated demo recording */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          {!isPlaying ? (
            <>
              {/* Simple Auto-Play */}
              <button
                id="guide-btn-autoplay"
                onClick={() => onStartAutoPlay(false)}
                title="Avvia l'autocompilazione dimostrativa dei 4 passi su schermo"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors active:scale-95 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Auto-Play Demo</span>
              </button>

              {/* Auto-Play with Screen Recording & Video Download */}
              <button
                id="guide-btn-record"
                onClick={() => onStartAutoPlay(true)}
                title="Registra lo schermo ed esegue l'autocompilazione con download del video al termine"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Registra Video</span>
              </button>

              {/* Open in new tab helper if embedded in iframe */}
              {isInIframe && (
                <button
                  id="guide-btn-open-tab"
                  onClick={openInNewTab}
                  title="Apri in una nuova scheda del browser per abilitare senza restrizioni la cattura dello schermo"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Nuova Scheda</span>
                </button>
              )}
            </>
          ) : (
            /* Controls during execution */
            <div className="flex items-center gap-2">
              {isRecordingVideo && (
                <div className="flex items-center gap-1.5 bg-red-600/30 text-red-400 border border-red-500/50 px-2.5 py-1 rounded-lg text-xs font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>REC {formatTime(recDuration)}</span>
                </div>
              )}

              <button
                id="guide-btn-pause"
                onClick={onPauseToggle}
                className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{isPaused ? 'Riprendi' : 'Pausa'}</span>
              </button>

              <button
                id="guide-btn-stop"
                onClick={onStop}
                className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-red-900/80 text-red-400 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Interrompi</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
