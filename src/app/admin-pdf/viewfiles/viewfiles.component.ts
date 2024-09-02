import { Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdmineserviceService } from '../service/admineservice.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { ImageCroppedEvent } from 'ngx-image-cropper';


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
  @ViewChild('summaryModal') summaryModalTemplate!: TemplateRef<any>;  
  @ViewChild('imageModalTemplate') imageModalTemplate!: TemplateRef<any>;
  summary: string | null = null;
  ocrText: string = '';  
  ocrImages: string[] = []; 
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild('actionDialogTemplate') actionDialogTemplate!: TemplateRef<any>;
  @ViewChild('docxModalTemplate') docxModalTemplate!: TemplateRef<any>;
  extractedImages: any[] = [];
  selectedImage: any;
  formattedSummary!: string[];
  croppedImage: string | null = null;
  @ViewChild('ocrModalTemplate') ocrModalTemplate!: TemplateRef<any>;
  @ViewChild('imageCanvas', { static: true }) imageCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private image = new Image();
  private startX = 0;
  private startY = 0;
  private endX = 0;
  private endY = 0;
  

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
    // Ensure the fileName does not contain unnecessary prefixes
    if (fileName.startsWith('/media/pdfs/')) {
        fileName = fileName.replace('/media/pdfs/', '');
    } else if (fileName.startsWith('http://localhost:8000/media/pdfs/')) {
        fileName = fileName.replace('http://localhost:8000/media/pdfs/', '');
    }

    // Call the getImage method with the correctly formatted file name
    this.adminService.getImage(`media/pdfs/${fileName}`).subscribe(response => {
        const objectURL = URL.createObjectURL(response);
        this.selectedImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        // Open the image modal after setting the URL
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
}





  
  openImageModal(): void {
    this.dialog.open(this.imageModalTemplate, {
      width: '100vw',
      height: '100vh',
      maxWidth: '80vw',
      maxHeight: '80vh',
      panelClass: 'full-screen-modal'
    });
  }
  
  

  closeImageViewer(): void {
    this.selectedImageUrl = null;
  }

  resumerDocument(rapportId: number): void {
    const command = 'résumé ce rapport';
    this.isLoading = true;
  
    this.adminService.resumer(command, rapportId).subscribe(
      (response) => {
        this.summary = response.summary; 
        if (this.summary) {
          this.formattedSummary = this.formatSummary(this.summary);
        } else {
          this.formattedSummary = [];
        }
        this.isLoading = false;
        this.openSummaryModal();
      },
      (error) => {
        console.error('Erreur lors du résumé:', error);
        this.toastr.error('Erreur lors du résumé du document');
        this.isLoading = false;
      }
    );
  }

  // Format the summary into paragraphs
  formatSummary(summary: string): string[] {
    return summary.split('.').map(paragraph => paragraph.trim()).filter(paragraph => paragraph.length > 0);
  }

 


  // Méthode pour ouvrir un modal et afficher le résumé
  openSummaryModal(): void {
    if (!this.summaryModalTemplate) {
      console.error('summaryModalTemplate is not defined');
      return;
    }
  
    this.dialog.open(this.summaryModalTemplate, {
      width: '500px',
      data: { summary: this.summary }
    });
  }

 performOCR(pdfId: number): void {
  this.adminService.performOCR(pdfId).subscribe(
    (response: any) => {
      console.log(response);  // Log the response to ensure it's correct
      this.extractedImages = response;
      this.dialog.open(this.ocrModalTemplate, {
        width: '80vw',
        height: '80vh',
        panelClass: 'full-screen-modal'
      });
    },
    error => {
      this.toastr.error('Error performing OCR');
      console.error('OCR Error:', error);
    }
  );
}


  ngAfterViewInit() {
    this.ctx = this.imageCanvas.nativeElement.getContext('2d')!;
  }

  selectImageForCropping(image: any): void {
    this.selectedImage = image;
    this.image.src = image.image;  // Assuming image.image is the URL of the image
    this.image.onload = () => {
      this.imageCanvas.nativeElement.width = this.image.width;
      this.imageCanvas.nativeElement.height = this.image.height;
      this.ctx.drawImage(this.image, 0, 0);
      this.initCrop();
    };
    this.dialog.open(this.imageModalTemplate, {
      width: '80vw',
      height: '80vh',
      panelClass: 'full-screen-modal'
    });
  }

  initCrop(): void {
    this.imageCanvas.nativeElement.onmousedown = (e) => {
      this.startX = e.offsetX;
      this.startY = e.offsetY;
    };

    this.imageCanvas.nativeElement.onmousemove = (e) => {
      if (e.buttons !== 1) return;
      this.ctx.clearRect(0, 0, this.imageCanvas.nativeElement.width, this.imageCanvas.nativeElement.height);
      this.ctx.drawImage(this.image, 0, 0);
      this.ctx.strokeStyle = 'red';
      this.ctx.lineWidth = 2;
      this.endX = e.offsetX;
      this.endY = e.offsetY;
      this.ctx.strokeRect(this.startX, this.startY, this.endX - this.startX, this.endY - this.startY);
    };
  }

  cropImage(): void {
    const width = this.endX - this.startX;
    const height = this.endY - this.startY;
    const croppedImageCanvas = document.createElement('canvas');
    croppedImageCanvas.width = width;
    croppedImageCanvas.height = height;
    const croppedCtx = croppedImageCanvas.getContext('2d')!;
    croppedCtx.drawImage(this.image, this.startX, this.startY, width, height, 0, 0, width, height);
    this.croppedImage = croppedImageCanvas.toDataURL('image/png');
  }

  saveCroppedImage(): void {
    if (this.selectedImage && this.croppedImage) {
      const cropCoordinates = {
        x: this.startX,
        y: this.startY,
        width: this.endX - this.startX,
        height: this.endY - this.startY
      };

      this.adminService.cropImage(this.selectedImage.id, cropCoordinates).subscribe(
        () => {
          this.toastr.success('Image cropped and saved successfully');
          this.dialog.closeAll();
        },
        error => {
          this.toastr.error('Error saving cropped image');
          console.error('Crop Image Error:', error);
        }
      );
    }
  }

  closeImageModal(): void {
    this.dialog.closeAll();
  }
  
}
  
  