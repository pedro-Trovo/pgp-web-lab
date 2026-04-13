import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';
import { ToastComponent } from '../shared/components/toast.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastComponent],
  template: `
    <div class="app-container d-flex flex-column min-vh-100">
      <app-header />
      <main class="main-content flex-grow-1">
        <div class="container page-content">
          <router-outlet />
        </div>
      </main>
      <app-footer />
      <app-toast />
    </div>
  `,
  styles: [`
    :host { display: block; }
    .app-container { min-height: 100vh; }
    .main-content { padding: 1.5rem 0; display: flex; justify-content: center; }
    .page-content { max-width: 900px; width: 100%; }
  `]
})
export class MainLayoutComponent {}
