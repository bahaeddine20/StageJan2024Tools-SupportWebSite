import { Component, OnInit, ViewChild } from '@angular/core';
import { Team, TeamImage } from './team';
import { TokenStorageService } from '../../../_services/loginService/token-storage.service';
import { Router, RouterModule } from '@angular/router';
import { TeamService } from '../../../_services/teams/team.service';
import { CoreService } from '../../../_services/core/core.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TeamAddEditComponent } from './team-add-edit/team-add-edit.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { TeamDialogComponent } from './team-dialog/team-dialog.component';

@Component({
  selector: 'app-teams',
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
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    HttpClientModule,
    MatCardModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit {
  selectedFileUrl: any = null;
  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'technologie',
    'teamImages',
    'action'
  ];
  
  Team?: Team[];
  dataSource!: MatTableDataSource<any>;
  selectedFileName: string | null = null;


  roles: string[] = [];
  isLoggedIn = false;

  imageFiles: File[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private _dialog: MatDialog,
    private _TeamService: TeamService,
    private _coreService: CoreService,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.getTeamList();
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

    }
  }

  openAddEditTeamForm() {
    const dialogRef = this._dialog.open(TeamAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getTeamList();
        }
      },
    });
  }
  navigateToEmployees(teamId: number) {
    this.router.navigate(['/employees', teamId]);
  }
  
  getTeamList() {
    this._TeamService.getAllTeams().subscribe({
      next: (res) => {
        if (this.dataSource) {
          this.dataSource.data = res;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }
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

  deleteTeam(id: number) {
    this._TeamService.deleteTeam(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Team deleted!', 'done');
        console.log('Calling getTeamList() after deletion...');
        this.getTeamList();
      },
      error: console.error,
    });
  }
  

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(TeamAddEditComponent, {
      data: { Team: data, selectedFileName: data.image ? data.image : null },
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getTeamList();
        }
      },
    });
  }

  getImageUrl(image: TeamImage): SafeUrl {
    if (image && image.picByte) {
      const imageUrl = 'data:' + image.type + ';base64,' + image.picByte;
      return this._sanitizer.bypassSecurityTrustUrl(imageUrl);
    }
    return '';
  }

 openTeamDetails(team: any) {
  const dialogRef = this._dialog.open(TeamDialogComponent, {
    data: team
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.getTeamList(); // Mettre à jour la liste des équipes si une équipe a été supprimée
    }
  });
}


}
