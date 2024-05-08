import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './user-management/register/register.component';
import { ResetPasswordComponent } from './user-management/reset-password/reset-password.component';
import { ConfirmeresetpasswordComponent } from './user-management/confirmeresetpassword/confirmeresetpassword.component';
import { AuthGuard } from './guards/authguard';
import { PatientPdfComponentComponent } from './patient-pdf/patient-pdf-component/patient-pdf-component.component';
import { AdminPdfComponentComponent } from './admin-pdf/admin-pdf-component/admin-pdf-component.component';
import { Role } from './model/usermodel';


const routes: Routes = [
  { path: '', component: RegisterComponent },
  { path: 'resetpassword', component: ResetPasswordComponent },
  { path: 'confirmepwd/:uidb64/:token', component: ConfirmeresetpasswordComponent },
  { path: 'patient-dashboard', component: PatientPdfComponentComponent, canActivate: [AuthGuard], data: { roles: [Role.PATIENT] } },
  { path: 'admin-dashboard', component: AdminPdfComponentComponent, canActivate: [AuthGuard], data: { roles: [Role.ADMINISTRATEUR] } },
 
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
