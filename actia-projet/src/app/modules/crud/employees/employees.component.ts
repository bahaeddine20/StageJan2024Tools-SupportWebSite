import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Employee, EmployeeImage } from './employee';
import { TokenStorageService } from '../../../_services/loginService/token-storage.service';
import { EmployeeService } from '../../../_services/employees/employee.service';
import { CoreService } from '../../../_services/core/core.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { TeamService } from '../../../_services/teams/team.service';
import { ImageawsComponent } from '../../imageaws/imageaws.component';
import { TranslationModule } from '../../../translation/translation.module';
import { LanguageService } from '../../../_services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    HttpClientModule,
    MatCardModule,
    RouterModule,
    CommonModule,
    ConfirmDialogComponent,
    ImageawsComponent,
    TranslationModule
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit {
  selectedFileUrl: any = null;
  displayedColumns: string[] = [
    'id',
    'firstname',
    'lastname',
    'email',
    'gender',
    'phone',
    'team',
    'linkedin',
    'role',
    'employeeImages',
    'action',
  ];
  currentTeamId: number | null = null;
  faLinkedin = faLinkedin;
  roles: string[] = [];
  isLoggedIn = false;
  team: any;
  members?: any[];
  defaultMaleImage = 'assets/images/profile.webp';
  defaultFemaleImage = 'assets/images/profilewoman.webp';
  dataSource!: MatTableDataSource<Employee>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private tokenStorageService: TokenStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private _dialog: MatDialog,
    private _empService: EmployeeService,
    private _coreService: CoreService,
    private _sanitizer: DomSanitizer,
    private teamService: TeamService,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {
    this.languageService.currentLanguage.subscribe(language => {
      this.translate.use(language);
    });
  }
  switchLanguage(language: string) {
    this.languageService.changeLanguage(language);
  }
  
  isMatrixTeam(): boolean {
    return this.team?.name.toLowerCase() === 'matrix';
  }
  
  isTeamLead(member: any): boolean {
    return member.role === 'TEAM_LEAD';
  }

  isTechnicalLead(member: any): boolean {
    return member.role === 'TECHNICAL_LEAD';
  }

  isDevelopperLead(member: any): boolean {
    return member.role === 'DEVELOPER';
  }
  
  loadMembers() {
    this.teamService.getAllTeams().subscribe((data: any[]) => {
      this.members = data; // Stocker les membres de l'équipe dans la variable 'members'
    });
  }
  toggleBio(member: any, event: Event) {
    event.preventDefault();
    member.showFullBio = !member.showFullBio;
  }
  ngOnInit(): void {
    this.loadMembers();
    this.dataSource = new MatTableDataSource();
    this.route.paramMap.subscribe((param) => {
      const teamId = Number(param.get('teamId'));
      console.log("teamId:", teamId);
      this.getEmployeesByTeam(teamId);
      this.getTeamData(teamId); // Ajoutez cette ligne
    });
    this.isLoggedIn = !!this.tokenStorageService.getToken();
  
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
    }
  }
  
  getTeamData(teamId: number) {
    this.teamService.getTeamById(teamId).subscribe(data => {
      this.team = data; // Assurez-vous que la propriété 'team' est définie dans votre composant
    });
  }

  getEmployeesByTeam(teamId: number) {
    this.currentTeamId = teamId;
    this._empService.getByTeam(teamId.toString()).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(EmpAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();
        }
      },
    });
  }

  getEmployeeList() {
    this._empService.getAllEmployees().subscribe({
      next: (res: Employee[]) => { // Ajoutez le type Employee[] ici
        // Convertir les données binaires de l'image en URL pour chaque employé
        res.forEach((employee: Employee) => { // Ajoutez le type Employee ici
          if (employee.employeeImages && employee.employeeImages.length > 0) {
            employee.imageUrl = this.getImageUrl(employee.employeeImages[0]);
          }
        });
  
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.error,
    });
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(id: number) {
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete this employee?',
    });
  
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._empService.deleteEmployee(id).subscribe({
          next: (res) => {
            this._coreService.openSnackBar('Employee deleted!', 'done');
            if (this.currentTeamId !== null) {
              this.getEmployeesByTeam(this.currentTeamId);
            }
          },
          error: console.error,
        });
      }
    });
  }
  

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(EmpAddEditComponent, {
      data: { employee: data, selectedFileName: data.image ? data.image : null },
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();
        }
      },
    });
  }
  getImageUrl(image: EmployeeImage): SafeUrl | null {
    if (image && image.picByte) {
      const imageUrl = 'data:' + image.type + ';base64,' + image.picByte;
      return this._sanitizer.bypassSecurityTrustUrl(imageUrl);
    }
    return null;
  }
  getDefaultImage(gender: string): string {
    return gender === 'male' ? this.defaultMaleImage : this.defaultFemaleImage;
  }
}
