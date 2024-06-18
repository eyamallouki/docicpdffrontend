import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserserviceService } from 'src/app/user-management/service/userservice.service';
import { PatientserviceService } from '../service/patientservice.service';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.css']
})
export class DialogContentComponent implements OnInit {
  pdfFiles: any[] = [];
  txtFiles: any[] = [];
  jpgFiles: any[] = [];
  pngFiles: any[] = [];

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

  sanitizeFileUrl(fileUrl: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  }
}
