import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdmineserviceService } from '../service/admineservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-viewfiles',
  templateUrl: './viewfiles.component.html',
  styleUrls: ['./viewfiles.component.css']
})
export class ViewfilesComponent implements OnInit {
  patientId: number;

  pdfFiles: any[] = [];
  selectedPdfUrl: string | null = null;
  pdfViewerVisible: boolean = false;
  modalAction: string = '';
  modalData: any = {};
  selectedPdfId: number | null = null;
  txtFiles: any[] = [];
  jpgFiles: any[] = [];
  pngFiles: any[] = [];
  p: number = 1;
  pageIndex = 0;
  pageSize = 3;
  length = 3;

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  constructor(
    private adminService: AdmineserviceService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this.patientId = +this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(): void {
    this.adminService.getPatientFiles(this.patientId).subscribe(
      (data: any) => {
        this.pdfFiles = data.pdf_files || [];
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
      console.log('Selected PDF URL:', this.selectedPdfUrl);
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
    this.adminService.deleteFile(id).subscribe(
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

  openModal(action: string, file: any): void {
    this.modalAction = action;
    this.selectedPdfId = file.id;
    this.modalData = {}; // Clear modal data
    this.dialog.open(this.dialogTemplate);
  }

  closeModal(): void {
    this.dialog.closeAll();
    this.modalAction = '';
    this.modalData = {};
    this.selectedPdfId = null;
  }

  confirmAction(): void {
    const { pageNumber, newPosition, pages, direction } = this.modalData;

    if (this.modalAction === 'extractPages' || this.modalAction === 'rotatePages') {
      const pageArray = (typeof pages === 'string') ? pages.split(',').map(Number) : pages;
      this.modalData.pages = pageArray;
    }

    switch (this.modalAction) {
      case 'addPage':
        const newPageInput = document.getElementById('newPageFile') as HTMLInputElement;
        if (newPageInput && newPageInput.files && newPageInput.files.length > 0) {
          const newPageFile = newPageInput.files[0];
          this.addNewPage(this.selectedPdfId!, newPageFile);
        } else {
          this.toastr.error('Please select a file to add');
        }
        break;
      case 'extractPages':
        this.extractPages(this.selectedPdfId!, this.modalData.pages);
        break;
      case 'movePage':
        if (pageNumber !== null && newPosition !== null) {
          this.movePage(this.selectedPdfId!, pageNumber, newPosition);
        } else {
          this.toastr.error('Please specify the page number and new position');
        }
        break;
      case 'rotatePages':
        const rotationAngle = direction === 'right' ? 90 : -90;
        this.rotatePages(this.selectedPdfId!, this.modalData.pages, rotationAngle);
        break;
      default:
        break;
    }
    this.closeModal();
  }

  addNewPage(pdfId: number, newPageFile: File): void {
    this.adminService.addNewPage(pdfId, newPageFile).subscribe(
      (response) => {
        this.toastr.success('New page added successfully');
        this.loadFiles();
      },
      (error) => {
        console.error('Error adding new page:', error);
        this.toastr.error('Error adding new page');
      }
    );
  }

  extractPages(pdfId: number, pages: number[]): void {
    this.adminService.extractPages(pdfId, pages).subscribe(
      (response) => {
        this.toastr.success('Pages extracted successfully');
        this.loadFiles();
      },
      (error) => {
        console.error('Error extracting pages:', error);
        this.toastr.error('Error extracting pages');
      }
    );
  }

  movePage(pdfId: number, pageNumber: number, newPosition: number): void {
    this.adminService.movePage(pdfId, pageNumber, newPosition).subscribe(
      (response) => {
        this.toastr.success('Page moved successfully');
        this.loadFiles();
      },
      (error) => {
        console.error('Error moving page:', error);
        this.toastr.error('Error moving page');
      }
    );
  }

  rotatePages(pdfId: number, pages: number[], rotationAngle: number): void {
    this.adminService.rotatePages(pdfId, pages, rotationAngle).subscribe(
      (response) => {
        this.toastr.success('Pages rotated successfully');
        this.loadFiles();
      },
      (error) => {
        console.error('Error rotating pages:', error);
        this.toastr.error('Error rotating pages');
      }
    );
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    // Use pageIndex or pageSize as needed
  }
}
