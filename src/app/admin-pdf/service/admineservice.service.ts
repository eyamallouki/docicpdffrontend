import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AdmineserviceService {
  private baseUrl = 'http://localhost:8000/pdf';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  getPatientFiles(patientId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/patient/${patientId}/files/`);
  }

  getPdfUrl(filename: string): string {
    // Vérifier et supprimer les parties incorrectes de l'URL
    if (filename.startsWith('http://localhost:8000/media/pdfs/')) {
      filename = filename.replace('http://localhost:8000/media/pdfs/', '');
    }
    return `http://localhost:8000/pdf/media/pdfs/${filename}`;
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
