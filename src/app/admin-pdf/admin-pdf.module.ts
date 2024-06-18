import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPdfComponentComponent } from './admin-pdf-component/admin-pdf-component.component';
import { AssignedPatientsComponentComponent } from './assigned-patients-component/assigned-patients-component.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { NgxPaginationModule } from 'ngx-pagination';





@NgModule({
  declarations: [
    AdminPdfComponentComponent,
    AssignedPatientsComponentComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    NgxPaginationModule,
  ]

})
export class AdminPdfModule { }
