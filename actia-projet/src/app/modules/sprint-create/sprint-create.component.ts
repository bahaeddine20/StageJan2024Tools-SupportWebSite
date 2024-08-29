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
  selector: 'app-sprint-create',
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
  templateUrl: './sprint-create.component.html',
  styleUrls: ['./sprint-create.component.scss']
})
export class SprintCreateComponent implements OnInit {
  createSprintForm: FormGroup;
  teamId: number | null = null; // Initialize as null
  sprints: Sprint[] = [];
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };
  dateRangeForm: FormGroup;

  constructor(
    private renderer: Renderer2,
    private fb: FormBuilder,
    private sprintService: SprintService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createSprintForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.dateRangeForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
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

  
  ngOnInit() {
    // Retrieve teamId from the route path
    this.route.paramMap.subscribe(params => {
      this.teamId = +params.get('teamId')!;
      if (this.teamId) {
        this.sprintService.getSprintsByTeamId(this.teamId).subscribe({
          next: (data) => {
            this.sprints = data.map((sprint) => ({
              ...sprint,
              color: this.generateRandomTransparentColor(),
              
            }));
            this.createSprintColorClasses();

            console.log(this.sprints); // Changed from console.error to console.log
          },
          error: (err) => {
            console.error('Error fetching sprints', err);
          },
        });
      } else {
        console.error('No teamId found in the route');
      }
    });
    this.createSprintColorClasses();

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
  

  ngAfterViewInit() {
    this.createSprintColorClasses();
  }

  applyDynamicStyles(): void {
 

    // Example: Applying styles to dynamically generated elements
 
this.sprints.forEach((sprint, index) => {
  const sprintElement = document.querySelector(`::ng-deep .sprint${index} .mat-calendar-body-cell-content`) as HTMLElement | null;
if (sprintElement && sprint.color) {
  sprintElement.style.backgroundColor = sprint.color;
  sprintElement.style.color = 'darkblue';
}

});
  }

  generateRandomTransparentColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = 0.4; // transparency level, you can adjust this
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  onSubmit() {
    if (this.createSprintForm.valid && this.teamId !== null) {
      const formValues = this.createSprintForm.value;
      const dateRange = this.dateRangeForm.value;
      const sprint: Sprint = {
        name: formValues.name,
        description: formValues.description,
        date_Debut: dateRange.startDate,
        date_Fin: dateRange.endDate,
        team: { id: this.teamId }
      };

      console.log('Submitting Sprint:', sprint);

      this.sprintService.createSprint(sprint, this.teamId).subscribe({
        next: (response) => {
          console.log('Sprint created successfully', response);
          this.router.navigate([`/sprints/${this.teamId}`]);
        },
        error: (error) => {
          console.error('Error creating sprint', error);
          // Optionally display a user-friendly message here
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/sprints']);
  }

  navigateToAddSprint(): void {
    if (this.teamId !== null) {
      this.router.navigate([`/sprints/${this.teamId}`]);
    } else {
      console.error('No teamId available for navigation');
    }
  }
}
