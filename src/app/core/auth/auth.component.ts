import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { pagesData } from './components/shared/PagesData';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthSliderComponent } from './components/shared/auth-slider/auth-slider.component';
import { Location } from '@angular/common';
import { AuthSuccessComponent } from './components/success/auth-success.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TranslateModule,
    AuthSliderComponent,
    AuthSuccessComponent,
  ],
})
export class AuthComponent implements OnInit, OnDestroy {
  currentPage!: any;
  subscriptions: Subscription[] = [];
  currentDir = 'ltr';
  constructor(
    private router: Router,
    public translate: TranslateService,
    private location: Location
  ) {}

  @Input() bottomPartTemplate: any;
  forgotPasswordEmail!: string | null;

  ngOnInit(): void {
    this.currentDir = localStorage.getItem('lang') === 'ar' ? 'rtl' : 'ltr';

    this.currentPage = this.findPage(this.router.url);

    if (this.router.url === '/auth') this.router.navigate(['/auth/login']);
    const subscription = this.router.events.subscribe((event: any) => {
      this.currentPage = this.findPage(event?.url);
    });
    this.forgotPasswordEmail = localStorage.getItem('forgot_password_email');

    this.subscriptions.push(subscription);
  }

  findPage(url: string) {
    return pagesData.find((page: any) => page.url == url);
  }

  revertLanguage() {
    const lang = localStorage.getItem('lang') || 'ar';

    if (lang == 'ar') {
      this.translate.use('en');
      localStorage.setItem('lang', 'en');
    } else {
      this.translate.use('ar');
      localStorage.setItem('lang', 'ar');
    }
  }
  goBack() {
    this.location.back();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
