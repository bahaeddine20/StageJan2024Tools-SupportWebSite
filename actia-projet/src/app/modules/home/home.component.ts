import { Component, OnInit } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from '../crud/employees/employees.component';
import { EmployeeService } from '../../_services/employees/employee.service';
import { TeamService } from '../../_services/teams/team.service';
import { TeamsComponent } from '../crud/teams/teams.component';
import { FileDownloadService } from '../../_services/file/file-download.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { TranslationModule } from '../../translation/translation.module';
import { FooterComponent } from '../../components/footer/footer.component';
import { LanguageService } from '../../_services/language/language.service';

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

  constructor(
    private translate: TranslateService,
    private employeeService: EmployeeService,
    private teamService: TeamService,
    private languageService: LanguageService
  ) {
    this.languageService.currentLanguage.subscribe(language => {
      this.translate.use(language);
    });
  }

  ngOnInit(): void {
    this.getCountOfEmployees();
    this.getCountOfTeams();
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
}
