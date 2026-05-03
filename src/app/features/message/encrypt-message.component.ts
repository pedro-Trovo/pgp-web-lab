import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OpenPGPService } from '../../core/services/openpgp.service';
import { CryptoStateService } from '../../core/services/crypto-state.service';
import { I18nService } from '../../core/services/i18n.service';
import { ToastService } from '../../core/services/toast.service';
import { KeyFileInputComponent } from '../../shared/components/key-file-input.component';

@Component({
  selector: 'app-encrypt-message',
  standalone: true,
  imports: [ReactiveFormsModule, KeyFileInputComponent],
  template: `
    <div class="encrypt-message">
      <h2 class="mb-4 text-center"><i class="bi bi-lock me-2"></i>{{ t('message.encrypt.title') }}</h2>

      <div class="card shadow-sm">
        <div class="card-body p-4">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label class="form-label">{{ t('message.encrypt.recipientKey') }}</label>
              <app-key-file-input (keyChange)="onKeyChange($event)" (error)="onKeyError($event)" />
              @if (form.get('publicKey')?.touched && form.get('publicKey')?.errors?.['required']) {
                <div class="text-danger small mt-1">{{ t('validation.required') }}</div>
              }
            </div>

            <div class="mb-4">
              <label class="form-label">{{ t('message.encrypt.message') }}</label>
              <textarea class="form-control" formControlName="message" rows="5" [placeholder]="t('message.encrypt.messagePlaceholder')"></textarea>
              @if (form.get('message')?.touched && form.get('message')?.errors?.['required']) {
                <div class="text-danger small mt-1">{{ t('validation.required') }}</div>
              }
            </div>

            <button type="submit" class="btn btn-primary w-100 btn-lg" [disabled]="form.invalid || isProcessing()">
              @if (isProcessing()) {
                <span class="spinner-border spinner-border-sm me-2"></span>
                {{ t('common.processing') }}
              } @else {
                <i class="bi bi-lock me-2"></i>{{ t('common.encrypt') }}
              }
            </button>
          </form>
        </div>
      </div>

      @if (encryptedMessage()) {
        <div class="card shadow-sm mt-4 border-success">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="mb-0"><i class="bi bi-check-circle text-success me-2"></i>{{ t('message.encrypt.encrypted') }}</h5>
              <button class="btn btn-sm btn-outline-primary" (click)="copyToClipboard(encryptedMessage()!)">
                <i class="bi bi-copy me-1"></i>{{ t('common.copy') }}
              </button>
            </div>
            <textarea class="form-control textarea-key" rows="5" readonly>{{ encryptedMessage() }}</textarea>
            <small class="text-muted d-block mt-2">{{ t('message.encrypt.encryptedHint') }}</small>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .encrypt-message { max-width: 700px; margin: 0 auto; }
    .textarea-key { font-family: 'Fira Code', monospace; font-size: 0.8rem; }
  `]
})
export class EncryptMessageComponent {
  private fb = inject(FormBuilder);
  private openpgp = inject(OpenPGPService);
  private state = inject(CryptoStateService);
  private i18n = inject(I18nService);
  private toast = inject(ToastService);

  form = this.fb.group({
    publicKey: ['', Validators.required],
    message: ['', Validators.required]
  });

  encryptedMessage = signal<string | null>(null);
  isProcessing = this.state.isProcessing;

  get t() { return (key: string) => this.i18n.t(key); }

  onKeyChange(key: string): void {
    this.form.patchValue({ publicKey: key });
  }

  onKeyError(error: string): void {
    this.toast.error(error);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    const { publicKey, message } = this.form.value;
    this.state.setProcessing();

    try {
      const encrypted = await this.openpgp.encryptMessage(message!, publicKey!);
      this.encryptedMessage.set(encrypted);
      this.state.setSuccess(encrypted);
      this.toast.success(this.t('message.encrypt.success'));
    } catch (err) {
      this.state.setError(err instanceof Error ? err.message : this.i18n.t('common.errorOccurred'));
      this.toast.error(this.t('common.error'));
    }
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
    this.toast.success(this.t('common.copied'));
  }
}
