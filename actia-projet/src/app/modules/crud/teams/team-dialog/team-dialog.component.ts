import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { TeamImage } from '../team';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TokenStorageService } from '../../../../_services/loginService/token-storage.service';
import { Router, RouterModule } from '@angular/router';
import { TeamService } from '../../../../_services/teams/team.service';
import { CoreService } from '../../../../_services/core/core.service';
import { TeamAddEditComponent } from '../team-add-edit/team-add-edit.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-team-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatIcon,
    CommonModule,
    RouterModule
  ],
  templateUrl: './team-dialog.component.html',
  styleUrl: './team-dialog.component.scss'
})
export class TeamDialogComponent implements OnInit{
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  roles: string[] = [];
  isLoggedIn = false;
  
  constructor(
  @Inject(MAT_DIALOG_DATA) public team: any,
  private tokenStorageService: TokenStorageService,
  public dialogRef: MatDialogRef<TeamDialogComponent>,
  private _dialog: MatDialog,
  private _TeamService: TeamService,
  private _coreService: CoreService,
  private _sanitizer: DomSanitizer
  ) {}
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
  getImageUrl(image: TeamImage): SafeUrl {
    if (image && image.picByte) {
      const imageUrl = 'data:' + image.type + ';base64,' + image.picByte;
      return this._sanitizer.bypassSecurityTrustUrl(imageUrl);
    }
    return '';
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }
  deleteTeam(id: number) {
    this._TeamService.deleteTeam(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Team deleted!', 'done');
        // Mettre à jour la liste des équipes localement
        this.dataSource.data = this.dataSource.data.filter(team => team.id !== id);
        this.dialogRef.close(true); // Indiquer que la suppression a été effectuée
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

  
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.getTeamList();
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

    }
  }

}
