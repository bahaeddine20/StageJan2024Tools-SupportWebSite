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
import { ConfirmDialogComponent } from '../../../../components/confirm-dialog/confirm-dialog.component';
import { TranslationModule } from '../../../../translation/translation.module';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../_services/language/language.service';

@Component({
  selector: 'app-team-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatIcon,
    CommonModule,
    RouterModule,
    TranslationModule
  ],
  templateUrl: './team-dialog.component.html',
  styleUrl: './team-dialog.component.scss'
})
export class TeamDialogComponent implements OnInit {
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  defaultImageUrl: string = 'assets/images/team.webp';
  roles: string[] = [];
  isLoggedIn = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public team: any,
    public dialogRef: MatDialogRef<TeamDialogComponent>,
    private dialog: MatDialog,
    private teamService: TeamService,
    private coreService: CoreService,
    private sanitizer: DomSanitizer,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.languageService.currentLanguage.subscribe(language => {
      this.translate.use(language);
    });
  }
  switchLanguage(language: string) {
    this.languageService.changeLanguage(language);
  }
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
    }
    this.dataSource = new MatTableDataSource();
    this.getTeamList();
  }

  getTeamList() {
    this.teamService.getAllTeams().subscribe({
      next: (res) => {
        this.dataSource.data = res;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.error,
    });
  }

  getImageUrl(image: TeamImage): SafeUrl {
    return image && image.picByte ? this.sanitizer.bypassSecurityTrustUrl(`data:${image.type};base64,${image.picByte}`) : this.defaultImageUrl;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  deleteTeam(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete this team?'
    });
  
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.teamService.deleteTeam(id).subscribe({
          next: () => {
            this.coreService.openSnackBar('Team deleted!', 'done');
            window.location.reload(); // Ajout pour recharger la page
          },
          error: (error) => {
            console.error('Failed to delete the team', error);
            this.coreService.openSnackBar('Failed to delete the team!', 'error');
          }
        });
      }
    });
  } 
  openEditForm(data: any): void {
    const dialogRef = this.dialog.open(TeamAddEditComponent, { data: { Team: data, selectedFileName: data.image ? data.image : null } });
    dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.getTeamList();
      }
    });
  }
}