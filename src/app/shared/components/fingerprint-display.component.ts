import { Component, input, output, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { ToastService } from '../../core/services/toast.service';
import { FingerprintFormatPipe } from '../pipes/fingerprint-format.pipe';

@Component({
  selector: 'app-fingerprint-display',
  standalone: true,
  imports: [FingerprintFormatPipe],
  template: `
    <div class="fingerprint-display">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <small class="text-muted fw-medium">Fingerprint</small>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-secondary" (click)="copyFingerprint()">
            <i class="bi bi-copy"></i>
          </button>
          <button class="btn btn-outline-secondary" (click)="downloadFingerprint()">
            <i class="bi bi-download"></i>
          </button>
        </div>
      </div>
      <code class="fingerprint">{{ fingerprint() | fingerprintFormat }}</code>
      <small class="text-muted d-block mt-2">{{ t('key.generate.fingerprintHint') }}</small>
    </div>
  `,
  styles: [`
    .fingerprint-display { padding: 1rem; background: rgba(52, 152, 219, 0.05); border-radius: 0.5rem; }
    .fingerprint { font-family: 'Fira Code', monospace; font-size: 0.9rem; letter-spacing: 0.1em; word-break: break-all; }
  `]
})
export class FingerprintDisplayComponent {
  private i18n = inject(I18nService);
  private toast = inject(ToastService);
  
  fingerprint = input.required<string>();
  copied = output<void>();

  get t() { return (key: string) => this.i18n.t(key); }

  async copyFingerprint() {
    await navigator.clipboard.writeText(this.fingerprint());
    this.toast.success(this.t('common.copied'));
    this.copied.emit();
  }

  downloadFingerprint() {
    const formatted = this.fingerprint();
    const date = new Date().toISOString().split('T')[0];
    const content = `PGP Fingerprint\n==============\n\n${formatted}\n\nGenerated: ${date}\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pgp-fingerprint-${date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast.success(this.t('common.downloaded'));
  }
}
