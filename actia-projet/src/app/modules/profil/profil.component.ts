import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { ProfileImage, User } from './user';
import { UserDtoService } from '../../_services/UserDto/user-dto.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../_services/loginService/auth.service';
import { TokenStorageService } from '../../_services/loginService/token-storage.service';
import { ChangePasswordRequest } from './change-password-request';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent implements OnInit {
  selectedFile?: File;
  userId: number | null = null;
  isEditing = false;
  isCardActive : boolean = false;
  isLoggedIn = false;
  oldPassword!: string;
  newPassword!: string;
  confirmPassword!: string;
  userForm!: FormGroup;
  roles: string[] = [];
  showPasswordOld: boolean = false;
  showPasswordNew: boolean = false;
  showPasswordConfirm: boolean = false;

togglePasswordVisibilityOld(): void {
  this.showPasswordOld = !this.showPasswordOld;
}

togglePasswordVisibilityNew(): void {
  this.showPasswordNew = !this.showPasswordNew;
}
togglePasswordVisibilityConfirm(): void {
  this.showPasswordConfirm = !this.showPasswordConfirm;
}

  user: User = {
    id: this.tokenStorage.getUser(), // example id
    username: '',
    email: '',
    city: '',
    position: '',
    linkedInLink: '',
    gitLink: '',
    personalLink: ''
  };
  passwordChange: ChangePasswordRequest = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  constructor(
    private userService: UserDtoService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private tokenStorage: TokenStorageService,
    private fb: FormBuilder,
  ) {}
  
  ngOnInit() {
    const user = this.tokenStorage.getUser();  // Récupérer l'ID de l'utilisateur
    if (user && user.id) {
      this.userService.getUserById(user.id).subscribe(data => {
        this.user = data;
        console.log('User data loaded', data);
      }, error => {
        console.error('Failed to fetch user:', error);
      });
    } else {
      console.error('No user ID found');
    }
    this.refreshUserData();
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorage.getUser();
      this.roles = user.roles;
    }
  }
  getImageUrl(image?: ProfileImage): SafeUrl {
    if (image && image.picByte) {
      const imageUrl = `data:${image.type};base64,${image.picByte}`;
      return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    } else {
      const firstLetter = this.user.username ? this.user.username.charAt(0).toUpperCase() : 'U';
      const avatarUrl = `https://ui-avatars.com/api/?name=${firstLetter}&background=bdd248&color=fff`;
      console.log("Fallback avatar URL:", avatarUrl); // Ajoutez ce log pour vérifier l'URL
      return this.sanitizer.bypassSecurityTrustUrl(avatarUrl);
  }
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }
  refreshUserData() {
    const user = this.tokenStorage.getUser();
    if (user && user.id) {
      this.userService.getUserById(user.id).subscribe(data => {
        this.user = data;
      }, error => {
        console.error('Failed to fetch user:', error);
      });
    }
  }
  updateUser(): void {
    if (!this.user.id) {
      this.snackBar.open('User ID is undefined.', 'Close', { duration: 3000 });
      return;
    }

    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(this.user)], { type: 'application/json' }));
    if (this.selectedFile) {
      formData.append('imagePath', this.selectedFile);
    }
    if (this.passwordChange.oldPassword && this.passwordChange.newPassword && this.passwordChange.confirmPassword) {
      formData.append('passwordChange', new Blob([JSON.stringify(this.passwordChange)], { type: 'application/json' }));
    }

    this.userService.updateUser(this.user.id, this.user, this.passwordChange, formData).subscribe({
      next: (response) => {
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 2000 });
        this.refreshUserData();
      },
      error: (error) => {
        this.snackBar.open('Failed to update profile: ' + error.error.message, 'Close', { duration: 3000 });
      }
    });
  }
  openCard() {
    console.log('Opening card...');
    this.isCardActive = true;
  }

  closeCard() {
    console.log('Closing card...');
    this.isCardActive = false;
  }
}
