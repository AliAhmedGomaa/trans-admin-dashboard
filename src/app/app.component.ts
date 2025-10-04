import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavComponent } from './core/nav/nav.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/auth/services/auth.service';
import { LoaderService } from './shared/services/loader.service';
import { Observable, of } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    NavComponent,
    CommonModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  hasNav = true;
  isLoading!: Observable<boolean>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.isLoading = this.loaderService.isLoading$;
  }

  ngOnInit(): void {
    const lang = (localStorage.getItem('lang') as 'en' | 'ar') || 'en';
    this.translate.setDefaultLang('ar');
    this.translate.use(lang);

    this.updateLanguageSettings(localStorage.getItem('lang') || 'en');
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (val.url.includes('/auth')) {
          this.hasNav = false;

          if (this.authService.isAuthenticated()) {
            this.router.navigate(['/home']);
          }
        } else this.hasNav = true;
      }
    });

    this.isLoading.subscribe((val) => {
      this.isLoading = of(val);
      this.cdr.detectChanges();
    });

    this.translate.onLangChange.subscribe((event) => {
      this.updateLanguageSettings(event.lang);
    });
  }

  updateLanguageSettings(lang: string) {
    const htmlElement = this.renderer.selectRootElement('html', true);

    if (lang === 'ar') {
      // For Arabic language
      this.renderer.setAttribute(htmlElement, 'dir', 'rtl');
      this.renderer.addClass(this.el.nativeElement, 'lang-ar');
      this.renderer.removeClass(this.el.nativeElement, 'lang-en');
      localStorage.setItem('lang', 'ar');
    } else {
      // For other languages (e.g., English)
      this.renderer.setAttribute(htmlElement, 'dir', 'ltr');
      this.renderer.addClass(this.el.nativeElement, 'lang-en');
      this.renderer.removeClass(this.el.nativeElement, 'lang-ar');
      localStorage.setItem('lang', 'en');
    }
  }
}
