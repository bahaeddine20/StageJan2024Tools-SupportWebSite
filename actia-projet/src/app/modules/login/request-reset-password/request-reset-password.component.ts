import { Component } from '@angular/core';
import { AuthService } from '../../../_services/loginService/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-request-reset-password',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,  // Ensure FormsModule is imported for ngModel
    HttpClientModule  // Ensure HttpClientModule is imported for http calls
  ],
  templateUrl: './request-reset-password.component.html',
  styleUrls: ['./request-reset-password.component.scss']
})
export class RequestResetPasswordComponent {
  email: string = '';
  message: string = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (this.email) {
      this.authService.requestResetPassword(this.email).subscribe({
        next: (response) => {
          this.message = 'Reset password link sent!'; // Update message on success
          console.log('Reset password link sent!');
        },
        error: (error) => {
          this.message = 'Failed to send reset link. Please try again later.';
          console.error('Reset request error:', error);
        }
      });
    }
  }
}
