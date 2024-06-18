// src/app/service/patientservice.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientserviceService {
  private baseUrl = 'http://localhost:8000/pdf';

  constructor(private http: HttpClient) { }

  uploadPdf(formData: FormData, token: string): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.post(`${this.baseUrl}/upload/`, formData, { headers });
  } 


  getFiles(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.baseUrl}/affichefile/`, { headers });
  }
}
