import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientPdfComponentComponent } from './patient-pdf-component/patient-pdf-component.component';
import { UploadfilepatientComponent } from './patient-pdf/uploadfilepatient/uploadfilepatient.component';
import { ProfilepatientComponent } from './profilepatient/profilepatient.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxFileDropModule } from 'ngx-file-drop';
import { ListpdfComponentComponent } from './listpdf-component/listpdf-component.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { SideBarComponent } from './sidbar-patient/side-bar/side-bar.component';
import { AppRoutingModule } from '../app-routing.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatIconModule } from '@angular/material/icon';
import { NgxDocViewerModule } from 'ngx-doc-viewer';



@NgModule({
  declarations: [
    PatientPdfComponentComponent,
    UploadfilepatientComponent,
    ProfilepatientComponent,
    ListpdfComponentComponent,
    DialogContentComponent,
    SideBarComponent,

  
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxFileDropModule,
    NgxExtendedPdfViewerModule,
    NgxPaginationModule ,
    BrowserAnimationsModule,
    MatFormFieldModule,
    NgxDocViewerModule,
    MatDialogModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatIconModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(), 
    NgxDocViewerModule
  ]
})
export class PatientPdfModule { }
