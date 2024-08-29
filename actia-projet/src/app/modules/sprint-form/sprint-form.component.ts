import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SprintService } from '../../_services/sprint/sprint.service';


@Component({
  selector: 'app-sprint-form',
  templateUrl: './sprint-form.component.html',
  styleUrls: ['./sprint-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class SprintFormComponent implements OnInit {
  sprintForm!: FormGroup;
  idsprint!: number;

  constructor(
    private fb: FormBuilder, 
    private sprintService: SprintService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idsprint = +params.get('idsprint')!;
      this.loadSprintData(this.idsprint);
    });

    this.sprintForm = this.fb.group({
      sprintName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      carryForwardSP: ['', Validators.required]
    }, { validator: this.dateValidator });
  }

  loadSprintData(id: number): void {
    this.sprintService.getSprintById(id).subscribe(sprint => {
      if (sprint) {
        this.sprintForm.patchValue({
          sprintName: sprint.name,
          startDate: new Date(sprint.date_Debut),
          endDate: new Date(sprint.date_Fin)        });
      }
    });
  }

  dateValidator(group: AbstractControl): ValidationErrors | null {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;
    return startDate && endDate && startDate > endDate ? { dateInvalid: true } : null;
  }

  onSubmit() {
    if (this.sprintForm.valid) {
      const formData = new FormData();
      formData.append('sprintName', this.sprintForm.get('sprintName')?.value);
      formData.append('startDate', this.sprintForm.get('startDate')?.value);
      formData.append('endDate', this.sprintForm.get('endDate')?.value);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput && fileInput.files) {
        formData.append('file', fileInput.files[0]);
      }

      this.sprintService.submitForm(this.idsprint, formData).subscribe({
        next: (response) => {
          console.log('Form submitted successfully', response);
          this.router.navigate(['/data-table']);
        },
        error: (err) => console.error('Error submitting form', err)
      });
    } else {
      console.error('Form is invalid');
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file);
    }
  }

  onCancel() {
    this.sprintForm.reset();
  }
}
