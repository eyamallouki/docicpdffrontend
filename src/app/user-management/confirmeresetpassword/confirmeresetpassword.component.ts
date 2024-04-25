import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserserviceService } from 'src/app/user-management/service/userservice.service';

@Component({
  selector: 'app-confirmeresetpassword',
  templateUrl: './confirmeresetpassword.component.html',
  styleUrls: ['./confirmeresetpassword.component.css']
})
export class ConfirmeresetpasswordComponent implements OnInit {
  confirmPasswordForm!: FormGroup;
  message!: string;
  uidb64: string = '';
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private resetPasswordService: UserserviceService,
    private router: Router, 
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.confirmPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.checkPasswords });

    this.route.paramMap.subscribe(params => {
      this.uidb64 = params.get('uidb64') || '';
      this.token = params.get('token') || '';
    });
  }

  checkPasswords(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  confirmResetPassword() {
    if (this.confirmPasswordForm.valid && this.uidb64 && this.token) {
        const newPassword = this.confirmPasswordForm.value.newPassword;
        this.resetPasswordService.confirmResetPassword(newPassword, this.uidb64, this.token).subscribe(
            response => {
                console.log('Réponse du service reçue :', response);
                this.message = response.msg; 

            },
            error => {
                console.error('Une erreur s\'est produite lors de la confirmation du mot de passe :', error);
                this.message = 'An error occurred. Please try again later.';
            }
        );
    }
}

}
