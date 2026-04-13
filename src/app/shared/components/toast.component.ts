import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast-item toast-{{ toast.type }}" (click)="toastService.dismiss(toast.id)">
          <i class="bi toast-icon" [class]="getIcon(toast.type)"></i>
          <span>{{ toast.message }}</span>
          <button class="toast-close" (click)="toastService.dismiss(toast.id)">
            <i class="bi bi-x"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    }
    .toast-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 8px;
      background: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
      cursor: pointer;
      font-weight: 500;
    }
    .toast-success { border-left: 4px solid #27ae60; }
    .toast-success .toast-icon { color: #27ae60; }
    .toast-error { border-left: 4px solid #e74c3c; }
    .toast-error .toast-icon { color: #e74c3c; }
    .toast-warning { border-left: 4px solid #f39c12; }
    .toast-warning .toast-icon { color: #f39c12; }
    .toast-info { border-left: 4px solid #3498db; }
    .toast-info .toast-icon { color: #3498db; }
    .toast-icon { font-size: 1.2rem; }
    .toast-close {
      margin-left: auto;
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      opacity: 0.6;
    }
    .toast-close:hover { opacity: 1; }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: 'bi-check-circle-fill',
      error: 'bi-exclamation-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      info: 'bi-info-circle-fill'
    };
    return icons[type] || 'bi-info-circle';
  }
}
