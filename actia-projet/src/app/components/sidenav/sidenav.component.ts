import { Component, Input, OnInit, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { observable } from 'mobx';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenStorageService } from '../../_services/loginService/token-storage.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProfileImage, User } from '../../modules/profil/user';
import { UserDtoService } from '../../_services/UserDto/user-dto.service';
export type MenuItem = {
  icon: string;
  label: string;
  route: string;
};
@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit{
  username?: string; // Initialisez les propriétés ou déclarez-les comme optionnelles en ajoutant ? après leur nom
  email?: string;
  profilePicUrl?: string = "assets/images/user.png";
  roles: string[] = [];
  isLoggedIn = false;
  sideNavCollapsed = signal(false);
  @Input() set isCollapsed(val: boolean){
    this.sideNavCollapsed.set(val)
  }
  user: User = {
    id: this.tokenStorageService.getUser(), // example id
    username: '',
    email: '',
    city: '',
    position: '',
    linkedInLink: '',
    gitLink: '',
    personalLink: ''
  };
  @observable menuItems: MenuItem[] = [
    {
      icon: 'home',
      label: 'Home',
      route: 'home'
    },
    {
      icon: 'person',
      label: 'Profil',
      route: 'profile'
    },
    {
      icon: 'list',
      label: 'List',
      route: 'list'
    },
    {
      icon: 'preview',
      label: 'Leave Request',
      route: 'congé'
    },
    {
      icon: 'access_time', // Utilisation de l'icône Material Icons
      label: 'Authorization',
      route: 'authorization'
    },
    {
      icon: 'maps',
      label: 'Map',
      route: 'maps'
    }
  ];
  profilePicSize = computed(() => this.sideNavCollapsed() ? '50' : '100')
  constructor(private tokenStorageService: TokenStorageService, private sanitizer: DomSanitizer,private userService: UserDtoService
  ) {}
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.profilePicUrl = user.profilePicUrl;
      this.username = user.username;
      this.email = user.email

    }
      const user = this.tokenStorageService.getUser();  // Récupérer l'ID de l'utilisateur
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
  }
  getProfileImage(image?: ProfileImage): SafeUrl {
    if (image && image.picByte) {
      const imageUrl = `data:${image.type};base64,${image.picByte}`;
      return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    } else {
      const firstLetter = this.username ? this.username.charAt(0).toUpperCase() : '';
      const size = this.isCollapsed ? '32' : '100';
      return `https://ui-avatars.com/api/?name=${firstLetter}&background=bdd248&color=fff&size=${size}`;
    }
  }
}
