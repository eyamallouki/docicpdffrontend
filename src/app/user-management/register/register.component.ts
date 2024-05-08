import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserserviceService } from '../service/userservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../service/notification-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Role } from 'src/app/model/usermodel';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  loginForm!: FormGroup;
  errorMessage!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserserviceService,
    private notificationService: NotificationService,
   
  ) { }

  ngOnInit(): void {
    this.loadScript('assets/js/animation.js');
    this.initRegisterForm();
    this.initLoginForm();
  }

  initRegisterForm(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  initLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  register(): void {
    if (this.registerForm.valid) {
      const user = this.registerForm.value;
      this.userService.register(user).subscribe(
        (response) => {
          console.log('User registered successfully:', response);
          // Vérifier l'e-mail après l'enregistrement
          this.notificationService.showSuccess('Vérifiez votre boîte e-mail pour activer votre compte.');
          this.verifyEmail();
          this.registerForm.reset();
        },
        (error) => {
          console.error('Registration failed:', error);
          this.errorMessage = 'Registration failed. Please try again.';
        }
      );
    }
  }

  verifyEmail(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.userService.verifyEmail(token).subscribe(
          (response) => {
            console.log('Email verification successful:', response);

          },
          (error) => {
            console.error('Email verification failed:', error);
          }
        );
      }
    });
  }

 // RegisterComponent.ts

login(): void {
  if (this.loginForm.valid) {
    const credentials = this.loginForm.value;
    this.userService.login(credentials).subscribe(
      (response) => {
        console.log('User logged in successfully:', response);
        this.userService.storeToken(response.token); 
        this.userService.setUserRole(response.role); 


        const role = response.role;
        switch (role) {
          case Role.ADMINISTRATEUR:
            this.router.navigate(['/admin-dashboard']); 
            break;
          case Role.PATIENT:
            this.router.navigate(['/patient-dashboard']); 
            break;
          default:
            this.router.navigate(['/']); 
        }
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  }
}

  
  

  loadScript(scriptUrl: string) {
    const body = <HTMLDivElement> document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = scriptUrl;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  } 

  redirectToForgotPassword(): void {
    this.router.navigate(['/resetpassword']);
  }
}
