import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OpenPGPService } from '../../core/services/openpgp.service';
import { CryptoStateService } from '../../core/services/crypto-state.service';
import { I18nService } from '../../core/services/i18n.service';
import { ToastService } from '../../core/services/toast.service';
import { FileDropComponent } from '../../shared/components/file-drop.component';
import { KeyFileInputComponent } from '../../shared/components/key-file-input.component';

@Component({
  selector: 'app-decrypt-file',
  standalone: true,
  imports: [ReactiveFormsModule, FileDropComponent, KeyFileInputComponent],
  template: `
    <div class="decrypt-file">
      <h2 class="mb-4 text-center"><i class="bi bi-file-earmark-lock-fill me-2"></i>{{ t('file.decrypt.title') }}</h2>

      <div class="card shadow-sm mb-4">
        <div class="card-body p-4">
          <app-file-drop
            [placeholder]="t('file.decrypt.dropEncrypted')"
            (fileSelected)="onFileSelected($event)"
            (error)="onFileError($event)"
          />
        </div>
      </div>

      @if (selectedFile()) {
        <div class="alert alert-info mb-4">
          <i class="bi bi-file-earmark me-2"></i>
          <strong>{{ selectedFile()!.name }}</strong>
        </div>
      }

      <div class="card shadow-sm">
        <div class="card-body p-4">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label class="form-label">{{ t('file.decrypt.privateKey') }}</label>
              <app-key-file-input (keyChange)="onKeyChange($event)" (error)="onKeyError($event)" />
              @if (form.get('privateKey')?.touched && form.get('privateKey')?.errors?.['required']) {
                <div class="text-danger small mt-1">{{ t('validation.required') }}</div>
              }
            </div>

            <div class="mb-4">
              <div class="form-check">
                <input type="checkbox" class="form-check-input" id="usePassphrase" formControlName="usePassphrase">
                <label class="form-check-label" for="usePassphrase">
                  {{ t('file.decrypt.usePassphrase') }}
                </label>
              </div>
            </div>

            @if (form.get('usePassphrase')?.value) {
              <div class="mb-4">
                <label class="form-label">{{ t('file.decrypt.passphrase') }}</label>
                <div class="input-group">
                  <input [type]="showPassword() ? 'text' : 'password'" class="form-control" formControlName="passphrase" [placeholder]="t('file.decrypt.passphrasePlaceholder')">
                  <button class="btn btn-outline-secondary" type="button" (click)="showPassword.set(!showPassword())">
                    <i class="bi @if(showPassword()) { bi-eye-slash } @else { bi-eye }"></i>
                  </button>
                </div>
              </div>
            }

            <button type="submit" class="btn btn-primary w-100 btn-lg" [disabled]="form.invalid || !selectedFile() || isProcessing()">
              @if (isProcessing()) {
                <span class="spinner-border spinner-border-sm me-2"></span>
                {{ t('file.decrypt.decrypting') }}
              } @else {
                <i class="bi bi-unlock me-2"></i>{{ t('common.decrypt') }}
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .decrypt-file { max-width: 700px; margin: 0 auto; }
  `]
})
export class DecryptFileComponent {
  private fb = inject(FormBuilder);
  private openpgp = inject(OpenPGPService);
  private state = inject(CryptoStateService);
  private i18n = inject(I18nService);
  private toast = inject(ToastService);

  form = this.fb.group({
    privateKey: ['', Validators.required],
    usePassphrase: [false],
    passphrase: ['']
  });

  selectedFile = signal<File | null>(null);
  showPassword = signal(false);
  isProcessing = this.state.isProcessing;

  get t() { return (key: string) => this.i18n.t(key); }

  onFileSelected(file: File): void {
    this.selectedFile.set(file);
  }

  onFileError(message: string): void {
    this.toast.error(message);
  }

  onKeyChange(key: string): void {
    this.form.patchValue({ privateKey: key });
  }

  onKeyError(error: string): void {
    this.toast.error(error);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || !this.selectedFile()) return;

    const { privateKey, passphrase, usePassphrase } = this.form.value;
    this.state.setProcessing();

    try {
      const blob = await this.selectedFile()!.arrayBuffer();
      const result = await this.openpgp.decryptFile(
        new Blob([blob]),
        privateKey!,
        usePassphrase ? (passphrase || '') : ''
      );
      
      const url = URL.createObjectURL(result.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      a.click();
      URL.revokeObjectURL(url);

      this.state.setSuccess({ filename: result.filename });
      this.toast.success(this.t('file.decrypt.success'));
    } catch (err) {
      this.state.setError(err instanceof Error ? err.message : this.i18n.t('common.errorOccurred'));
      this.toast.error(this.t('common.error'));
    }
  }
}
