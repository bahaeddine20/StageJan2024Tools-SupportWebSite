import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { SidenavComponent } from '../components/sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { HomeComponent } from '../modules/home/home.component';
import { LoginComponent } from '../modules/login/login.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TeamsComponent } from '../modules/crud/teams/teams.component';
import { EmployeesComponent } from '../modules/crud/employees/employees.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    MatSidenavModule,
    MatDividerModule,
    HomeComponent,
    LoginComponent,
    TeamsComponent,
    EmployeesComponent
    
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  sideBarOpen = true;
  constructor(){}
  ngOnInit(): void { }

  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }
  
}
