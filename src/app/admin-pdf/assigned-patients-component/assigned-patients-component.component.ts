import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserserviceService } from 'src/app/user-management/service/userservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-assigned-patients',
  templateUrl: './assigned-patients-component.component.html',
  styleUrls: ['./assigned-patients-component.component.css']
})
export class AssignedPatientsComponentComponent implements OnInit {
  patients: any[] = [];
  assignForm!: FormGroup;
  currentPage = 1;

  constructor(private http: HttpClient, private userService: UserserviceService, private snackBar: MatSnackBar,
              private fb: FormBuilder) {}

  ngOnInit() {
    this.loadAssignedPatients();
    this.initAssignForm();
  }

  initAssignForm(): void {
    this.assignForm = this.fb.group({
      selectedPatientId: [null, Validators.required]
    });
  }

  assignUser(): void {
    const selectedPatientId = this.assignForm.value.selectedPatientId;
    if (selectedPatientId) {
      this.userService.assignUser(selectedPatientId, {}).subscribe(
        (response) => {
          console.log('User assigned successfully:', response);
          this.snackBar.open('User assigned successfully', 'Close', {
            duration: 5000
          });
        },
        (error) => {
          console.error('Error assigning user:', error);
          this.snackBar.open('Error assigning user', 'Close', {
            duration: 5000
          });
        }
      );
    } else {
      console.error('selectedPatientId is null.');
    }
  }

  loadAssignedPatients() {
    this.http.get('http://localhost:8000/auth/assigned-patients/').subscribe(
      (data: any) => {
        this.patients = data;
      },
      (error) => {
        console.error('Error loading patients:', error);
      }
    );
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
  }
}
