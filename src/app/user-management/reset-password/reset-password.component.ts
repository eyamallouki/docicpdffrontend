import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserserviceService } from '../service/userservice.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  message!: string;

  constructor(private formBuilder: FormBuilder, private resetPasswordService: UserserviceService) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendResetPasswordRequest() {
    if (this.resetPasswordForm.valid) {
      const email = this.resetPasswordForm.value.email;
      this.resetPasswordService.sendResetPasswordRequest(email).subscribe(
        response => {
          this.message = response.message;
        },
        error => {
          console.error('An error occurred:', error);
          this.message = 'An error occurred. Please try again later.';
        }
      );
    } else {
      this.message = 'Please enter a valid email.';
    }
  }
}
