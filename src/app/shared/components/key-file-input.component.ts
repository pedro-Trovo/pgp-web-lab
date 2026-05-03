import { Component, input, output, signal, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-key-file-input',
  standalone: true,
  template: `
    <div class="key-file-input">
      <div class="file-drop-zone" [class.dragover]="isDragover()" [class.has-file]="keyContent()">
        <input
          #fileInput
          type="file"
          class="d-none"
          accept=".asc,.gpg,.pgp,.key"
          (change)="onFileSelect($event)"
        />
        
        @if (!keyContent()) {
          <div class="text-center" (click)="fileInput.click()" (dragover)="onDragOver($event)" (dragleave)="onDragLeave()" (drop)="onDrop($event)">
            <i class="bi bi-key fs-2 d-block mb-2 text-muted"></i>
            <span class="text-muted">{{ placeholder() || t('file.input.placeholder') }}</span>
            <small class="d-block text-muted mt-1" style="font-size: 0.75rem;">{{ hint() || t('file.input.maxSize') }}</small>
          </div>
        } @else {
          <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-check-circle-fill text-success"></i>
              <span class="text-success fw-medium">{{ t('common.success') }}</span>
              <code class="fingerprint-preview">{{ getFingerprintPreview() }}</code>
            </div>
            <button class="btn btn-sm btn-outline-danger" (click)="clearFile()">
              <i class="bi bi-x"></i>
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .key-file-input { width: 100%; }
    .file-drop-zone {
      border: 2px dashed #dee2e6;
      border-radius: 8px;
      padding: 1.5rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: rgba(255,255,255,0.5);
    }
    .file-drop-zone:hover, .file-drop-zone.dragover {
      border-color: #3498db;
      background: rgba(52, 152, 219, 0.05);
    }
    .file-drop-zone.has-file {
      border-style: solid;
      border-color: #27ae60;
      background: rgba(39, 174, 96, 0.05);
    }
    .fingerprint-preview {
      font-size: 0.75rem;
      color: #6c757d;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `]
})
export class KeyFileInputComponent {
  private i18n = inject(I18nService);

  placeholder = input('');
  hint = input('');
  maxSize = input(100 * 1024);

  keyChange = output<string>();
  error = output<string>();

  keyContent = signal<string | null>(null);
  isDragover = signal(false);

  get t() { return (key: string) => this.i18n.t(key); }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragover.set(true);
  }

  onDragLeave(): void {
    this.isDragover.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragover.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.handleFile(file);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.handleFile(file);
  }

  private async handleFile(file: File): Promise<void> {
    if (file.size > this.maxSize()) {
      this.error.emit(this.i18n.t('validation.fileTooLarge'));
      return;
    }

    try {
      const content = await file.text();
      if (!content.includes('-----BEGIN')) {
        this.error.emit(this.i18n.t('validation.invalidKey'));
        return;
      }
      this.keyContent.set(content);
      this.keyChange.emit(content);
    } catch {
      this.error.emit(this.i18n.t('validation.invalidKey'));
    }
  }

  clearFile(): void {
    this.keyContent.set(null);
    this.keyChange.emit('');
  }

  getFingerprintPreview(): string {
    const content = this.keyContent();
    if (!content) return '';
    const match = content.match(/Key fingerprint = ([\w\s]+)/i);
    if (match) return match[1].substring(0, 32) + '...';
    return content.substring(0, 40) + '...';
  }
}
