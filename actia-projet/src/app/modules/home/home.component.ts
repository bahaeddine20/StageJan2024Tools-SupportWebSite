import { Component, OnInit } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from '../crud/employees/employees.component';
import { EmployeeService } from '../../_services/employees/employee.service';
import { TeamService } from '../../_services/teams/team.service';
import { TeamsComponent } from '../crud/teams/teams.component';
import { TranslateService } from '@ngx-translate/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { LanguageService } from '../../_services/language/language.service';
import { TranslationModule } from '../../translation/translation.module';
import { Router } from '@angular/router';
import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { TokenStorageService } from '../../_services/loginService/token-storage.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    MatDivider,
    EmployeesComponent,
    TeamsComponent,
    TranslationModule,
    FooterComponent
  ]
})
export class HomeComponent implements OnInit {
  employeeCount: number | null = null;
  teamCount: number | null = null;
  notebookPath = 'assets/StageEte_V0.7_Alaa.html';
  images: any[] = [];  // Liste des images


  constructor(private tokenStorageService: TokenStorageService,private http: HttpClient,
    private translate: TranslateService,
    private employeeService: EmployeeService,
    private teamService: TeamService,
    private languageService: LanguageService,
    private router: Router
  ) {
    this.languageService.currentLanguage.subscribe(language => {
      this.translate.use(language);
    });
  }
  navigateToImageHome(): void {
    // Navigue vers la route '/image-home'
    this.router.navigate(['/ImageUploadComponent']);
  }

  ngOnInit(): void {
    this.getCountOfEmployees();
    this.getCountOfTeams();
    this.getImages();

  }

  switchLanguage(language: string) {
    this.languageService.changeLanguage(language);
  }

  getCountOfEmployees() {
    this.employeeService.countEmployees().subscribe(count => {
      this.employeeCount = count;
    });
  }

  getCountOfTeams() {
    this.teamService.countTeams().subscribe(count => {
      this.teamCount = count;
    });
  }

  getImages(): void {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });

    this.http.get<any[]>('http://localhost:8080/api/images/getall', { headers }).subscribe({
      next: (data: any[]) => {
        this.images = data;
      },
      error: (error) => {
        console.error('Error fetching images:', error);
      }
    });
  }

  deleteImage(id: number): void {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });

    this.http.delete(`http://localhost:8080/api/images/${id}`, { headers }).subscribe(() => {
      this.getImages();  // Recharger la liste des images après suppression
    });
  }

  getImageUrl(id: number): string {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
  
    // Note: this URL is used to fetch image data and typically needs to be used with HttpClient requests
    // You may not need headers here if you are using the URL directly for an <img> src attribute.
    return `http://localhost:8080/api/images/${id}`;
  }
  
}
