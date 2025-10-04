import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  forwardRef,
} from '@angular/core';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import { ValidationErrorsComponent } from '../validation-errors/validation-errors.component';
import { TranslateModule } from '@ngx-translate/core';
import { GeneralInputsAccessor } from '../../classes/GeneralInputsAccessor';

@Component({
  selector: 'app-general-input',
  templateUrl: './general-input.component.html',
  styleUrls: ['./general-input.component.scss'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GeneralInputComponent),
      multi: true,
    },
  ],
  imports: [CommonModule, FormsModule, ValidationErrorsComponent, TranslateModule],
})
export class GeneralInputComponent extends GeneralInputsAccessor {
  @Input() label!: string;
  @Input() type!: string;
  @Input() placeholder!: string;
  @Input() icon!: string;
  @Input() isPassword = false;
  @Input() isSubmitted = false;
  @Input() errors!: ValidationErrors | null | undefined;
  @Input() mismatchError = false;
  @Input() isAuthInput = false;
  @Input() hasErrorValidation = true;
  @Input() isPhoneInput = false;

  @Output() valueChange = new EventEmitter<string>();

  @Output() onBlur = new EventEmitter<void>();
  @Output() onFocus = new EventEmitter<void>();

  showPassword = false;
  passwordIconSrc = 'images/auth/icons/eye.svg';
  @ViewChild('passwordInput') passwordInput!: any;

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
    if (this.showPassword) {
      this.passwordInput.nativeElement.type = 'text';
      this.passwordIconSrc = 'images/auth/icons/eye-hidden.svg';
    } else {
      this.passwordInput.nativeElement.type = 'password';
      this.passwordIconSrc = 'images/auth/icons/eye.svg';
    }
  }

  changedValue(evt: any) {
    if (this.type == 'tel') {
      let ASCIICode = evt.which ? evt.which : evt.keyCode;
      if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false;
      return true;
    } else {
      return true;
    }
  }

  onInputBlur() {
    this.onTouched();
    this.onBlur.emit();
  }

  onInputFocus() {
    this.onFocus.emit();
  }
}
