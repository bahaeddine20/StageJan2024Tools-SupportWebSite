import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TeamServiceService } from '../services/team-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { Team, TeamImage } from '../team';

@Component({
  selector: 'app-team-add-edit',
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
    private _TeamService: TeamServiceService,
    private _dialogRef: MatDialogRef<TeamAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService,
    private _sanitizer: DomSanitizer
  ) {
    this.TeamForm = this._fb.group({
      id: 0,
      name: ['', Validators.required],
      description: ['',[ Validators.required,  Validators.maxLength(500)]],
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
