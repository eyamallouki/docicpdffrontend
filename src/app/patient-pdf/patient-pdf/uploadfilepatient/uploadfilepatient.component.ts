import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserserviceService } from 'src/app/user-management/service/userservice.service';
import { PatientserviceService } from '../../service/patientservice.service';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdfjs-dist/pdf.worker.js';

@Component({
  selector: 'app-uploadfilepatient',
  templateUrl: './uploadfilepatient.component.html',
  styleUrls: ['./uploadfilepatient.component.css']
})
export class UploadfilepatientComponent implements OnInit {
  selectedFiles: File[] = [];
  filePreviews: SafeResourceUrl[] = [];
  pdfTitle: string = '';
  totalPages: number = 0;
  categorie: string = '';
  etat: string = 'non_traité';
  patientAssocie: number | null = null;
  Pdf: any;

  constructor(
    private router: Router,
    private pdfUploadService: PatientserviceService,
    private authService: UserserviceService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.patientAssocie = this.authService.getPatientIdFromToken();
    if (this.patientAssocie === null) {
      console.error('Erreur : patientAssocie est null');
    }
  }

  onFileDropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.selectedFiles.push(file);
          this.previewFile(file);
        });
      }
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    for (const file of files) {
      this.selectedFiles.push(file);
      this.previewFile(file);
    }
  }

  previewFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = reader.result;
      this.filePreviews.push(this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl as string));
    };
    reader.readAsDataURL(file);
  }

  onUpload() {
    if (!this.selectedFiles.length) {
      this.toastr.error('No files selected!');
      return;
    }
  
    const formData = new FormData();
    this.selectedFiles.forEach((file) => {
      formData.append('file', file, file.name);
    });
  
    formData.append('titre', this.pdfTitle);
    formData.append('total_pages', String(this.totalPages));
    formData.append('categorie', this.categorie);
    formData.append('etat', this.etat);
    formData.append('patient_associé', String(this.patientAssocie));
  
    const token = this.authService.getToken();
  
    if (token) {
      this.pdfUploadService.uploadPdf(formData, token).subscribe({
        next: (response) => {
          this.toastr.success('File uploaded successfully!');
          this.getPdfs(); // Refresh the list of PDFs after upload
          this.router.navigate(['/listpdf']);
        },
        error: (error) => {
          this.toastr.error('Failed to upload file.');
          console.error('Upload error:', error);
        }
        
      });
    } else {
      this.toastr.error('Authentication token not found!');
      console.error('Authentication token not found!');
    }
  }
  getPdfs() {
    const token = this.authService.getToken();
    if (token) {
      this.pdfUploadService.getFile(token).subscribe({
        next: (response) => {
          this.Pdf = response; // Assignez les PDFs reçus à une variable pour l'affichage
        },
        error: (error) => {
          this.toastr.error('Failed to load PDFs.');
          console.error('Error loading PDFs:', error);
        }
      });
    }
  }
  
}
