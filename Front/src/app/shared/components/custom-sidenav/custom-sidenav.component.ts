import { Component, Input, OnInit, computed, signal } from '@angular/core';
import { observable } from 'mobx';
import { AuthService } from '../../../_services/auth.service';
import { TokenStorageService } from '../../../_services/token-storage.service';

export type MenuItem = {
  icon: string;
  label: string;
  route: string;
};

@Component({
  selector: 'app-custom-sidenav',
  templateUrl: './custom-sidenav.component.html',
  styleUrls: ['./custom-sidenav.component.scss']
})
export class CustomSidenavComponent implements OnInit{
  username?: string; // Initialisez les propriétés ou déclarez-les comme optionnelles en ajoutant ? après leur nom
  email?: string;
  profilePicUrl?: string = "assets/images/user.png";
  roles: string[] = [];
  isLoggedIn = false;
  sideNavCollapsed = signal(false);
  @Input() set isCollapsed(val: boolean){
    this.sideNavCollapsed.set(val)
  }
  @observable menuItems: MenuItem[] = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: 'dashboard'
    },
    {
      icon: 'home',
      label: 'Home',
      route: 'home'
    },
    {
      icon: 'list',
      label: 'List',
      route: 'list'
    }
  ];
  profilePicSize = computed(() => this.sideNavCollapsed() ? '32' : '100')
  constructor(private tokenStorageService: TokenStorageService) {}
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.profilePicUrl = user.profilePicUrl;
      this.username = user.username;
      this.email = user.email

    }
  }
  getProfileImage(): string {
    if (this.profilePicUrl) {
      return this.profilePicUrl;
    } else {
      const firstLetter = this.username ? this.username.charAt(0).toUpperCase() : '';
      const size = this.isCollapsed ? '32' : '100';
      return `https://ui-avatars.com/api/?name=${firstLetter}&background=random&color=fff&size=${size}`;
    }
  }
  
}
