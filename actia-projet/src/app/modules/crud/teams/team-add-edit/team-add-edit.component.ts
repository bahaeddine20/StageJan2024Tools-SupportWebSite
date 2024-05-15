import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TeamService } from '../../../../_services/teams/team.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../../../../_services/core/core.service';
import { Team, TeamImage } from '../team';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-add-edit',
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
    CommonModule
  ],
  templateUrl: './team-add-edit.component.html',
  styleUrl: './team-add-edit.component.scss'
})
export class TeamAddEditComponent implements OnInit {
  TeamForm: FormGroup;
  editMode: boolean = false;
  imageUrl: SafeUrl | null = null;
  imageFiles: File[] = [];
  selectedFileName: string | null = null;

  constructor(
    private snackBar: MatSnackBar,
    private _fb: FormBuilder,
    private _TeamService: TeamService,
    private _dialogRef: MatDialogRef<TeamAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService,
    private _sanitizer: DomSanitizer
  ) {
    this.TeamForm = this._fb.group({
      id: 0,
      name: ['', Validators.required],
      description: ['',[ Validators.required,  Validators.maxLength(1000)]],
      technologie:['', Validators.required],
      image: [''],
    });

    if (data && data.Team) {
      this.editMode = true;
      this.TeamForm.patchValue(data.Team);
      const images = data.Team.teamImages;
      if (images && images.length > 0) {
        this.imageUrl = this.getImageUrl(images[0]);
      }
      this.TeamForm.patchValue({ id: data.Team.id });
    }
  }

  ngOnInit(): void {}

  getImageUrl(image: TeamImage): SafeUrl | null {
    if (image && image.picByte) {
      const imageUrl = 'data:' + image.type + ';base64,' + image.picByte;
      return this._sanitizer.bypassSecurityTrustUrl(imageUrl);
    }
    return null;
  }

  onFileSelected(event: any): void {
    this.imageFiles = event.target.files;
    const file = this.imageFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = this._sanitizer.bypassSecurityTrustUrl(reader.result as string);
        //this.TeamForm.patchValue({ image: file.name }); // Mettez à jour le nom de l'image dans le formulaire
      };
    }
  }

  showSuccessMessage() {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.horizontalPosition = 'center';
    config.verticalPosition = 'top';

    this.snackBar.open('Formation Ajoutée!', 'Close', config);
  }

  addTeam(teamData: Team, imageFiles: File[]): void {
    this._TeamService.addTeam(teamData, imageFiles).subscribe(
      (response) => {
        if (response) {
          this.showSuccessMessage();
          this._dialogRef.close();
          location.reload();
        }
      },
      (error) => console.error('Error adding team:', error)
    );
  }
 
  editTeam(TeamData: Team, imageFiles: File[]): void {
    this._TeamService.updateTeam(TeamData.id, TeamData, imageFiles)
      .subscribe(response => {
        if (response) {
          this.showSuccessMessage();
          this._dialogRef.close();
          location.reload();
        }
      }, error => {
        console.error('Error updating Team:', error);
      });
  }

  onFormSubmit(): void {
    if (this.TeamForm.valid) {
      const TeamData = this.TeamForm.value;
      if (this.editMode) {
        this.editTeam(TeamData, this.imageFiles);
      } else {
        this.addTeam(TeamData, this.imageFiles);
      }
    }
  }
}
