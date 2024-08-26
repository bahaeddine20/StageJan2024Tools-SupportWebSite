import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TokenStorageService } from '../../_services/loginService/token-storage.service';
import { RequestService } from '../../_services/Request/request.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { CalendarConfigModule } from './calendar-config/calendar-config.module';
import { Subject } from 'rxjs';
import { isSameDay, isSameMonth } from 'date-fns';
import { TranslationModule } from '../../translation/translation.module';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../_services/language/language.service';
import { futureOrPresentDateValidator, startDateBeforeEndDateValidator } from '../../validator/date.validators';

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    BsDatepickerModule,
    CalendarConfigModule,
    TranslationModule
  ],
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveRequestComponent implements OnInit {
  cancelForm!: FormGroup;
  requests: any[] = [];
  roles: string[] = [];
  user: any;
  isLoggedIn = false;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  refresh = new Subject<void>();
  activeDayIsOpen: boolean = true;
  CalendarView = CalendarView;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private tokenStorageService: TokenStorageService,
    private requestService: RequestService,
    private translate: TranslateService, 
    private languageService: LanguageService
  ) {
    this.cancelForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', [Validators.required, futureOrPresentDateValidator()]],
      endDate: ['', [Validators.required, futureOrPresentDateValidator()]],
      employeeEmail: ['', [Validators.required, Validators.email]],
      adminEmail: ['', [Validators.required, Validators.email]],
      reason: ['', Validators.required]
    }, { validators: startDateBeforeEndDateValidator() });
    this.languageService.currentLanguage.subscribe(language => {
      this.translate.use(language);
    });
  }

  switchLanguage(language: string) {
    this.languageService.changeLanguage(language);
  }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.user = this.tokenStorageService.getUser();
      this.roles = this.user.roles;

      console.log('Is Logged In:', this.isLoggedIn);
      console.log('Roles:', this.roles);

      if (this.roles.includes('ROLE_ADMIN')) {
        this.loadRequests();
        this.loadAcceptedRequests();
      }

      if (this.roles.includes('ROLE_USER') && !this.roles.includes('ROLE_ADMIN')) {
        this.initializeFormWithUserData();
      }
    }
  }

  initializeFormWithUserData() {
    this.cancelForm.patchValue({
      name: this.user?.username,
      employeeEmail: this.user?.email
    });
  }

  isDeleteDisabled(): boolean {
    return !this.requests || this.requests.length === 0 || !this.requests.some(r => r.selected);
  }

  submitForm() {
    if (this.cancelForm.invalid) {
      Object.values(this.cancelForm.controls).forEach(control => {
        control.markAsTouched();
      });
      alert('Please fill out all required fields.');
      return;
    }
  
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken(),
      'Content-Type': 'application/json'
    });
  
    const formData = {
      ...this.cancelForm.value,
      startDate: new Date(this.cancelForm.value.startDate).toISOString(),
      endDate: new Date(this.cancelForm.value.endDate).toISOString()
    };
  
    this.http.post<any>('http://localhost:8080/submitForm', formData, { headers })
      .subscribe(
        response => {
          console.log(response);
          alert(response.message);
          this.cancelForm.get('startDate')?.reset();
          this.cancelForm.get('endDate')?.reset();
          this.cancelForm.get('adminEmail')?.reset();
          this.cancelForm.get('reason')?.reset(); 
        },
        error => {
          console.error('Error submitting form:', error);
          if (error.status === 400 && error.error) {
            console.error('Validation errors:', error.error);
            alert(`Error: ${error.error.message || 'Validation error'}`);
          } else {
            alert('There was an error submitting the form. Please try again later.');
          }
        }
      );
  }
  
  
  CancelForm() {
    this.cancelForm.reset();
  }

  hasError(controlName: string, errorName: string) {
    const control = this.cancelForm.get(controlName);
    return control && control.touched && control.hasError(errorName);
  }

  loadRequests() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    this.http.get<any[]>('http://localhost:8080/getRequests', { headers }).subscribe({
      next: (data) => {
        console.log('Loaded requests:', data);
        this.requests = data;
      },
      error: (error) => {
        console.error('Failed to load requests', error);
      }
    });
  }

  acceptRequest(requestId: number): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenStorageService.getToken()}`
    });
    this.http.post(`http://localhost:8080/acceptRequest?id=${requestId}`, null, {
      headers: headers,
      responseType: 'text'
    }).subscribe({
      next: (response) => {
        console.log('Request accepted:', response);
        this.loadRequests();
        this.loadAcceptedRequests();
      },
      error: (error) => {
        console.error('Error accepting request', error);
      }
    });
  }

  rejectRequest(requestId: number): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenStorageService.getToken()}`
    });
    this.http.post(`http://localhost:8080/rejectRequest?id=${requestId}`, null, {
      headers: headers,
      responseType: 'text'
    }).subscribe({
      next: (response) => {
        console.log('Request rejected:', response);
        this.loadRequests();
      },
      error: (error) => {
        console.error('Error rejecting request', error);
      }
    });
  }

  hasRequests(): boolean {
    return this.requests && this.requests.length > 0;
  }

  deleteRequestById(id: number) {
    if (confirm('Are you sure you want to delete this request?')) {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      });
      this.http.delete(`http://localhost:8080/deleteRequestById/${id}`, { headers })
        .subscribe({
          next: () => {
            this.requests = this.requests.filter(request => request.id !== id);
            alert('Request deleted successfully');
          },
          error: (error) => {
            console.error('Error deleting request', error);
            alert('Failed to delete request');
          }
        });
    }
  }

  deleteSelectedRequests(): void {
    const selectedIds = this.requests.filter(req => req.selected).map(req => req.id);
    if (selectedIds.length === 0) {
      alert('No requests selected for deletion.');
      return;
    }
    if (confirm('Are you sure you want to delete the selected requests?')) {
      this.requestService.deleteSelectedRequests(selectedIds).subscribe({
        next: (response) => {
          console.log('Deleted successfully:', response);
          this.requests = this.requests.filter(req => !selectedIds.includes(req.id));
        },
        error: (error) => console.error('Failed to delete requests:', error)
      });
    }
  }

  selectAllRequests(event: any) {
    const allSelected = this.requests.every(req => req.selected);
    this.requests.forEach(req => req.selected = !allSelected);
  }

  loadAcceptedRequests() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    this.http.get<any[]>('http://localhost:8080/acceptedRequests', { headers }).subscribe({
      next: (data) => {
        this.events = data.map(request => ({
          title: request.name,
          start: new Date(request.startDate),
          end: new Date(request.endDate),
          color: {
            primary: this.getRandomColor(),
            secondary: this.getRandomColor()
          }
        }));
        this.refresh.next();
      },
      error: (error) => {
        console.error('Error loading accepted requests', error);
      }
    });
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    // Add your modal handling code here
  }

  exportRequestsToExcel() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    const url = 'http://localhost:8080/exportRequestsToExcel';
    
    this.http.get(url, { responseType: 'blob', headers })
      .subscribe(
        (response: Blob) => {
          this.downloadFile(response);
        },
        (error) => {
          console.error('Error downloading the file', error);
          alert('Failed to download the file. Please try again later.');
        }
      );
  }

private downloadFile(blob: Blob) {
    const downloadLink = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = 'requests.xlsx';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(url);
}

}
