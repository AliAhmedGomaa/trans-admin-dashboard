import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-slider',
  standalone: true,
  imports: [CommonModule, CarouselModule, TranslateModule],
  templateUrl: './auth-slider.component.html',
  styleUrls: ['./auth-slider.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthSliderComponent implements OnInit, OnDestroy {
  index = 0;
  slidePerView = 1;
  subscriptions: Subscription[] = [];

  initialized = false;

  slides = [
    {
      gif: 'assets/images/auth/1.png',
      title: 'AUTH.LOGIN.TENNIS.TITLE',
      subTitle: 'AUTH.LOGIN.TENNIS.SUB_TITLE',
    },
    {
      gif: 'assets/images/auth/1.png',
      title: 'AUTH.LOGIN.BASKETBALL.TITLE',
      subTitle: 'AUTH.LOGIN.BASKETBALL.SUB_TITLE',
    },
    {
      gif: 'assets/images/auth/1.png',
      title: 'AUTH.LOGIN.FOOTBALL.TITLE',
      subTitle: 'AUTH.LOGIN.FOOTBALL.SUB_TITLE',
    }
  ];

  owlOptions: OwlOptions = {
    loop: true,
    autoplay: false,
    autoplayTimeout: 3500, // 3 seconds delay
    dots: true, // Enable dots (styled as white bars)
    items: 1, // Show one slide at a time
    rtl: true,
  };

  constructor(public translate: TranslateService) {}
  trackByIndex = (index: number) => index;
  ngOnInit(): void {
    const langSubs = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        if (event.lang == 'ar') {
          this.owlOptions = {
            loop: false,
            autoplay: false,
            autoplayTimeout: 3500, // 3 seconds delay
            dots: true, // Enable dots (styled as white bars)
            items: 1, // Show one slide at a time
            rtl: true,
          };
        } else {
          this.owlOptions = {
            loop: false,
            autoplay: false,
            autoplayTimeout: 3500, // 3 seconds delay
            dots: true, // Enable dots (styled as white bars)
            items: 1, // Show one slide at a time
            rtl: true,
          };
        }
      }
    );
    this.subscriptions.push(langSubs);
  }

  ngOnDestroy(): void {
    for (const subs of this.subscriptions) {
      subs.unsubscribe();
    }
  }
}
