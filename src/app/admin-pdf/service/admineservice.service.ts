import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserserviceService } from 'src/app/user-management/service/userservice.service';

@Injectable({
  providedIn: 'root'
})
export class AdmineserviceService {
  private baseUrl = 'http://localhost:8000/pdf';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private userService: UserserviceService
  ) {}

  getAuthHeaders(): HttpHeaders {
    const token = this.userService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getPatientFiles(patientId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/patient/${patientId}/files/`, { headers: this.getAuthHeaders() });
  }

  getPdfUrl(filename: string): string {
    if (filename.startsWith('http://localhost:8000/media/pdfs/')) {
      filename = filename.replace('http://localhost:8000/media/pdfs/', '');
    }
    return `http://localhost:8000/pdf/media/pdfs/${filename}`;
  }

  getPdfImages(fileId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pdf/${fileId}/images/`, { headers: this.getAuthHeaders() });
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  deleteFile(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/er/${id}/`, { headers: this.getAuthHeaders() });
  }

  addNewPage(pdfId: number, newPageFile: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('new_page', newPageFile, newPageFile.name);
    return this.http.post(`${this.baseUrl}/${pdfId}/add-page/`, formData, { headers: this.getAuthHeaders() });
  }

  extractPages(pdfId: number, pages: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/${pdfId}/extract-pages/`, { pages_to_extract: pages }, { headers: this.getAuthHeaders() });
  }

  importDocument(pdfId: number, document: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('document', document, document.name);
    return this.http.post(`${this.baseUrl}/${pdfId}/import-document/`, formData, { headers: this.getAuthHeaders() });
  }

  movePage(pdfId: number, pageNumber: number, newPosition: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${pdfId}/move-page/`, { page_number: pageNumber, new_position: newPosition }, { headers: this.getAuthHeaders() });
  }

  rotatePages(pdfId: number, pages: number[], rotationAngle: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${pdfId}/rotate-pages/`, { pages_to_rotate: pages, rotation_angle: rotationAngle }, { headers: this.getAuthHeaders() });
  }

 

  duplicatePage(pdfId: number, pageNumber: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${pdfId}/duplicate-page/`, { page_number: pageNumber }, { headers: this.getAuthHeaders() });
  }
  
  updatePageOrder(pdfId: number, pageOrder: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/pdf/${pdfId}/update-page-order/`, { new_order: pageOrder }, { headers: this.getAuthHeaders() });
  }
  
  

  getPdfPages(pdfId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pdf/${pdfId}/pages/`, { headers: this.getAuthHeaders() });
  }
  getImage(fileName: string): Observable<Blob> {
    // Construisez l'URL sans répéter `/media/pdfs/`
    return this.http.get(`${this.baseUrl}/media/pdfs/${fileName}`, { responseType: 'blob' });
  }



  getDocx(fileName: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/media/pdfs/${fileName}`, { responseType: 'blob' });
  }
}