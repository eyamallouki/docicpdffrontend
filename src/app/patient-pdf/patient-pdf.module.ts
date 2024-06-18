import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientPdfComponentComponent } from './patient-pdf-component/patient-pdf-component.component';
import { UploadfilepatientComponent } from './patient-pdf/uploadfilepatient/uploadfilepatient.component';
import { ProfilepatientComponent } from './profilepatient/profilepatient.component';
import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxFileDropModule } from 'ngx-file-drop';
import { ListpdfComponentComponent } from './listpdf-component/listpdf-component.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { SideBarComponent } from './sidbar-patient/side-bar/side-bar.component';
import { AppRoutingModule } from '../app-routing.module';



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
    BrowserAnimationsModule, 
    MatDialogModule,
    AppRoutingModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(), 
  ]
})
export class PatientPdfModule { }
