import { Component, inject } from '@angular/core';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-white border-top py-4 mt-auto">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="text-muted mb-0 small">
              <i class="bi bi-shield-check me-1"></i>
              {{ t('footer.processing') }}
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <span class="text-muted small">{{ t('footer.copyright') }}</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer { margin-top: auto; }
  `]
})
export class FooterComponent {
  private i18n = inject(I18nService);
  get t() { return (key: string) => this.i18n.t(key); }
}
