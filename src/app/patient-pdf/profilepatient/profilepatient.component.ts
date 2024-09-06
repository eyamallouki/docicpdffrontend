import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientserviceService } from '../service/patientservice.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserserviceService } from 'src/app/user-management/service/userservice.service';

@Component({
  selector: 'app-profilepatient',
  templateUrl: './profilepatient.component.html',
  styleUrls: ['./profilepatient.component.css']
})
export class ProfilepatientComponent implements OnInit {
  updateForm!: FormGroup;
  loading = false;
  userData: any;
  token!: string;

  constructor(
    private router: Router,
    private patientservice: PatientserviceService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private authService: UserserviceService  // Utilise le service d'auth pour obtenir le token
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.token = this.authService.getToken()!;  // Récupère le token via un service
    this.getUserProfile();  // Charger les données de l'utilisateur pour préremplir le formulaire
  }

  // Initialisation du formulaire
  initForm(): void {
    this.updateForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [''],  // Si tu as une liste de rôles
      is_active: [true],
      password: ['']  // Ce champ est optionnel
    });
  }

  // Récupérer les données de l'utilisateur
  getUserProfile(): void {
    this.patientservice.getUserProfile(this.token).subscribe(
      (response) => {
        this.userData = response;
        this.updateForm.patchValue({
          username: this.userData.username,
          email: this.userData.email,
          role: this.userData.role,
          is_active: this.userData.is_active
        });
      },
      (error) => {
        this.toastr.error('Échec du chargement des données utilisateur');
      }
    );
  }

  // Redirection vers le dashboard du patient
  goToPatientPage(): void {
    this.router.navigate(['/patient-dashboard']);
  }

  // Mise à jour du profil utilisateur
  updateUser(): void {
    if (this.updateForm.invalid) {
      return;
    }

    this.loading = true;
    this.patientservice.updateUserProfile(this.updateForm.value, this.token).subscribe(
      (response) => {
        this.toastr.success('Profil mis à jour avec succès');
        this.loading = false;
      },
      (error) => {
        this.toastr.error('Échec de la mise à jour du profil');
        this.loading = false;
      }
    );
  }
}
