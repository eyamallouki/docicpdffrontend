import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './user-management/register/register.component';
import { RouterModule } from '@angular/router';
import { UserManagementModule } from './user-management/user-management.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthInterceptor } from './interceptors/AuthInterceptor';

import { NgxPaginationModule } from 'ngx-pagination';
import { MatIconModule } from '@angular/material/icon';

import { ToastrModule } from 'ngx-toastr';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { MatPaginatorModule } from '@angular/material/paginator';
import { PatientPdfModule } from './patient-pdf/patient-pdf.module';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { AdminPdfModule } from './admin-pdf/admin-pdf.module';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';



@NgModule({
  declarations: [
    AppComponent,
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    UserManagementModule,
    MatPaginatorModule,
    NgxDocViewerModule,
    NgxExtendedPdfViewerModule,
    AdminPdfModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    NgxPaginationModule ,
    MatIconModule,
    NgxFileDropModule,
    BrowserAnimationsModule, 
    MatDialogModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(), 
    PatientPdfModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    NgxDocViewerModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }