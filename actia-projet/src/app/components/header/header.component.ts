import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { CommonModule } from '@angular/common';
import { TokenStorageService } from '../../_services/loginService/token-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslationModule } from '../../translation/translation.module';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NotificationComponent } from '../notification/notification.component';
import { RequestService } from '../../_services/Request/request.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    SidenavComponent,
    CommonModule,
    RouterModule,
    TranslationModule,
    NotificationComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  notifications: Notification[] = [];
  title = 'material-responsive-sidenav';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isCollapsed = true;
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  isSuccessful = false;
  isMobileDevice = false;
  constructor(private tokenStorageService: TokenStorageService,  
    private router: Router, private translate: TranslateService,
    private breakpointObserver: BreakpointObserver,
    private requestService: RequestService) {
    translate.setDefaultLang('en');
    translate.use('en');
    this.breakpointObserver.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.HandsetLandscape
    ]).subscribe(result => {
      this.isMobileDevice = result.matches;
    });
     }
     switchLanguage(language: string) {
      this.translate.use(language);
    }
  ngOnInit():void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
    }
    this.fetchNotifications();
  }
  fetchNotifications(): void {
    this.requestService.getNotifications().subscribe(
      (notifications) => {
        this.notifications = notifications;
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }
  toggleMenu() {
      this.sidenav.open(); 
      this.isCollapsed = !this.isCollapsed;
  }
  logout(): void {
    this.tokenStorageService.signOut();
    this.router.navigate(['/login']); // Navigate to the login page
  }
  showGoTopLink = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Logic to show or hide the moving link based on scroll position
    const threshold = 100; // Number of pixels scrolled down to show the link
    this.showGoTopLink = window.scrollY > threshold;
  }

  goToTop() {
    window.scrollTo(0, 0); // Scrolls to the top of the page
  }
}