import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18nService } from './core/services/i18n.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styles: [`:host { display: block; }`]
})
export class App implements OnInit {
  constructor(private i18n: I18nService) {}
  ngOnInit(): void {
    this.i18n.initLanguage();
  }
}
