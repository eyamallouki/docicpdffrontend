import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdmineserviceService } from '../service/admineservice.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { PatientserviceService } from 'src/app/patient-pdf/service/patientservice.service';

@Component({
  selector: 'app-viewfiles',
  templateUrl: './viewfiles.component.html',
  styleUrls: ['./viewfiles.component.css']
})
export class ViewfilesComponent implements OnInit {
  patientId: number;
  pdfFiles: any[] = [];
  txtFiles: any[] = [];
  jpgFiles: any[] = [];
  pngFiles: any[] = [];
  otherFiles: any[] = [];
  selectedPdfUrl: string | null = null;
  pdfViewerVisible: boolean = false;

  constructor(
    private adminService: AdmineserviceService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private fileService: PatientserviceService
  ) {
    this.patientId = +this.route.snapshot.params['id']; // Ensure it's a number
  }

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(): void {
    this.adminService.getPatientFiles(this.patientId).subscribe(
      (data: any) => {
        this.pdfFiles = data.pdf_files || [];
        this.txtFiles = data.txt_files || [];
        this.jpgFiles = data.jpg_files || [];
        this.pngFiles = data.png_files || [];
        this.otherFiles = data.other_files || [];
      },
      (error) => {
        console.error('Error loading files:', error);
        this.toastr.error('Error loading files');
      }
    );
  }
  viewPdf(filename: string): void {
    this.selectedPdfUrl = this.adminService.getPdfUrl(filename);
    this.pdfViewerVisible = true;
    if (this.selectedPdfUrl) {
      console.log('Selected PDF URL:', this.selectedPdfUrl); // Debugging log
    }
  }
  
  closePdfViewer(): void {
    this.pdfViewerVisible = false;
    this.selectedPdfUrl = null;
  }
  
  

  onPdfLoadError(error: any): void {
    console.error('PDF Load Error:', error);
  }

  deletePdf(id: number): void {
    const token = 'your_auth_token_here'; // Replace with actual token retrieval logic
    this.adminService.deleteFile(id, token).subscribe(
      () => {
        console.log(`File with ID ${id} deleted successfully.`);
        this.toastr.success('PDF deleted successfully');
        this.resetFiles();
      },
      (error) => {
        console.error('Error deleting file:', error);
        this.toastr.error('Error deleting PDF');
      }
    );
  }

  resetFiles(): void {
    this.pdfFiles = [];
    this.loadFiles();
  }

 
}
