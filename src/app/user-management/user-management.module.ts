import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ConfirmeresetpasswordComponent } from './confirmeresetpassword/confirmeresetpassword.component';
import { AuthInterceptor } from '../interceptors/AuthInterceptor';


@NgModule({
  declarations: [
    RegisterComponent,
    ResetPasswordComponent,
    ConfirmeresetpasswordComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class UserManagementModule { }
