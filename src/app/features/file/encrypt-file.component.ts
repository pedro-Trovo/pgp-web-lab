import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OpenPGPService } from '../../core/services/openpgp.service';
import { CryptoStateService } from '../../core/services/crypto-state.service';
import { I18nService } from '../../core/services/i18n.service';
import { ToastService } from '../../core/services/toast.service';
import { FileDropComponent } from '../../shared/components/file-drop.component';
import { KeyFileInputComponent } from '../../shared/components/key-file-input.component';
import { FileSizePipe } from '../../shared/pipes/file-size.pipe';

@Component({
  selector: 'app-encrypt-file',
  standalone: true,
  imports: [ReactiveFormsModule, FileDropComponent, KeyFileInputComponent, FileSizePipe],
  template: `
    <div class="encrypt-file">
      <h2 class="mb-4 text-center"><i class="bi bi-file-earmark-lock2-fill me-2"></i>{{ t('file.encrypt.title') }}</h2>

      <div class="card shadow-sm mb-4">
        <div class="card-body p-4">
          <app-file-drop
            [placeholder]="t('file.encrypt.dropFile')"
            [hint]="t('file.encrypt.maxSize')"
            (fileSelected)="onFileSelected($event)"
            (error)="onFileError($event)"
          />
        </div>
      </div>

      @if (selectedFile()) {
        <div class="card shadow-sm mb-4">
          <div class="card-body p-3">
            <div class="d-flex align-items-center gap-3">
              <i class="bi bi-file-earmark fs-2 text-secondary"></i>
              <div>
                <strong>{{ selectedFile()!.name }}</strong>
                <span class="text-muted ms-2">{{ selectedFile()! | fileSize }}</span>
              </div>
            </div>
          </div>
        </div>
      }

      <div class="card shadow-sm">
        <div class="card-body p-4">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label class="form-label">{{ t('file.encrypt.recipientKey') }}</label>
              <app-key-file-input (keyChange)="onKeyChange($event)" (error)="onKeyError($event)" />
              @if (form.get('publicKey')?.touched && form.get('publicKey')?.errors?.['required']) {
                <div class="text-danger small mt-1">{{ t('validation.required') }}</div>
              }
            </div>

            <button type="submit" class="btn btn-primary w-100 btn-lg" [disabled]="form.invalid || !selectedFile() || isProcessing()">
              @if (isProcessing()) {
                <span class="spinner-border spinner-border-sm me-2"></span>
                {{ t('file.encrypt.encrypting') }}
              } @else {
                <i class="bi bi-lock me-2"></i>{{ t('common.encrypt') }}
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .encrypt-file { max-width: 700px; margin: 0 auto; }
  `]
})
export class EncryptFileComponent {
  private fb = inject(FormBuilder);
  private openpgp = inject(OpenPGPService);
  private state = inject(CryptoStateService);
  private i18n = inject(I18nService);
  private toast = inject(ToastService);

  form = this.fb.group({
    publicKey: ['', Validators.required]
  });

  selectedFile = signal<File | null>(null);
  isProcessing = this.state.isProcessing;

  get t() { return (key: string) => this.i18n.t(key); }

  onFileSelected(file: File): void {
    this.selectedFile.set(file);
  }

  onFileError(message: string): void {
    this.toast.error(message);
  }

  onKeyChange(key: string): void {
    this.form.patchValue({ publicKey: key });
  }

  onKeyError(error: string): void {
    this.toast.error(error);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || !this.selectedFile()) return;

    const { publicKey } = this.form.value;
    this.state.setProcessing();

    try {
      const buffer = await this.selectedFile()!.arrayBuffer();
      const blob = await this.openpgp.encryptFile(buffer, publicKey!, this.selectedFile()!.name);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.selectedFile()!.name}.pgp`;
      a.click();
      URL.revokeObjectURL(url);

      this.state.setSuccess({ filename: this.selectedFile()!.name });
      this.toast.success(this.t('file.encrypt.success'));
    } catch (err) {
      this.state.setError(err instanceof Error ? err.message : this.i18n.t('common.errorOccurred'));
      this.toast.error(this.t('common.error'));
    }
  }
}
