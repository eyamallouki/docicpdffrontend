import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Role, User } from 'src/app/model/usermodel';

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
    return userRole === Role.PATIENT;
  }
  
  isUserAdmin(): boolean {
    const userRole = this.getUserRole();
    return userRole === Role.ADMINISTRATEUR;
  } 
  

   getRole(): Observable<Role> {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get<Role>(`${this.apiUrl}/get-user-role/`, { headers }).pipe(
        catchError((error) => {
          // Gérer les erreurs ici, par exemple les erreurs 401
          return throwError(error);
        })
      );
    } else {
      // Gérer le cas où aucun token n'est disponible, par exemple, rediriger vers la page de connexion
      return throwError('No token available');
    }
  } 

setUserRole(role: string) {
  if (role) { // Check if the role is defined
    const upperCaseRole = role.toUpperCase(); // Convert to uppercase if defined
    console.log('Setting user role:', upperCaseRole);
    localStorage.setItem(this.userRoleKey, upperCaseRole);
  } else {
    console.error('User role is undefined.');
  }
}   

}
