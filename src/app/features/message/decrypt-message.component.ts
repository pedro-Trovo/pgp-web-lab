import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OpenPGPService } from '../../core/services/openpgp.service';
import { CryptoStateService } from '../../core/services/crypto-state.service';
import { I18nService } from '../../core/services/i18n.service';
import { ToastService } from '../../core/services/toast.service';
import { KeyFileInputComponent } from '../../shared/components/key-file-input.component';

@Component({
  selector: 'app-decrypt-message',
  standalone: true,
  imports: [ReactiveFormsModule, KeyFileInputComponent],
  template: `
    <div class="decrypt-message">
      <h2 class="mb-4 text-center"><i class="bi bi-unlock me-2"></i>{{ t('message.decrypt.title') }}</h2>

      <div class="card shadow-sm">
        <div class="card-body p-4">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label class="form-label">{{ t('message.decrypt.encryptedMessage') }}</label>
              <textarea class="form-control textarea-key" formControlName="encryptedMessage" rows="4" [placeholder]="t('message.decrypt.encryptedPlaceholder')"></textarea>
              @if (form.get('encryptedMessage')?.touched && form.get('encryptedMessage')?.errors?.['required']) {
                <div class="text-danger small mt-1">{{ t('validation.required') }}</div>
              }
            </div>

            <div class="mb-4">
              <label class="form-label">{{ t('message.decrypt.privateKey') }}</label>
              <app-key-file-input (keyChange)="onKeyChange($event)" (error)="onKeyError($event)" />
              @if (form.get('privateKey')?.touched && form.get('privateKey')?.errors?.['required']) {
                <div class="text-danger small mt-1">{{ t('validation.required') }}</div>
              }
            </div>

            <div class="mb-4">
              <div class="form-check">
                <input type="checkbox" class="form-check-input" id="usePassphrase" formControlName="usePassphrase">
                <label class="form-check-label" for="usePassphrase">
                  {{ t('message.decrypt.usePassphrase') }}
                </label>
              </div>
            </div>

            @if (form.get('usePassphrase')?.value) {
              <div class="mb-4">
                <label class="form-label">{{ t('message.decrypt.passphrase') }}</label>
                <div class="input-group">
                  <input [type]="showPassword() ? 'text' : 'password'" class="form-control" formControlName="passphrase" [placeholder]="t('message.decrypt.passphrasePlaceholder')">
                  <button class="btn btn-outline-secondary" type="button" (click)="showPassword.set(!showPassword())">
                    <i class="bi @if(showPassword()) { bi-eye-slash } @else { bi-eye }"></i>
                  </button>
                </div>
              </div>
            }

            <button type="submit" class="btn btn-primary w-100 btn-lg" [disabled]="form.invalid || isProcessing()">
              @if (isProcessing()) {
                <span class="spinner-border spinner-border-sm me-2"></span>
                {{ t('common.processing') }}
              } @else {
                <i class="bi bi-unlock me-2"></i>{{ t('common.decrypt') }}
              }
            </button>
          </form>
        </div>
      </div>

      @if (decryptedMessage()) {
        <div class="card shadow-sm mt-4 border-success">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="mb-0"><i class="bi bi-check-circle text-success me-2"></i>{{ t('message.decrypt.decrypted') }}</h5>
              <button class="btn btn-sm btn-outline-primary" (click)="copyToClipboard(decryptedMessage()!)">
                <i class="bi bi-copy me-1"></i>{{ t('common.copy') }}
              </button>
            </div>
            <textarea class="form-control" rows="4" readonly>{{ decryptedMessage() }}</textarea>
            <small class="text-muted d-block mt-2">{{ t('message.decrypt.decryptedHint') }}</small>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .decrypt-message { max-width: 700px; margin: 0 auto; }
    .textarea-key { font-family: 'Fira Code', monospace; font-size: 0.8rem; }
  `]
})
export class DecryptMessageComponent {
  private fb = inject(FormBuilder);
  private openpgp = inject(OpenPGPService);
  private state = inject(CryptoStateService);
  private i18n = inject(I18nService);
  private toast = inject(ToastService);

  form = this.fb.group({
    encryptedMessage: ['', Validators.required],
    privateKey: ['', Validators.required],
    usePassphrase: [false],
    passphrase: ['']
  });

  decryptedMessage = signal<string | null>(null);
  showPassword = signal(false);
  isProcessing = this.state.isProcessing;

  get t() { return (key: string) => this.i18n.t(key); }

  onKeyChange(key: string): void {
    this.form.patchValue({ privateKey: key });
  }

  onKeyError(error: string): void {
    this.toast.error(error);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    const { encryptedMessage, privateKey, passphrase, usePassphrase } = this.form.value;
    this.state.setProcessing();

    try {
      const decrypted = await this.openpgp.decryptMessage(
        encryptedMessage!,
        privateKey!,
        usePassphrase ? (passphrase || '') : ''
      );
      this.decryptedMessage.set(decrypted);
      this.state.setSuccess(decrypted);
      this.toast.success(this.t('message.decrypt.success'));
    } catch (err) {
      this.state.setError(err instanceof Error ? err.message : 'Erro');
      this.toast.error(this.t('common.error'));
    }
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
    this.toast.success(this.t('common.copied'));
  }
}
