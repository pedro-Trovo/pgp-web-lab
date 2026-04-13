import { Component } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="about-page">
      <h2 class="mb-4 text-center">
        <i class="bi bi-info-circle me-2"></i>{{ t('about.title') }}
      </h2>

      <div class="card shadow-sm mb-4">
        <div class="card-body p-4">
          <h5 class="card-title mb-3">
            <i class="bi bi-shield-lock me-2 text-primary"></i>{{ t('about.whatIs.title') }}
          </h5>
          <p class="card-text">{{ t('about.whatIs.description') }}</p>
        </div>
      </div>

      <div class="card shadow-sm mb-4">
        <div class="card-body p-4">
          <h5 class="card-title mb-3">
            <i class="bi bi-key me-2 text-primary"></i>{{ t('about.howWorks.title') }}
          </h5>
          <p class="card-text">{{ t('about.howWorks.description') }}</p>
        </div>
      </div>

      <div class="card shadow-sm mb-4">
        <div class="card-body p-4">
          <h5 class="card-title mb-3">
            <i class="bi bi-laptop me-2 text-primary"></i>{{ t('about.clientSide.title') }}
          </h5>
          <p class="card-text">{{ t('about.clientSide.description') }}</p>
        </div>
      </div>

      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h5 class="card-title mb-3">
            <i class="bi bi-github me-2 text-primary"></i>{{ t('about.openSource.title') }}
          </h5>
          <p class="card-text">{{ t('about.openSource.description') }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-page { max-width: 700px; margin: 0 auto; }
    .card-title { color: #2c3e50; font-weight: 600; }
  `]
})
export class AboutComponent {
  constructor(private i18n: I18nService) {}
  get t() { return (key: string) => this.i18n.t(key); }
}
