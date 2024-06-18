import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-pdf-component',
  templateUrl: './admin-pdf-component.component.html',
  styleUrls: ['./admin-pdf-component.component.css']
})
export class AdminPdfComponentComponent {
  constructor(private router: Router) { }
  goToPatientPage() {
    this.router.navigate(['/patient-dashboard']);
}
}
