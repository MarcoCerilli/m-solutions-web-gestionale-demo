/**
 * Screen Recorder Service
 * Uses browser MediaRecorder and navigator.mediaDevices.getDisplayMedia
 * to capture screen/tab and auto-download the resulting video.
 */

export interface ScreenRecorderState {
  isRecording: boolean;
  durationSeconds: number;
  error: string | null;
}

export class ScreenRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private timerInterval: number | null = null;

  /**
   * Request tab/screen media stream and start recording
   */
  async startRecording(
    onTick?: (seconds: number) => void,
    onStopCallback?: (blob: Blob, url: string) => void
  ): Promise<boolean> {
    try {
      this.recordedChunks = [];

      // Check support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('Il tuo browser non supporta la registrazione schermo nativa (getDisplayMedia).');
      }

      // Request display stream (preferably current tab)
      this.stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser',
          frameRate: { ideal: 30, max: 60 }
        } as MediaTrackConstraints,
        audio: false
      });

      // Handle user stopping stream manually from browser UI
      this.stream.getVideoTracks()[0].onended = () => {
        this.stopRecording();
      };

      // Determine supported mime type
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4'
      ];
      const selectedMime = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || '';

      this.mediaRecorder = new MediaRecorder(this.stream, selectedMime ? { mimeType: selectedMime } : undefined);

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
        }

        const mime = this.mediaRecorder?.mimeType || 'video/webm';
        const blob = new Blob(this.recordedChunks, { type: mime });
        const videoUrl = URL.createObjectURL(blob);

        if (onStopCallback) {
          onStopCallback(blob, videoUrl);
        }

        // Clean up tracks
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = null;
        }
      };

      // Start recording
      this.mediaRecorder.start(1000); // chunk every 1 sec

      let seconds = 0;
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = window.setInterval(() => {
        seconds += 1;
        if (onTick) onTick(seconds);
      }, 1000);

      return true;
    } catch (err: unknown) {
      console.warn('Errore avvio registrazione schermo:', err);
      if (this.stream) {
        this.stream.getTracks().forEach(t => t.stop());
        this.stream = null;
      }
      return false;
    }
  }

  /**
   * Stop recording
   */
  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
  }

  /**
   * Trigger automatic file download in browser
   */
  downloadVideo(blob: Blob, filename = 'Demo_M_Solutions_Web_Gestionale.webm'): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 200);
  }

  isRecording(): boolean {
    return this.mediaRecorder !== null && this.mediaRecorder.state === 'recording';
  }
}

export const globalScreenRecorder = new ScreenRecorder();
