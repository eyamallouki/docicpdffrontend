import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdmineserviceService } from '../service/admineservice.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ExtractedImage } from 'src/app/model/PDF';

@Component({
  selector: 'app-viewfiles',
  templateUrl: './viewfiles.component.html',
  styleUrls: ['./viewfiles.component.css']
})
export class ViewfilesComponent implements OnInit {
  patientId: number;
  pdfFiles: any[] = [];
  selectedPdfUrl: string | null = null;
  pdfViewerVisible = false;
  modalAction: string = '';
  modalData: any = {};
  selectedPdfId: number | null = null;
  txtFiles: any[] = [];
  jpgFiles: any[] = [];
  pngFiles: any[] = [];
  pages: number[] = [];
  p = 1;
  pageIndex = 1;
  pageSize = 3;
  selectedFile: any;
  pdfPages: any[] = [];
  isLoading = false;
  selectedImageUrl: SafeUrl | null = null;
  selectedDocxUrl: SafeUrl | null = null;
  cropCoordinates: any = null;
  @ViewChild('summaryModal') summaryModalTemplate!: TemplateRef<any>;  
  summary: string | null = null;
  ocrText = '';  
  ocrImages: string[] = []; 
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild('actionDialogTemplate') actionDialogTemplate!: TemplateRef<any>;
  @ViewChild('docxModalTemplate') docxModalTemplate!: TemplateRef<any>;
  extractedImages: any[] = [];
  selectedImage: any;
  formattedSummary!: string[];
  selectedImageId: number | null = null;
  @ViewChild('imageModalTemplate') imageModalTemplate!: TemplateRef<any>;
  @ViewChild('ocrModalTemplate') ocrModalTemplate!: TemplateRef<any>;
  @ViewChild('imageCanvas', { static: false }) imageCanvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private image = new Image();
  private startX = 0;
  private startY = 0;
  private endX = 0;
  private endY = 0;
  croppedImage: string | null = null;
  

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
    if (this.imageCanvas && this.imageCanvas.nativeElement) {
      this.ctx = this.imageCanvas.nativeElement.getContext('2d')!;
  }
  }

  loadFiles(): void {
    this.adminService.getPatientFiles(this.patientId).subscribe(
      (data: any) => {
        this.pdfFiles = data.pdf_files || [];
        this.txtFiles = data.txt_files || []; 
        this.jpgFiles = data.jpg_files || [];
        this.pngFiles = data.png_files || [];
        this.extractedImages = data.extracted_images || [];
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

  viewImage1(fileName: string): void {
    const imageUrl = `http://localhost:8000${fileName}`; // Utilisez directement l'URL reçue du backend
  
    this.adminService.getImage(imageUrl).subscribe(response => {
      const objectURL = URL.createObjectURL(response);
      this.selectedImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.dialog.open(this.imageModalTemplate, {
        width: '50vw',
        height: '500vh',
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

  formatSummary(summary: string): string[] {
    return summary.split('.').map(paragraph => paragraph.trim()).filter(paragraph => paragraph.length > 0);
  }

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

  // Méthode pour lancer l'OCR et afficher les images extraites
  performOCR(pdfId: number): void {
    this.adminService.performOCR(pdfId).subscribe(
      (response: any[]) => {
        if (response && response.length > 0) {
          this.extractedImages = response.map(img => ({
            ...img,
            image: this.adminService.getImageUrl(img.image)
          }));

          this.dialog.open(this.ocrModalTemplate, {
            width: '80vw',
            height: '80vh',
            panelClass: 'full-screen-modal'
          });
        } else {
          this.toastr.error('No images extracted from OCR');
        }
      },
      error => {
        this.toastr.error('Error performing OCR');
        console.error('OCR Error:', error);
      }
    );
  }
  
  selectImageForCropping(image: any): void {
    this.selectedImageId = image.id; // Ensure this is set
    this.selectedImage = image; // Set the image object for cropping
    console.log('Selected Image ID:', this.selectedImageId); // Log to ensure it's correctly set
    this.viewImage(image.image);  // Load the image for cropping
  }
  

  
  
  
  viewImage(imageUrl: string): void {
    this.adminService.getImage(imageUrl).subscribe(response => {
      const objectURL = URL.createObjectURL(response);
      this.image.src = objectURL;
  
      // Assurez-vous que l'image est correctement dessinée
      this.image.onload = () => {
        if (this.imageCanvas && this.imageCanvas.nativeElement) {
          this.ctx = this.imageCanvas.nativeElement.getContext('2d')!;
          this.ctx.clearRect(0, 0, this.imageCanvas.nativeElement.width, this.imageCanvas.nativeElement.height);
          this.ctx.drawImage(this.image, 0, 0, this.imageCanvas.nativeElement.width, this.imageCanvas.nativeElement.height);
        }
      };
    }, error => {
      this.toastr.error('Erreur lors de la récupération de l\'image');
      console.error('Erreur lors de la récupération de l\'image:', error);
    });
  }
  

  onMouseDown(event: MouseEvent): void {
    const rect = this.imageCanvas.nativeElement.getBoundingClientRect();
    this.startX = event.clientX - rect.left;
    this.startY = event.clientY - rect.top;
  }

  onMouseMove(event: MouseEvent): void {
    if (event.buttons !== 1) return;

    this.endX = event.clientX - this.imageCanvas.nativeElement.getBoundingClientRect().left;
    this.endY = event.clientY - this.imageCanvas.nativeElement.getBoundingClientRect().top;

    this.ctx.clearRect(0, 0, this.imageCanvas.nativeElement.width, this.imageCanvas.nativeElement.height);
    this.ctx.drawImage(this.image, 0, 0, this.imageCanvas.nativeElement.width, this.imageCanvas.nativeElement.height);
    this.ctx.strokeStyle = 'red';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(this.startX, this.startY, this.endX - this.startX, this.endY - this.startY);
  }

  cropImage(): void {
    if (this.image && this.imageCanvas && this.imageCanvas.nativeElement) {
      const canvasWidth = this.imageCanvas.nativeElement.width;
      const canvasHeight = this.imageCanvas.nativeElement.height;
  
      const originalImageWidth = this.image.naturalWidth;
      const originalImageHeight = this.image.naturalHeight;
  
      const scaleX = originalImageWidth / canvasWidth;
      const scaleY = originalImageHeight / canvasHeight;
  
      const width = Math.abs(this.endX - this.startX) * scaleX;
      const height = Math.abs(this.endY - this.startY) * scaleY;
      const cropStartX = Math.min(this.startX, this.endX) * scaleX;
      const cropStartY = Math.min(this.startY, this.endY) * scaleY;
  
      if (width > 0 && height > 0) {
        const cropCoordinates = {
          x: cropStartX,
          y: cropStartY,
          width: width,
          height: height
        };
  
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = width;
        croppedCanvas.height = height;
  
        const croppedCtx = croppedCanvas.getContext('2d');
        croppedCtx?.drawImage(
          this.image,
          cropStartX, cropStartY, width, height,
          0, 0, width, height
        );
  
        const croppedImageDataUrl = croppedCanvas.toDataURL('image/png'); // Convert cropped portion to base64 image
  
        this.saveCroppedImage(cropCoordinates, croppedImageDataUrl); // Pass coordinates and the cropped image
      } else {
        this.toastr.error('Invalid cropping area. Please try again.');
      }
    }
  }
  
  saveCroppedImage(cropCoordinates: any, croppedImage: string): void {
    if (this.selectedImageId && croppedImage) {
      this.adminService.cropImage(this.selectedImageId, cropCoordinates, croppedImage).subscribe(
        (response) => {
          this.toastr.success('Cropped image saved successfully');
          
          // Vérifiez si le backend renvoie bien le type et le fichier
          if (response && response.file && response.fileType) {
            const file = {
              titre: response.titre || 'Cropped Image',  // Nom du fichier
              categorie: response.categorie || 'N/A',    // Catégorie
              etat: response.etat || 'Modified',         // État du fichier
              date_modification: new Date(),             // Date de modification
              file: response.file                        // URL du fichier
            };
  
            // Ajouter dans le tableau JPG ou PNG en fonction du type de fichier
            if (response.fileType === 'jpg') {
              this.jpgFiles.push(file);
            } else if (response.fileType === 'png') {
              this.pngFiles.push(file);
            } else {
              this.toastr.error('Unknown file type returned from server.');
            }
          } else {
            this.toastr.error('Invalid response from server.');
          }
  
          this.closeImageModal();
        },
        (error) => {
          this.toastr.error('Error saving cropped image');
          console.error('Error:', error);
        }
      );
    } else {
      this.toastr.error('No image selected or cropping data is missing.');
    }
  }
  

  closeImageModal(): void {
    this.dialog.closeAll();
  }
  
}
