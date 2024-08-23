// src/app/service/patientservice.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class PatientserviceService {
  private baseUrl = 'http://localhost:8000/pdf';
  sanitizer: any;
  
  

  constructor(private http: HttpClient) { }

  uploadPdf(formData: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post(`${this.baseUrl}/upload/`, formData, { headers });
  }

 
  getFile(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.baseUrl}/affichefile/`, { headers });
  }
 

  getImage(fileName: string): Observable<Blob> {
    // Construisez l'URL sans répéter `/media/pdfs/`
    return this.http.get(`${this.baseUrl}/media/pdfs/${fileName}`, { responseType: 'blob' });
  }
  

  getPdfUrl(filename: string): string {
   
    if (filename.startsWith('/media/pdfs/')) {
        filename = filename.replace('/media/pdfs/', '');
    }
    return `${this.baseUrl}/media/pdfs/${filename}`;
}



getPdfImages(fileId: number): Observable<any> {
  console.log('Fetching images for PDF ID:', fileId);  // Log the pdfId
  return this.http.get<any>(`${this.baseUrl}/pdf/${fileId}/images/`);
}


sanitizeUrl(url: string): SafeResourceUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}

deleteFile(id: number, token: string): Observable<any> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete(`${this.baseUrl}/delete/${id}/`, { headers });
}


}