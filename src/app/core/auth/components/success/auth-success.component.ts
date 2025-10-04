import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralButtonComponent } from '../../../../shared/components/general-button/general-button.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-success',
  standalone: true,
  imports: [CommonModule, GeneralButtonComponent, TranslateModule],
  templateUrl: './auth-success.component.html',
  styleUrls: ['./auth-success.component.scss'],
})
export class AuthSuccessComponent {
  @Input() title!: string;
  @Input() subTitle!: string;
  @Input() haveAmazing: boolean = true;
}
