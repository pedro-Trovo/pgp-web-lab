import { Component, input, output, signal, ElementRef, ViewChild, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { FileSizePipe } from '../pipes/file-size.pipe';

@Component({
  selector: 'app-file-drop',
  standalone: true,
  imports: [FileSizePipe],
  template: `
    <div
      #dropZone
      class="file-drop-zone"
      [class.dragover]="isDragover()"
      (click)="fileInput.click()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave()"
      (drop)="onDrop($event)"
    >
      <input
        #fileInput
        type="file"
        class="d-none"
        [accept]="accept()"
        (change)="onFileSelect($event)"
      />
      
      @if (!selectedFile()) {
        <div class="text-muted">
          <i class="bi bi-cloud-arrow-up fs-1 d-block mb-2"></i>
          <span>{{ placeholder() || t('file.drop.placeholder') }}</span>
        </div>
      } @else {
        <div class="text-start">
          <div class="d-flex align-items-center">
            <i class="bi bi-file-earmark fs-2 me-2 text-secondary"></i>
            <div>
              <strong>{{ selectedFile()!.name }}</strong>
              <span class="text-muted ms-2">{{ selectedFile()! | fileSize }}</span>
            </div>
          </div>
          <button class="btn btn-sm btn-link text-danger mt-2" (click)="clearFile($event)">
            {{ t('common.clear') }}
          </button>
        </div>
      }
      
      @if (hint()) {
        <small class="text-muted d-block mt-2">{{ hint() }}</small>
      }
    </div>
  `,
  styles: [`
    .file-drop-zone { border: 2px dashed #dee2e6; border-radius: 0.75rem; padding: 2rem; text-align: center; cursor: pointer; transition: all 0.2s; }
    .file-drop-zone:hover, .file-drop-zone.dragover { border-color: #3498db; background: rgba(52, 152, 219, 0.05); }
  `]
})
export class FileDropComponent {
  private i18n = inject(I18nService);

  @ViewChild('dropZone') dropZone!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  placeholder = input('');
  accept = input('*/*');
  hint = input('');
  maxSize = input(10 * 1024 * 1024);

  fileSelected = output<File>();
  error = output<string>();

  selectedFile = signal<File | null>(null);
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

  private handleFile(file: File): void {
    if (file.size > this.maxSize()) {
      this.error.emit(this.i18n.t('validation.fileTooLarge'));
      return;
    }
    this.selectedFile.set(file);
    this.fileSelected.emit(file);
  }

  clearFile(event: Event): void {
    event.stopPropagation();
    this.selectedFile.set(null);
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
