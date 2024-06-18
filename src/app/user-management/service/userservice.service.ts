import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Role, User } from 'src/app/model/usermodel';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class UserserviceService {
  private apiUrl = 'http://localhost:8000/auth'; 
  private tokenKey = 'jwt_token';
  private userRoleKey = 'userRole';
  private token: string | null = null;
  

  constructor(private http: HttpClient) {}

  register(user: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register/`, user);
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/email-verify/?token=${token}`);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login/`, credentials).pipe(
      tap(response => {
        if (response.access) {
          this.storeToken(response.access); // Stocker le token d'accès
          this.setUserRole(response.role); // Stocker le rôle de l'utilisateur
        }
      })
    );
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
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get<Role>(`${this.apiUrl}/get-user-role/`, { headers });
    } else {
      throw new Error('No token available');
    }
  }

  setUserRole(role: string) {
    if (role) {
      const upperCaseRole = role.toUpperCase();
      console.log('Setting user role:', upperCaseRole);
      localStorage.setItem(this.userRoleKey, upperCaseRole);
    } else {
      console.error('User role is undefined.');
    }
  }

  storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token); // Sauvegarder dans localStorage pour persistance
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token'); // Récupérer depuis localStorage si nécessaire
    }
    return this.token;
  }

  getPatientIdFromToken(): number | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.user_id || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  assignUser(id: number, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/assign-user/${id}/`, data);
  }

  getAssignedPatients(): Observable<User[]> {
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get<User[]>(`${this.apiUrl}/assigned-patients/`, { headers });
    } else {
      throw new Error('No token available');
    }
  }
}
