import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/usermodel';

@Injectable({
  providedIn: 'root'
})
export class UserserviceService {

  private apiUrl = 'http://localhost:8000/auth'; 
  private tokenKey = 'jwt_token';
  private userRoleKey = 'userRole';
  constructor(private http: HttpClient) { }

  register(user: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register/`, user);
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/email-verify/?token=${token}`);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login/`, credentials);
  }

  sendResetPasswordRequest(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/password-reset/`, { email });
  }

  confirmResetPassword(newPassword: string, uidb64: string, token: string): Observable<any> {
    const body = {
      new_password: newPassword,
      new_password2: newPassword
    };
    const url = `${this.apiUrl}/password-reset-confirm/${uidb64}/${token}/`;
    console.log('API URL:', url);
    return this.http.post<any>(url, body);
  }

  changePassword(passwordData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/change-password/`, passwordData);
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile/`);
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout/`, {});
  } 

  storeUserRole(userRole: string) {
    localStorage.setItem(this.userRoleKey, userRole);
  }
  storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  } 
 
  getUserRole(): string {
    return localStorage.getItem(this.userRoleKey) || ''; 
  }

  isUserPatient(): boolean {
    const userRole = this.getUserRole();
    return userRole === 'patient';
  }

  isUserAdmin(): boolean {
    const userRole = this.getUserRole();
    return userRole === 'admin';
  }

}
