import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-dark bg-primary shadow-sm">
      <div class="container">
        <div class="d-flex w-100 justify-content-between align-items-center">
          <div class="dropdown">
            <button class="navbar-toggler" type="button" data-bs-toggle="dropdown">
              <span class="navbar-toggler-icon"></span>
            </button>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                  <i class="bi bi-house me-2"></i> {{ t('nav.home') }}
                </a>
              </li>
              <li>
                <a class="dropdown-item" routerLink="/keys/generate" routerLinkActive="active">
                  <i class="bi bi-key me-2"></i> {{ t('nav.generateKeys') }}
                </a>
              </li>
              <li>
                <a class="dropdown-item" routerLink="/message/encrypt" routerLinkActive="active">
                  <i class="bi bi-lock me-2"></i> {{ t('nav.encryptMessage') }}
                </a>
              </li>
              <li>
                <a class="dropdown-item" routerLink="/message/decrypt" routerLinkActive="active">
                  <i class="bi bi-unlock me-2"></i> {{ t('nav.decryptMessage') }}
                </a>
              </li>
              <li>
                <a class="dropdown-item" routerLink="/file/encrypt" routerLinkActive="active">
                  <i class="bi bi-file-earmark-lock me-2"></i> {{ t('nav.encryptFile') }}
                </a>
              </li>
              <li>
                <a class="dropdown-item" routerLink="/file/decrypt" routerLinkActive="active">
                  <i class="bi bi-file-earmark-lock-fill me-2"></i> {{ t('nav.decryptFile') }}
                </a>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item" routerLink="/about" routerLinkActive="active">
                  <i class="bi bi-info-circle me-2"></i> {{ t('nav.about') }}
                </a>
              </li>
            </ul>
          </div>

          <a class="navbar-brand d-flex align-items-center" routerLink="/">
            <i class="bi bi-shield-lock fs-4 me-2"></i>
            <strong>PGP Web Lab</strong>
          </a>

          <div class="dropdown">
            <button class="btn btn-outline-light btn-sm dropdown-toggle" data-bs-toggle="dropdown">
              <i class="bi bi-globe me-1"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              @for (lang of i18n.availableLangs; track lang.code) {
                <li>
                  <button class="dropdown-item" [class.active]="i18n.currentLang() === lang.code" (click)="setLanguage(lang.code)">
                    {{ lang.label }}
                  </button>
                </li>
              }
            </ul>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { padding: 0.75rem 0; }
    .navbar-brand { 
      position: absolute; 
      left: 50%; 
      transform: translateX(-50%); 
    }
    .dropdown-item { white-space: nowrap; }
    .dropdown-item:hover { background: rgba(52, 152, 219, 0.1); }
    .dropdown-item.active { background: rgba(52, 152, 219, 0.2); color: inherit; }
  `]
})
export class HeaderComponent {
  i18n = inject(I18nService);

  get t() { return (key: string) => this.i18n.t(key); }

  currentLangLabel(): string {
    return this.i18n.availableLangs.find(l => l.code === this.i18n.currentLang())?.label || 'PT';
  }

  setLanguage(code: string): void {
    this.i18n.setLanguage(code);
  }
}
