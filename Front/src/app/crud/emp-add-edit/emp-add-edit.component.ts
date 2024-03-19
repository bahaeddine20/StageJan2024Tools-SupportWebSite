import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { CoreService } from '../core/core.service';
import { Employee, EmployeeImage } from '../employee';
import { EmpcrudService } from '../services/empcrud.service';

@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss']
})
export class EmpAddEditComponent implements OnInit {
  empForm: FormGroup;
  editMode: boolean = false;
  imageUrl: SafeUrl | null = null;
  imageFiles: File[] = [];
  selectedFileName: string | null = null;
  teams: any[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private empService: EmpcrudService,
    private dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private coreService: CoreService,
    private sanitizer: DomSanitizer
  ) {
    this.empForm = this.fb.group({
      id: 0,
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      image: [''],
      team: ['', Validators.required]
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
        team: data.employee.team ? data.employee.team.id : ''
      });

      if (image) {
        this.imageUrl = this.getImageUrl(image);
      }
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
          this.showSuccessMessage();
          this.dialogRef.close();
          location.reload();
        }
      },
      (error) => console.error('Error updating employee:', error)
    );
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
