import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-pdf-component',
  templateUrl: './patient-pdf-component.component.html',
  styleUrls: ['./patient-pdf-component.component.css']
})
export class PatientPdfComponentComponent {

  constructor(private router: Router) { }
 
  goToPatientPage() {
    this.router.navigate(['/patient-dashboard']);
}

}
