import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profilepatient',
  templateUrl: './profilepatient.component.html',
  styleUrls: ['./profilepatient.component.css']
})
export class ProfilepatientComponent {
  constructor(private router: Router) { }
 
  goToPatientPage() {
    this.router.navigate(['/patient-dashboard']);
}
}
