import { Component, NgZone, OnInit, inject } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from '../crud/employees/employees.component';
import { EmployeeService } from '../../_services/employees/employee.service';
import { TeamService } from '../../_services/teams/team.service';
import { TeamsComponent } from '../crud/teams/teams.component';
import { FileDownloadService } from '../../_services/file/file-download.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [
        CommonModule,
        MatDivider,
        EmployeesComponent,
        TeamsComponent,
    ]
})
export class HomeComponent implements OnInit {
  employeeCount: number | null = null;
  teamCount: number | null = null;
  notebookPath = 'assets/StageEte_V0.7_Alaa.html';

  constructor(
    private http: HttpClient,
    private employeeService: EmployeeService,
    private teamService: TeamService,
    private fileDownloadService: FileDownloadService
    ) {}

  ngOnInit(): void {
    this.getCountOfEmployees();
    this.getCountOfTeams();
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
  downloadFile(fileType: 'pdf' | 'csv') {
    const fileUrl = fileType === 'pdf' ? 'url-to-pdf' : 'url-to-csv';
    const filename = fileType === 'pdf' ? 'document.pdf' : 'document.csv';

    this.fileDownloadService.downloadFile(fileUrl, filename);
  }
}