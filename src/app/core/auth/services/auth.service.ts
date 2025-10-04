import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
  getUserData() {
    return this.http.get<any>(`${this.baseUrl}/auth/user`);
  }

  loginWithEmailPassword(email: string, password: string) {
    const url = `${this.baseUrl}/auth/admin/login`;
    return this.http.post<any>(url, { email, password });
  }

  register(body: any) {
    const url = `${this.baseUrl}/api/auth/register`;
    return this.http.post<any>(url, body);
  }
  validateOTP(body: any) {
    const url = `${this.baseUrl}/admin/validate-otp`;
    return this.http.post<any>(url, body);
  }
  requestPasswordReset(email: any) {
    const url = `${this.baseUrl}/api/auth/request-password-reset`;
    return this.http.post<any>(url, email);
  }

  verifyOtp(email: string, otp: number) {
    const url = `${this.baseUrl}/api/auth/verify-otp`;
    return this.http.post<any>(url, { email, otp });
  }
  verifyResetPasswordOtp(phone: string, code: number) {
    const url = `${this.baseUrl}/auth/verify-sms`;
    return this.http.post<any>(url, { phone, code });
  }

  setResetPasswordNewPassword(email: string, password: string) {
    const url = `${this.baseUrl}/api/auth/set-reset-password-new-password`;
    return this.http.post<any>(url, { email, password });
  }
  changeForgetPassword(body: any) {
    const url = `${this.baseUrl}/forget/password/change`;
    return this.http.post<any>(url, body);
  }

  changeDefaultPassword(body: any) {
    const url = `${this.baseUrl}/admin/change-default-password`;
    return this.http.post<any>(url, body);
  }
  changeOldPassword(body: any, id: number | string) {
    const url = `${this.baseUrl}admin/change-password/${id}`;
    return this.http.post<any>(url, body);
  }

  getSports(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/sports`);
  }

  getCountries() {
    return this.http.get(`${this.baseUrl}/api/countries`);
  }

  updateProfile(profileData: any): Observable<any> {
    const url = `${this.baseUrl}/auth/update-profile`;
    
    // Create FormData for file upload
    const formData = new FormData();
    
    // Add text fields
    if (profileData.name) {
      formData.append('name', profileData.name);
    }
    if (profileData.phone) {
      formData.append('phone', profileData.phone);
    }
    if (profileData.nationalId) {
      formData.append('nationalId', profileData.nationalId);
    }
    
    // Add driver license file if present
    if (profileData.driverLicense && profileData.driverLicense instanceof File) {
      formData.append('driverLicense', profileData.driverLicense);
    }
    
    return this.http.post<any>(url, formData);
  }
}
