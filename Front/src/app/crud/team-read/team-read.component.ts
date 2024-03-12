import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TeamServiceService } from '../services/team-service.service';
import { TeamAddEditComponent } from '../team-add-edit/team-add-edit.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { Team, TeamImage } from '../team';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
  selector: 'app-team-read',
  templateUrl: './team-read.component.html',
  styleUrl: './team-read.component.scss'
})
export class TeamReadComponent implements OnInit {
  selectedFileUrl: any = null;
  displayedColumns: string[] = [
    'id',
    'name',
    'description',
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
    private _TeamService: TeamServiceService,
    private _coreService: CoreService,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
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
        console.log('Received teams from server:', res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.log('DataSource updated:', this.dataSource);
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
        location.reload();
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

}
