import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './user-management/register/register.component';
import { ResetPasswordComponent } from './user-management/reset-password/reset-password.component';
import { ConfirmeresetpasswordComponent } from './user-management/confirmeresetpassword/confirmeresetpassword.component';
import { AuthGuard } from './guards/authguard';
import { PatientPdfComponentComponent } from './patient-pdf/patient-pdf-component/patient-pdf-component.component';
import { AdminPdfComponentComponent } from './admin-pdf/admin-pdf-component/admin-pdf-component.component';
import { Role } from './model/usermodel';
import { ProfilepatientComponent } from './patient-pdf/profilepatient/profilepatient.component';
import { UploadfilepatientComponent } from './patient-pdf/patient-pdf/uploadfilepatient/uploadfilepatient.component';
import { AssignedPatientsComponentComponent } from './admin-pdf/assigned-patients-component/assigned-patients-component.component';
import { ListpdfComponentComponent } from './patient-pdf/listpdf-component/listpdf-component.component';
import { ViewfilesComponent } from './admin-pdf/viewfiles/viewfiles.component';


const routes: Routes = [
  { path: '', component: RegisterComponent },
  { path: 'resetpassword', component: ResetPasswordComponent },
  { path: 'confirmepwd/:uidb64/:token', component: ConfirmeresetpasswordComponent },
  { path: 'patient-dashboard', component: PatientPdfComponentComponent, canActivate: [AuthGuard], data: { roles: [Role.PATIENT] } },
  { path: 'admin-dashboard', component: AdminPdfComponentComponent, canActivate: [AuthGuard], data: { roles: [Role.ADMINISTRATEUR] } },
  {path: 'profilepatient', component:ProfilepatientComponent},
  {path:'upload', component:UploadfilepatientComponent},
  {path:'listpdf', component:ListpdfComponentComponent},
  { path: 'viewfile/:id', component: ViewfilesComponent },
  { path: 'assigned-patients', component: AssignedPatientsComponentComponent,canActivate: [AuthGuard], data: { roles: [Role.ADMINISTRATEUR] } } 
 
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
