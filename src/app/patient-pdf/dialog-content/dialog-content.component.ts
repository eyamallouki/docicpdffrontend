import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserserviceService } from 'src/app/user-management/service/userservice.service';
import { PatientserviceService } from '../service/patientservice.service';
import { PDFDocument, rgb } from 'pdf-lib';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.css']
})
export class DialogContentComponent implements OnInit {
  @ViewChild('imageInput', { static: false }) imageInput!: ElementRef<HTMLInputElement>;
  pdfFiles: any[] = [];
  txtFiles: any[] = [];
  jpgFiles: any[] = [];
  pngFiles: any[] = [];
  selectedPdfUrl: string | null = null;
  p: number = 1;
  selectedImageFile: File | null = null;
  isSignatureMode = false;
  signatureImageUrl: string | undefined;
  modifiedPdf: PDFDocument | null = null;
  pdfViewerVisible: boolean = false;
  textToAdd: string = '';
  modificationHistory: string[] = [];
  datas: any = { fileTypes: ['JPG', 'PNG'] };
  showImageSlider: boolean = false;
  imageObject: Array<object> = [];
  images: SafeResourceUrl[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { fileType: string },
    private fileService: PatientserviceService,
    private authService: UserserviceService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      this.fileService.getFiles(token).subscribe(
        (data: any) => {
          this.pdfFiles = data.pdf_files || [];
          this.txtFiles = data.txt_files || [];
          this.jpgFiles = data.jpg_files || [];
          this.pngFiles = data.png_files || [];
        },
        error => {
          this.toastr.error('Error retrieving files');
          console.error('Error retrieving files:', error);
        }
      );
    } else {
      console.error('Error: Token not found');
    }
  }
  viewPdf(filename: string): void {
    const fileUrl = this.fileService.getPdfUrl(filename);
    console.log('Generated PDF URL:', fileUrl); // Log the generated URL
    this.selectedPdfUrl = fileUrl;
    this.pdfViewerVisible = true; // Activer la visibilité du viewer
    this.isSignatureMode = false; // Assurez-vous que le mode signature est désactivé lors de la visualisation du PDF
  
  }

 

  onPdfLoadError(error: any): void {
    console.error('Error loading PDF:', error);
    this.toastr.error('Error loading PDF');
  } 

  onPageChange(event: number): void {
    this.p = event; // Assign the new page number
  }

  deletePdf(id: number | undefined): void {
    if (id === undefined) {
      console.error('Error: File ID is undefined');
      this.toastr.error('Error: Cannot delete file without a valid ID');
      return;
    }

    console.log('Deleting PDF with ID:', id);
    const token = this.authService.getToken();
    if (token) {
      this.fileService.deleteFile(id, token).subscribe(
        response => {
          this.toastr.success('PDF deleted successfully');
          // Refresh the file list
          this.pdfFiles = this.pdfFiles.filter(file => file.id !== id);
        },
        error => {
          this.toastr.error('Error deleting PDF');
          console.error('Error deleting PDF:', error);
        }
      );
    } else {
      console.error('Error: Token not found');
    }
  }

  zoomIn(): void {
    const viewer = document.querySelector('ngx-extended-pdf-viewer') as any;
    if (viewer) {
      viewer.zoomIn();
    }
  }

  zoomOut(): void {
    const viewer = document.querySelector('ngx-extended-pdf-viewer') as any;
    if (viewer) {
      viewer.zoomOut();
    }
  }

  searchInPdf(): void {
    const viewer = document.querySelector('ngx-extended-pdf-viewer') as any;
    if (viewer) {
      viewer.find();
    }
  }

  toggleFullScreen(): void {
    const viewer = document.querySelector('ngx-extended-pdf-viewer') as any;
    if (viewer) {
      viewer.presentationMode();
    }
  }

  downloadPdf(): void {
    const viewer = document.querySelector('ngx-extended-pdf-viewer') as any;
    if (viewer) {
      viewer.download();
    }
  }

  printPdf(): void {
    const viewer = document.querySelector('ngx-extended-pdf-viewer') as any;
    if (viewer) {
      viewer.print();
    }
  }


  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  
}
