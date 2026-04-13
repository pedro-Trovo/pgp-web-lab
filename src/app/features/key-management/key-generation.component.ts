import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { OpenPGPService } from '../../core/services/openpgp.service';
import { CryptoStateService } from '../../core/services/crypto-state.service';
import { I18nService } from '../../core/services/i18n.service';
import { ToastService } from '../../core/services/toast.service';
import { FingerprintDisplayComponent } from '../../shared/components/fingerprint-display.component';

interface GeneratedKeys {
  publicKey: string;
  privateKey: string;
  fingerprint: string;
}

@Component({
  selector: 'app-key-generation',
  standalone: true,
  imports: [ReactiveFormsModule, FingerprintDisplayComponent],
  template: `
    <div class="key-generation">
      <h2 class="mb-4 text-center"><i class="bi bi-key me-2"></i>{{ t('key.generate.title') }}</h2>

      @if (!generatedKeys()) {
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="mb-4">
                <div class="form-check">
                  <input type="checkbox" class="form-check-input" id="usePassphrase" formControlName="usePassphrase">
                  <label class="form-check-label" for="usePassphrase">
                    {{ t('key.generate.usePassphrase') }}
                  </label>
                </div>
              </div>

              @if (form.get('usePassphrase')?.value) {
                <div class="mb-4">
                  <label class="form-label">{{ t('key.generate.passphrase') }}</label>
                  <div class="input-group">
                    <input [type]="showPassword() ? 'text' : 'password'" class="form-control" formControlName="passphrase" [placeholder]="t('key.generate.passphrasePlaceholder')">
                    <button class="btn btn-outline-secondary" type="button" (click)="showPassword.set(!showPassword())">
                      <i class="bi @if(showPassword()) { bi-eye-slash } @else { bi-eye }"></i>
                    </button>
                  </div>
                  @if (form.get('passphrase')?.touched && form.get('passphrase')?.errors?.['minlength']) {
                    <div class="text-danger small mt-1">{{ i18n.t('validation.minLength', {min: 8}) }}</div>
                  }
                  <small class="text-warning d-block mt-1">{{ t('key.generate.passphraseHint') }}</small>
                </div>
              }

              <div class="mb-4">
                <label class="form-label">{{ t('key.generate.keySize') }}</label>
                <div class="btn-group w-100" role="group">
                  <input type="radio" class="btn-check" formControlName="keySize" value="2048" id="size2048">
                  <label class="btn btn-outline-primary" for="size2048">{{ t('key.generate.bits2048') }}</label>
                  <input type="radio" class="btn-check" formControlName="keySize" value="4096" id="size4096">
                  <label class="btn btn-outline-primary" for="size4096">{{ t('key.generate.bits4096') }}</label>
                </div>
              </div>

              <button type="submit" class="btn btn-primary w-100 btn-lg" [disabled]="form.invalid || isProcessing()">
                @if (isProcessing()) {
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  {{ t('key.generate.generating') }}
                } @else {
                  <i class="bi bi-key me-2"></i>{{ t('key.generate.generateButton') }}
                }
              </button>
            </form>
          </div>
        </div>
      }

      @if (generatedKeys()) {
        <div class="mt-4">
          <app-fingerprint-display [fingerprint]="generatedKeys()!.fingerprint" />

          <div class="row g-3 mt-3">
            <div class="col-md-6">
              <div class="key-card">
                <h5 class="mb-3"><i class="bi bi-globe2 me-2"></i>{{ t('key.generate.publicKey') }}</h5>
                <textarea class="form-control textarea-key mb-3" readonly rows="6">{{ generatedKeys()!.publicKey }}</textarea>
                <div class="action-bar">
                  <button class="btn btn-primary btn-sm" (click)="copyToClipboard(generatedKeys()!.publicKey, 'public')">
                    <i class="bi bi-copy me-1"></i>{{ t('key.generate.copyPublic') }}
                  </button>
                  <button class="btn btn-outline-primary btn-sm" (click)="downloadKey(generatedKeys()!.publicKey, 'public')">
                    <i class="bi bi-download me-1"></i>{{ t('key.generate.download') }}
                  </button>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="key-card border border-warning">
                <h5 class="mb-3 text-warning"><i class="bi bi-shield-lock me-2"></i>{{ t('key.generate.privateKey') }}</h5>
                <textarea class="form-control textarea-key mb-3" readonly rows="6">{{ generatedKeys()!.privateKey }}</textarea>
                <div class="action-bar">
                  <button class="btn btn-warning btn-sm" (click)="copyToClipboard(generatedKeys()!.privateKey, 'private')">
                    <i class="bi bi-copy me-1"></i>{{ t('key.generate.copyPrivate') }}
                  </button>
                  <button class="btn btn-outline-warning btn-sm" (click)="downloadKey(generatedKeys()!.privateKey, 'private')">
                    <i class="bi bi-download me-1"></i>{{ t('key.generate.download') }}
                  </button>
                </div>
                <small class="text-warning d-block mt-2">⚠️ Nunca compartilhe sua chave privada!</small>
              </div>
            </div>
          </div>

          <div class="text-center mt-4">
            <button class="btn btn-outline-secondary" (click)="reset()">
              <i class="bi bi-plus-circle me-1"></i> Gerar Novo Par de Chaves
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .key-card { background: white; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .textarea-key { font-family: 'Fira Code', monospace; font-size: 0.75rem; }
  `]
})
export class KeyGenerationComponent {
  private fb = inject(FormBuilder);
  private openpgp = inject(OpenPGPService);
  private state = inject(CryptoStateService);
  i18n = inject(I18nService);
  private toast = inject(ToastService);

  form = this.fb.group({
    usePassphrase: [false],
    passphrase: [''],
    keySize: ['4096']
  });

  generatedKeys = signal<GeneratedKeys | null>(null);
  showPassword = signal(false);
  isProcessing = this.state.isProcessing;

  get t() { return (key: string) => this.i18n.t(key); }

  async onSubmit(): Promise<void> {
    const { passphrase, keySize, usePassphrase } = this.form.value;
    
    if (usePassphrase && passphrase && passphrase.length < 8) {
      return;
    }

    this.state.setProcessing();

    try {
      const result = await this.openpgp.generateKeyPair(
        passphrase || '',
        parseInt(keySize!, 10) as 2048 | 4096
      );

      this.generatedKeys.set(result);
      this.state.setSuccess(result);
      this.toast.success(this.t('key.generate.success'));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao gerar chaves';
      this.state.setError(message);
      this.toast.error(message);
    }
  }

  copyToClipboard(text: string, type: 'public' | 'private'): void {
    navigator.clipboard.writeText(text);
    this.toast.success(this.t('common.copied'));
  }

  downloadKey(content: string, type: 'public' | 'private'): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pgp-${type}-key.pgp`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast.success(this.t('common.downloaded'));
  }

  reset(): void {
    this.generatedKeys.set(null);
    this.state.reset();
    this.form.reset({ usePassphrase: false, passphrase: '', keySize: '4096' });
  }
}
