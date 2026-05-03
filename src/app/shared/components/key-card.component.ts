import { Component, input, output, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { FingerprintFormatPipe } from '../pipes/fingerprint-format.pipe';

@Component({
  selector: 'app-key-card',
  standalone: true,
  imports: [FingerprintFormatPipe],
  template: `
    <div class="key-card">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h5 class="mb-1">{{ key().name || t('key.card.unknown') }}</h5>
          <p class="text-muted mb-0 small">{{ key().email }}</p>
        </div>
        <span class="badge bg-secondary badge-key">{{ key().type === 'public' ? t('key.card.public') : t('key.card.private') }}</span>
      </div>
      
      @if (key().fingerprint) {
        <div class="mb-3">
          <small class="text-muted">{{ t('key.stored.fingerprint') }}:</small>
          <code class="fingerprint d-block mt-1">{{ key().fingerprint | fingerprintFormat }}</code>
        </div>
      }

      @if (key().armored) {
        <div class="mb-3">
          <textarea class="form-control textarea-key" readonly rows="4">{{ key().armored }}</textarea>
        </div>
      }

      @if (showActions()) {
        <div class="action-bar">
          <button class="btn btn-sm btn-outline-primary" (click)="onCopy.emit()">
            <i class="bi bi-copy me-1"></i> {{ t('common.copy') }}
          </button>
          <button class="btn btn-sm btn-outline-secondary" (click)="onDownload.emit()">
            <i class="bi bi-download me-1"></i> {{ t('common.download') }}
          </button>
          @if (key().type === 'public') {
            <button class="btn btn-sm btn-outline-danger" (click)="onDelete.emit()">
              <i class="bi bi-trash me-1"></i> {{ t('key.stored.remove') }}
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .key-card { background: white; border-radius: 0.75rem; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .fingerprint { font-family: 'Fira Code', monospace; font-size: 0.8rem; letter-spacing: 0.05em; color: #3498db; }
  `]
})
export class KeyCardComponent {
  private i18n = inject(I18nService);

  key = input.required<{ name: string; email: string; fingerprint: string; armored: string; type: 'public' | 'private' }>();
  showActions = input(true);

  onCopy = output<void>();
  onDownload = output<void>();
  onDelete = output<void>();

  get t() { return (key: string) => this.i18n.t(key); }
}
