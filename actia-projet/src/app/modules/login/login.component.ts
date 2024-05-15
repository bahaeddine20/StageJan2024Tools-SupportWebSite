import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../_services/loginService/auth.service';
import { TokenStorageService } from '../../_services/loginService/token-storage.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  signUpObj: any = {
    name: null,
    email: null,
    password: null
  };
  loginObj: any = {
    email: null,
    password: null
  };
  isSignDivVisible = false;
  isLoggedIn = false;
  isLoginFailed = false;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  formSubmitted = false; // To track if the form was submitted to trigger validations
  roles: string[] = [];
  showPasswordSignUp: boolean = false;
  showPasswordSignIn: boolean = false;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  togglePasswordVisibilitySignUp(): void {
    this.showPasswordSignUp = !this.showPasswordSignUp;
  }

  togglePasswordVisibilitySignIn(): void {
    this.showPasswordSignIn = !this.showPasswordSignIn;
  }

  onRegister(): void {
    this.formSubmitted = true;
    if (!this.signUpObj.name || !this.signUpObj.email || !this.signUpObj.password) {
      this.errorMessage = 'All fields are required. Please fill out every field.';
      return;
    }
    const { name, email, password } = this.signUpObj;
    this.authService.register(name, email, password).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.isSignDivVisible = false;
      },
      err => {
        this.errorMessage = 'Failed to register. Please try again.';
        this.isSignUpFailed = true;
      }
    );
  }

  onLogin(): void {
    this.formSubmitted = true;
    if (!this.loginObj.email || !this.loginObj.password) {
      this.errorMessage = 'Email and password must be filled out.';
      return;
    }
    const { email, password } = this.loginObj;
    this.authService.login(email, password).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        console.log(this.tokenStorage)
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.router.navigateByUrl('/home');
        console.log(this.router)
      },
      err => {
        this.errorMessage ='Invalid email or password. Please try again.';
        this.isLoginFailed = true;
      }
    );
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (this.isSignDivVisible) {
        // Si le formulaire d'inscription est visible, cliquez sur le bouton d'inscription
        const registerButton = document.getElementById('register-button');
        registerButton?.click();
      } else {
        // Sinon, cliquez sur le bouton de connexion
        const signInButton = document.getElementById('sign-in-button');
        signInButton?.click();
      }
    }
  }
   // Function to handle what happens when user wants to toggle view between Sign In and Sign Up
   toggleVisibility(signUp: boolean): void {
    this.isSignDivVisible = signUp;
    this.resetFormState();
  }

  // Resets form submission state and any errors
  resetFormState(): void {
    this.formSubmitted = false;
    this.isLoginFailed = false;
    this.isSignUpFailed = false;
    this.errorMessage = '';
  }
}
