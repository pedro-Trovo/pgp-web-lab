import { Injectable, signal, computed } from '@angular/core';

export interface CryptoState {
  isProcessing: boolean;
  progress: number;
  lastResult: { success: boolean; data?: unknown; error?: string } | null;
}

@Injectable({ providedIn: 'root' })
export class CryptoStateService {
  private _state = signal<CryptoState>({
    isProcessing: false,
    progress: 0,
    lastResult: null
  });

  readonly isProcessing = computed(() => this._state().isProcessing);
  readonly progress = computed(() => this._state().progress);
  readonly lastResult = computed(() => this._state().lastResult);
  readonly hasError = computed(() => this._state().lastResult?.error !== undefined);
  readonly hasSuccess = computed(() => this._state().lastResult?.success === true);

  setProcessing(progress = 0): void {
    this._state.update(s => ({ ...s, isProcessing: true, progress }));
  }

  updateProgress(progress: number): void {
    this._state.update(s => ({ ...s, progress }));
  }

  setSuccess(data: unknown): void {
    this._state.set({ isProcessing: false, progress: 100, lastResult: { success: true, data } });
  }

  setError(error: string): void {
    this._state.set({ isProcessing: false, progress: 0, lastResult: { success: false, error } });
  }

  reset(): void {
    this._state.set({ isProcessing: false, progress: 0, lastResult: null });
  }
}
