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

  public onFileDropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.selectedFiles.push(file);
          this.readFile(file);
          this.getTotalPages(file);
        });
      }
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        this.selectedFiles.push(file);
        this.readFile(file);
        this.getTotalPages(file);
      }
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    for (const file of files) {
      this.selectedFiles.push(file);
      this.readFile(file);
      this.getTotalPages(file);
    }
  }

  private readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result) {
        this.filePreviews.push(this.sanitizer.bypassSecurityTrustResourceUrl(result as string));
      } else {
        console.error('Erreur : e.target.result est null');
      }
    };
    reader.readAsDataURL(file);
  }

  private getTotalPages(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result) {
        const typedArray = new Uint8Array(result as ArrayBuffer);
        pdfjsLib.getDocument(typedArray).promise.then((pdf) => {
          this.totalPages += pdf.numPages;
        }).catch(error => {
          console.error('Erreur lors du chargement du PDF :', error);
        });
      } else {
        console.error('Erreur : e.target.result est null');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  onUpload() {
    if (this.selectedFiles.length === 0) {
      console.error('Aucun fichier sélectionné');
      return;
    }

    if (this.patientAssocie === null) {
      console.error('patientAssocie est null');
      return;
    }

    const token = this.authService.getToken();

    if (token) {
      for (const file of this.selectedFiles) {
        const formData = new FormData();
        formData.append('titre', this.pdfTitle);
        formData.append('file', file);
        formData.append('total_pages', this.totalPages.toString());
        formData.append('categorie', this.categorie);
        formData.append('etat', this.etat);
        formData.append('patient_associé', this.patientAssocie.toString());

        this.pdfUploadService.uploadPdf(formData, token).subscribe(
          () => {
            this.toastr.success('Fichier uploadé avec succès');
          },
          error => {
            this.toastr.error('Erreur lors de l\'upload du fichier');
            console.error('Erreur lors de l\'upload du fichier :', error);
          }
        );
      }
      this.router.navigate(['/listpdf']);
    } else {
      console.error('Erreur : Token non trouvé');
    }
  }
}
