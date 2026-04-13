import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { 
        path: '', 
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) 
      },
      {
        path: 'keys/generate',
        loadComponent: () => import('./features/key-management/key-generation.component').then(m => m.KeyGenerationComponent)
      },
      {
        path: 'message/encrypt',
        loadComponent: () => import('./features/message/encrypt-message.component').then(m => m.EncryptMessageComponent)
      },
      {
        path: 'message/decrypt',
        loadComponent: () => import('./features/message/decrypt-message.component').then(m => m.DecryptMessageComponent)
      },
      {
        path: 'file/encrypt',
        loadComponent: () => import('./features/file/encrypt-file.component').then(m => m.EncryptFileComponent)
      },
      {
        path: 'file/decrypt',
        loadComponent: () => import('./features/file/decrypt-file.component').then(m => m.DecryptFileComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
