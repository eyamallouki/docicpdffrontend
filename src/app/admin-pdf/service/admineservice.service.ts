import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
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

  getImage(fileUrl: string): Observable<Blob> {
    // Vérifier si fileUrl est déjà une URL complète
    const imageUrl = fileUrl.startsWith('http://') || fileUrl.startsWith('https://')
        ? fileUrl
        : `http://localhost:8000${fileUrl}`;
    
    return this.http.get(imageUrl, { responseType: 'blob' });
}


resumer(command: string, rapportId: number): Observable<any> {
  return this.http.post(`${this.baseUrl}/process/`, { command, rapport_id: rapportId });
}

performOCR(pdfId: number): Observable<any> {
  return this.http.post(`${this.baseUrl}/ocr/${pdfId}/`, {});
}


cropImage(imageId: number, cropCoordinates: any, croppedImage: string): Observable<any> {
  const payload = {
    crop_coordinates: cropCoordinates,
    cropped_image: croppedImage
  };
  
  return this.http.post(`${this.baseUrl}/pdf/crop/${imageId}/`, payload);
}



getImageUrl(imageFileName: string): string {
  // Si l'URL commence déjà par 'http', ne la modifiez pas
  return imageFileName.startsWith('http')
    ? imageFileName
    : `http://localhost:8000/pdf/media/extracted_images/${imageFileName}`;
}






  getPdfUrl1(filename: string): string {
    if (filename.startsWith('/media/pdfs/')) {
        filename = filename.replace('/media/pdfs/', '');
    } else if (filename.startsWith('http://localhost:8000/media/pdfs/')) {
        filename = filename.replace('http://localhost:8000/media/pdfs/', '');
    }
    return `http://localhost:8000/media/pdfs/${filename}`;
}

saveCroppedImage(imageId: number, cropCoordinates: any): Observable<any> {
  const headers = this.getAuthHeaders();
  const croppedImageData = {
    crop_coordinates: cropCoordinates
  };

  return this.http.post<any>(`${this.baseUrl}/crop/${imageId}/`, croppedImageData, { headers });
}



  getDocx(fileName: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/media/pdfs/${fileName}`, { responseType: 'blob' });
  }
}