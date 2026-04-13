import { Component } from '@angular/core';

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
              Todo processamento ocorre localmente no seu navegador. Nenhuma chave é enviada a servidores.
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <span class="text-muted small">PGP Web Lab &copy; 2026</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer { margin-top: auto; }
  `]
})
export class FooterComponent {}
