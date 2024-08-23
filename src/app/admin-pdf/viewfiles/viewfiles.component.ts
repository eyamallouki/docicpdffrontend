import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdmineserviceService } from '../service/admineservice.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
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
  isLoading = false; // Ajoutez cette propriété
  selectedImageUrl: SafeUrl | null = null;
  selectedDocxUrl: SafeUrl | null = null;


  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild('actionDialogTemplate') actionDialogTemplate!: TemplateRef<any>;
  @ViewChild('imageModalTemplate') imageModalTemplate!: TemplateRef<any>;
  @ViewChild('docxModalTemplate') docxModalTemplate!: TemplateRef<any>;


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
            this.txtFiles = data.txt_files || []; 
            this.jpgFiles = data.jpg_files || [];
            this.pngFiles = data.png_files || [];
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
    this.isLoading = true; // Démarrer le spinner immédiatement
    this.modalAction = action;
    this.selectedFile = file; // Définir le fichier sélectionné
    this.selectedPdfId = file.id;
    this.modalData = {}; // Effacer les données du modal
  
    this.loadPdfPages(file.file); // Charger les pages PDF pour le drag-and-drop
  
    // Une fois que les pages sont chargées, ouvrez le modal
    this.dialog.open(this.actionDialogTemplate, {
      width: '500px'
    }).afterOpened().subscribe(() => {
      this.isLoading = false; // Masquer le spinner après l'ouverture du modal
    });
  }
  

  closeModal(): void {
    this.dialog.closeAll();
    this.modalAction = '';
    this.modalData = {};
    this.selectedPdfId = null;
  }

  confirmAction(): void {
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
        const selectedPages = this.pdfPages.filter(page => page.selected).map(page => page.pageNumber);
        if (selectedPages.length > 0) {
          this.extractPages(this.selectedPdfId!, selectedPages);
        } else {
          this.toastr.error('Please select at least one page to extract');
        }
        break;
      case 'rotatePages':
        const rotationPages = this.pdfPages.filter(page => page.selected).map(page => page.pageNumber);
        if (rotationPages.length > 0) {
          const rotationAngle = this.modalData.direction === 'right' ? 90 : -90;
          this.rotatePages(this.selectedPdfId!, rotationPages, rotationAngle);
        } else {
          this.toastr.error('Please select at least one page to rotate');
        }
        break;
      case 'movePage':
        this.updatePageOrder(this.selectedPdfId!, this.pdfPages.map(page => page.pageNumber));
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
    this.isLoading = true; // Démarrer le spinner
    this.adminService.getPdfPages(this.selectedPdfId!).subscribe(
      (pages: any[]) => {
        this.pdfPages = pages.map(page => ({
          thumbnail: this.sanitizer.bypassSecurityTrustUrl(page.thumbnail),
          pageNumber: page.page_number
        }));
        this.isLoading = false; // Arrêter le spinner
      },
      (error) => {
        console.error('Error loading PDF pages:', error);
        this.toastr.error('Error loading PDF pages');
        this.isLoading = false; // Arrêter le spinner même en cas d'erreur
      }
    );
  }
  
  updatePageOrder(pdfId: number, pageOrder: number[]): void {
    this.isLoading = true; // Démarrer le spinner
    this.adminService.updatePageOrder(pdfId, pageOrder).subscribe(
      (response) => {
        this.toastr.success('Page order updated successfully');
        this.selectedPdfUrl = this.adminService.getPdfUrl(response.file_url);
        this.isLoading = false; // Arrêter le spinner
      },
      (error) => {
        console.error('Error updating page order:', error);
        this.toastr.error('Error updating page order');
        this.isLoading = false; // Arrêter le spinner même en cas d'erreur
      }
    );
  }
  
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.pdfPages, event.previousIndex, event.currentIndex);
    this.updatePageOrder(this.selectedPdfId!, this.pdfPages.map(page => page.pageNumber));
  }

  viewImage(fileName: string): void {
    // Assurez-vous que le fileName n'est pas déjà une URL complète
    if (!fileName.startsWith('http://') && !fileName.startsWith('https://')) {
        // Si le fileName contient déjà le préfixe '/media/pdfs/', retirez-le
        if (fileName.startsWith('/media/pdfs/')) {
            fileName = fileName.replace('/media/pdfs/', '');
        }
        // Générer l'URL complète
        const fileUrl = `http://localhost:8000/pdf/media/pdfs/${fileName}`;
        this.adminService.getImage(fileUrl).subscribe(response => {
            const objectURL = URL.createObjectURL(response);
            this.selectedImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            this.dialog.open(this.imageModalTemplate, {
                width: '80vw',
                height: '80vh',
                maxWidth: '80vw',
                maxHeight: '80vh',
                panelClass: 'full-screen-modal'
            });
        }, error => {
            console.error('Error fetching image:', error);
            this.toastr.error('Error fetching image');
        });
    } else {
        console.error('Invalid image URL');
        this.toastr.error('Invalid image URL');
    }
}






  viewDocxFile(fileName: string): void {
    this.adminService.getDocx(fileName).subscribe(response => {
      const objectURL = URL.createObjectURL(response);
      this.selectedDocxUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.dialog.open(this.docxModalTemplate, {
        width: '80vw',
        height: '80vh',
        maxWidth: '80vw',
        maxHeight: '80vh',
        panelClass: 'full-screen-modal'
      });
    }, error => {
      console.error('Error fetching DOCX file:', error);
      this.toastr.error('Error fetching DOCX file');
    });
  }
  

  closeImageViewer(): void {
    this.selectedImageUrl = null;
  }
}
  
  