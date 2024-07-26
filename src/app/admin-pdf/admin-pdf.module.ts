import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPdfComponentComponent } from './admin-pdf-component/admin-pdf-component.component';
import { AssignedPatientsComponentComponent } from './assigned-patients-component/assigned-patients-component.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ViewfilesComponent } from './viewfiles/viewfiles.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from '../app-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  declarations: [
    AdminPdfComponentComponent,
    AssignedPatientsComponentComponent,
    ViewfilesComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    NgxExtendedPdfViewerModule,
    NgxFileDropModule,
    NgxExtendedPdfViewerModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    NgxDocViewerModule,
    MatDialogModule,
    AppRoutingModule,
    NgxDocViewerModule,
    MatMenuModule,
    MatIconModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(), 
    NgxDocViewerModule,
    NgxPaginationModule,
  ]
})
export class AdminPdfModule { }
