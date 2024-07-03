import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EmployeeService } from '../../../../_services/employees/employee.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../../../../_services/core/core.service';
import { Employee, EmployeeImage } from '../employee';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../_services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslationModule } from '../../../../translation/translation.module';
import { Observable, catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-emp-add-edit',
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
    TranslationModule
  ],
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss']
})
export class EmpAddEditComponent implements OnInit {
  @Output() updateSuccess = new EventEmitter<boolean>();
  @ViewChild('fileInput') fileInput?: ElementRef;
  empForm: FormGroup;
  editMode: boolean = false;
  imageUrl: SafeUrl | null = null;
  imageFiles: File[] = [];
  selectedFileName: string | null = null;
  teams: any[] = [];
  defaultMaleImage = 'assets/images/profile.webp';
  defaultFemaleImage = 'assets/images/profilewoman.webp'; 
  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private empService: EmployeeService,
    private dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private coreService: CoreService,
    private sanitizer: DomSanitizer,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {
    this.empForm = this.fb.group({
      id: 0,
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email], this.emailValidator.bind(this)],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, Validators.maxLength(8)]],
      linkedin: ['', Validators.required],
      role: ['', Validators.required],
      image: [''],
      team: [null, Validators.required]
    });

    if (data && data.employee) {
      this.editMode = true;
      const image = data.employee.employeeImages && data.employee.employeeImages.length 
        ? data.employee.employeeImages[0] 
        : null;

      this.empForm.patchValue({
        id: data.employee.id,
        firstname: data.employee.firstname,
        lastname: data.employee.lastname,
        email: data.employee.email,
        gender: data.employee.gender,
        phone: data.employee.phone,
        linkedin: data.employee.linkedin,
        role: data.employee.role,
        team: data.employee.team ? data.employee.team.id : null
      });

      if (image) {
        this.imageUrl = this.getImageUrl(image);
      }
    }

    this.empForm.get('gender')?.valueChanges.subscribe(gender => {
      this.setDefaultImage(gender);
    });

    this.setDefaultImage(this.empForm.get('gender')?.value);
    this.languageService.currentLanguage.subscribe(language => {
      this.translate.use(language);
    });
  }
  switchLanguage(language: string) {
    this.languageService.changeLanguage(language);
  }
  private setDefaultImage(gender: string): void {
    if (gender === 'male') {
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.defaultMaleImage);
    } else if (gender === 'female') {
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.defaultFemaleImage);
    } else {
      this.imageUrl = null;
    }
  }

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.empService.getTeams().subscribe(
      (teams) => this.teams = teams,
      (error) => console.error('Error loading teams:', error)
    );
  }

  getImageUrl(image: EmployeeImage): SafeUrl {
    const imageUrl = 'data:' + image.type + ';base64,' + image.picByte;
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.empForm.get('image')?.setValue(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  showSuccessMessage() {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.horizontalPosition = 'center';
    config.verticalPosition = 'top';
    this.snackBar.open('Employee saved successfully!', 'Close', config);
  }

  addEmployee(employeeData: Employee, imageFiles: File[]): void {
    this.empService.addEmployee(employeeData, imageFiles).subscribe(
      (response) => {
        if (response) {
          this.showSuccessMessage();
          this.dialogRef.close();
          location.reload();
        }
      },
      (error) => console.error('Error adding employee:', error)
    );
  }

  editEmployee(employeeData: Employee, imageFiles: File[]): void {
    this.empService.updateEmployee(employeeData.id, employeeData, imageFiles).subscribe(
      (response) => {
        if (response) {
          const newTeamId = typeof employeeData.team === 'object' ? employeeData.team.id : employeeData.team;
          this.updateEmployeeTeam(employeeData.id, newTeamId);
          this.showSuccessMessage();
          this.dialogRef.close();
          location.reload();
        }
      },
      (error) => console.error('Error updating employee:', error)
    );
  }

  updateEmployeeTeam(employeeId: number, newTeamId: number): void {
    this.empService.updateEmployeeTeam(employeeId, newTeamId).subscribe(
      () => {
        console.log('Employee team updated successfully');
      },
      (error) => console.error('Error updating employee team:', error)
    );
  }
  emailValidator(control: AbstractControl): Observable<{ [key: string]: any } | null> {
    const originalEmail = this.data && this.data.employee ? this.data.employee.email : '';
    const newEmail = control.value;
  
    // Check if the email has been modified
    if (originalEmail !== newEmail) {
      return this.empService.checkEmailExists(control.value).pipe(
        map(exists => (exists ? { emailExists: true } : null)),
        catchError(() => of(null))
      );
    } else {
      // If email has not been modified, return null (no error)
      return of(null);
    }
  }
  
  onFormSubmit(): void {
    if (this.empForm.valid) {
      const employeeData = this.empForm.value;
      let imageFiles: File[] = [];

      if (this.empForm.get('image')?.value instanceof File) {
        imageFiles = [this.empForm.get('image')?.value];
      }

      if (this.editMode) {
        this.editEmployee(employeeData, imageFiles);
      } else {
        this.addEmployee(employeeData, imageFiles);
      }
    }
  }
}
