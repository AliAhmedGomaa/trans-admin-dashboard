import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GeneralButtonComponent } from '../../../../shared/components/general-button/general-button.component';
import { GeneralInputComponent } from '../../../../shared/components/general-input/general-input.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    GeneralInputComponent,
    ReactiveFormsModule,
    TranslateModule,
    GeneralButtonComponent,
  ],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitted = false;
  errorMessage = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.loginForm.valueChanges.subscribe((change) => {
      this.errorMessage = '';
    });
  }

  getControlErrors(controlName: string): any {
    return this.loginForm.controls[controlName].errors;
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  submit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) { return; }

    const { email, password } = this.loginForm.value;
    this.authService.loginWithEmailPassword(email, password).subscribe({
      next: (res: any) => {
        const token = res?.token || res?.accessToken;
        if (token) {
          localStorage.setItem('token', token);
        }
        try { localStorage.setItem('userData', JSON.stringify(res?.user || res)); } catch {}

        const redirectTo = this.router.routerState.snapshot.root.queryParams['redirectTo'] || '/bookings';
        this.router.navigate([redirectTo]);
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.message || 'Login failed';
      }
    });
  }
}
