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
import { AdminPdfModule } from './admin-pdf/admin-pdf.module';
import { NgxPaginationModule } from 'ngx-pagination';

import { ToastrModule } from 'ngx-toastr';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MatDialogModule } from '@angular/material/dialog';

import { PatientPdfModule } from './patient-pdf/patient-pdf.module';




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
    AdminPdfModule,
    MatSnackBarModule,
    NgxPaginationModule ,
    NgxFileDropModule,
    BrowserAnimationsModule, 
    MatDialogModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(), 
    PatientPdfModule,
    BrowserAnimationsModule,
    MatSnackBarModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }