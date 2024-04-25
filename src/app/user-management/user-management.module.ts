import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ConfirmeresetpasswordComponent } from './confirmeresetpassword/confirmeresetpassword.component';





@NgModule({
  declarations: [

    RegisterComponent,
    ResetPasswordComponent,
    ConfirmeresetpasswordComponent,
   
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class UserManagementModule { }
