import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdmineserviceService } from '../service/admineservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
  pages: number[] = [];
  p: number = 1;
  pageIndex = 1;
  pageSize = 3;
  selectedFile: any;
  pdfPages: any[] = [];

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild('actionDialogTemplate') actionDialogTemplate!: TemplateRef<any>;

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

  viewPdf(file: any): void {
    this.selectedFile = file;
    this.selectedPdfUrl = this.adminService.getPdfUrl(file.file);
    if (this.selectedPdfUrl) {
      this.openModal1();
    }
  }

  openModal1(): void {
    this.dialog.open(this.dialogTemplate, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-modal'
    });
  }

  closeModal1(): void {
    this.dialog.closeAll();
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
    this.selectedFile = file; // Set the selected file
    this.selectedPdfId = file.id;
    this.modalData = {}; // Clear modal data
    this.loadPdfPages(file.file); // Load PDF pages for drag-and-drop
    this.dialog.open(this.actionDialogTemplate, {
      width: '500px'
    });
  }

  closeModal(): void {
    this.dialog.closeAll();
    this.modalAction = '';
    this.modalData = {};
    this.selectedPdfId = null;
  }

  confirmAction(): void {
    const { pages, direction } = this.modalData;

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
        this.updatePageOrder(this.selectedPdfId!, this.pdfPages.map(page => page.pageNumber));
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
  }

  loadPdfPages(pdfFile: string): void {
    this.adminService.getPdfPages(this.selectedPdfId!).subscribe(
      (pages: any[]) => {
        this.pdfPages = pages.map(page => ({
          thumbnail: this.sanitizer.bypassSecurityTrustUrl(page.thumbnail),
          pageNumber: page.page_number
        }));
      },
      (error) => {
        console.error('Error loading PDF pages:', error);
        this.toastr.error('Error loading PDF pages');
      }
    );
  }
  
  updatePageOrder(pdfId: number, pageOrder: number[]): void {
    this.adminService.updatePageOrder(pdfId, pageOrder).subscribe(
      (response) => {
        this.toastr.success('Page order updated successfully');
        // Mettez à jour l'URL du PDF pour refléter les changements
        this.selectedPdfUrl = this.adminService.getPdfUrl(response.file_url);
        //this.viewPdf({ file: response.file_url });
      },
      (error) => {
        console.error('Error updating page order:', error);
        this.toastr.error('Error updating page order');
      }
    );
  }
  
  
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.pdfPages, event.previousIndex, event.currentIndex);
    this.updatePageOrder(this.selectedPdfId!, this.pdfPages.map(page => page.pageNumber));
  }
  
}
