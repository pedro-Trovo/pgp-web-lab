import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home-container">
      <div class="row g-4 justify-content-center">
        <!-- Gerar Chaves - Card Principal -->
        <div class="col-12">
          <a routerLink="/keys/generate" class="feature-card feature-card-main text-decoration-none">
            <div class="feature-icon">
              <i class="bi bi-key-fill"></i>
            </div>
            <h3>{{ t('nav.generateKeys') }}</h3>
            <p>{{ t('home.generateDesc') }}</p>
          </a>
        </div>
        
        <!-- Mensagens -->
        <div class="col-md-6">
          <a routerLink="/message/encrypt" class="feature-card text-decoration-none">
            <div class="feature-icon">
              <i class="bi bi-lock-fill"></i>
            </div>
            <h4>{{ t('nav.encryptMessage') }}</h4>
            <p>{{ t('home.encryptMsgDesc') }}</p>
          </a>
        </div>
        
        <div class="col-md-6">
          <a routerLink="/message/decrypt" class="feature-card text-decoration-none">
            <div class="feature-icon">
              <i class="bi bi-unlock-fill"></i>
            </div>
            <h4>{{ t('nav.decryptMessage') }}</h4>
            <p>{{ t('home.decryptMsgDesc') }}</p>
          </a>
        </div>
        
        <!-- Arquivos -->
        <div class="col-md-6">
          <a routerLink="/file/encrypt" class="feature-card text-decoration-none">
            <div class="feature-icon">
              <i class="bi bi-file-earmark-lock2-fill"></i>
            </div>
            <h4>{{ t('nav.encryptFile') }}</h4>
            <p>{{ t('home.encryptFileDesc') }}</p>
          </a>
        </div>
        
        <div class="col-md-6">
          <a routerLink="/file/decrypt" class="feature-card text-decoration-none">
            <div class="feature-icon">
              <i class="bi bi-file-earmark-lock-fill"></i>
            </div>
            <h4>{{ t('nav.decryptFile') }}</h4>
            <p>{{ t('home.decryptFileDesc') }}</p>
          </a>
        </div>
      </div>
      <p class="text-center mt-4">
        <a routerLink="/about" class="text-muted small">
          {{ t('home.aboutLink') }} <i class="bi bi-arrow-right"></i>
        </a>
      </p>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 1rem 0;
    }
    .feature-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      height: 100%;
      min-height: 180px;
    }
    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }
    .feature-card-main {
      background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
      color: white;
      min-height: 200px;
    }
    .feature-card-main:hover {
      box-shadow: 0 8px 32px rgba(52, 152, 219, 0.4);
    }
    .feature-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(52, 152, 219, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }
    .feature-card-main .feature-icon {
      background: rgba(255,255,255,0.2);
    }
    .feature-icon i {
      font-size: 1.8rem;
      color: #3498db;
    }
    .feature-card-main .feature-icon i {
      color: white;
    }
    .feature-card h3, .feature-card h4 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
      font-weight: 600;
    }
    .feature-card-main h3 {
      color: white;
    }
    .feature-card p {
      margin: 0;
      color: #6c757d;
      font-size: 0.9rem;
    }
    .feature-card-main p {
      color: white;
    }
  `]
})
export class HomeComponent {
  constructor(private i18n: I18nService) {}
  get t() { return (key: string) => this.i18n.t(key); }
}
