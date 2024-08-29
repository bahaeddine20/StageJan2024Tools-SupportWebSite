import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Sprint } from '../../_services/sprint/sprint.model';
import { SprintService } from '../../_services/sprint/sprint.service';

@Component({
  selector: 'app-edit-sprint',
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
  ],
  templateUrl: './edit-sprint.component.html',
  styleUrls: ['./edit-sprint.component.scss']
})
export class EditSprintComponent implements OnInit {
  editSprintForm: FormGroup;
  dateRangeForm: FormGroup;
  teamId: number | null = null;
  sprintId: number | null = null;
  sprint: Sprint | null = null;
  sprints: Sprint[] = [];

  constructor(
    private renderer: Renderer2,
    private fb: FormBuilder,
    private sprintService: SprintService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.editSprintForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.dateRangeForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    // Retrieve teamId and sprintId from route parameters
    this.route.paramMap.subscribe(params => {
      this.teamId = +params.get('teamId')!;
      this.sprintId = +params.get('sprintId')!;
      if (this.teamId && this.sprintId) {
        this.loadSprintData(this.sprintId);
      } else {
        console.error('Invalid route parameters for teamId or sprintId');
      }
    });

    // Load sprints for dynamic styling
    if (this.teamId) {
      this.sprintService.getSprintsByTeamId(this.teamId).subscribe({
        next: (data) => {
          this.sprints = data.map((sprint) => ({
            ...sprint,
            color: this.generateRandomTransparentColor(),
          }));
          this.createSprintColorClasses();
        },
        error: (err) => {
          console.error('Error fetching sprints', err);
        },
      });
    } else {
      console.error('No teamId found in the route');
    }
  }

  createSprintColorClasses() {
    this.sprints.forEach((sprint, i) => {
      const color = sprint.color || '#ffffff'; // Default color if `sprint.color` is undefined
      const className = `sprint${i}`; // Use template literal to incorporate the index
      const style = `.${className} .mat-calendar-body-cell-content {
          background-color: ${color};
          color: darkblue;
        }
      `;
      const styleElement = this.renderer.createElement('style');
      styleElement.textContent = style;
      this.renderer.appendChild(document.head, styleElement);
    });
  }
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const date = cellDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      for (let i = 0; i < this.sprints.length; i++) {
        const sprint = this.sprints[i];
        const startDate = sprint.date_Debut;
        const endDate = sprint.date_Fin;
        if (date >= startDate && date <= endDate) {
          return `sprint${i}`; // Use a template literal to include the index
        }
      }
    }
    return '';
  };
  loadSprintData(sprintId: number): void {
    this.sprintService.getSprintById(sprintId).subscribe({
      next: (sprint: Sprint) => {
        this.sprint = sprint;
  
        // Patch form values with the loaded sprint data
        this.editSprintForm.patchValue({
          name: sprint.name,
          description: sprint.description,
        });
  
        // Patch date range form values, make sure dates are in a format Angular understands
        this.dateRangeForm.patchValue({
          startDate: new Date(sprint.date_Debut), // Convert if needed
          endDate: new Date(sprint.date_Fin), // Convert if needed
        });
      },
      error: (error) => {
        console.error('Error fetching sprint data', error);
        // Consider adding user-friendly error handling here
      }
    });
  }
  

 
  onCancel(): void {
    if (this.teamId !== null) {
      this.router.navigate([`/sprints/${this.teamId}`]);
    }
  }

  generateRandomTransparentColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = 0.4; // transparency level, you can adjust this
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }


  onSubmit() {
    if (this.editSprintForm.valid && this.sprintId !== null  && this.teamId !== null) {
      const formValues = this.editSprintForm.value;
      const dateRange = this.dateRangeForm.value;
      const sprint: Sprint = {
        id:this.sprintId,
        name: formValues.name,
        description: formValues.description,
        date_Debut: dateRange.startDate,
        date_Fin: dateRange.endDate,
        team: { id: this.teamId }
      };

      console.log('Submitting Sprint:', sprint);

      this.sprintService.updateSprint(sprint, this.sprintId).subscribe({
        next: (response) => {
          console.log('Sprint edited successfully', response);
          this.router.navigate([`/sprints/${this.teamId}`]);
        },
        error: (error) => {
          console.error('Error edited sprint', error);
          // Optionally display a user-friendly message here
        }
      });
    }
  }


}
