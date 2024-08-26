import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TokenStorageService } from '../../_services/loginService/token-storage.service';
import { AuthorizationRequestsService } from '../../_services/AuthorizationRequests/authorization-requests.service';
import { futureOrPresentDateValidator, timeRangeValidator } from '../../validator/date.validators';
import { TranslationModule } from '../../translation/translation.module';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../_services/language/language.service';

@Component({
  selector: 'app-authorization-requests',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    TranslationModule
  ],
  templateUrl: './authorization-requests.component.html',
  styleUrls: ['./authorization-requests.component.scss']
})
export class AuthorizationRequestsComponent implements OnInit {
  cancelForm!: FormGroup;
  requests: any[] = [];
  roles: string[] = [];
  user: any;
  isLoggedIn = false;
  currentPage = 0;
  totalItems = 0;
  totalPages = 0;
  size = 10;
  acceptedRequests: Set<number> = new Set();
  rejectedRequests: Set<number> = new Set();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private tokenStorageService: TokenStorageService, 
    private requestService: AuthorizationRequestsService,
    private translate: TranslateService, 
    private languageService: LanguageService
  ) {
    this.cancelForm = this.fb.group({
      requesterName: ['', Validators.required],
      requesterEmail: ['', [Validators.required, Validators.email]],
      reason: ['', Validators.required],
      leavingTime: ['', [Validators.required, timeRangeValidator(), futureOrPresentDateValidator()]],
      adminEmail: ['', [Validators.required, Validators.email]]
    });
    this.languageService.currentLanguage.subscribe(language => {
      this.translate.use(language);
    });
  }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.user = this.tokenStorageService.getUser();
      this.roles = this.user.roles;

      if (this.roles.includes('ROLE_ADMIN')) {
        this.loadRequests(); 
      }

      if (this.roles.includes('ROLE_USER') && !this.roles.includes('ROLE_ADMIN')) {
        this.initializeFormWithUserData(); 
      }
    }
    this.loadSavedState();
  }

  loadSavedState() {
    const savedAcceptedRequests = localStorage.getItem('acceptedRequests');
    const savedRejectedRequests = localStorage.getItem('rejectedRequests');

    if (savedAcceptedRequests) {
      this.acceptedRequests = new Set(JSON.parse(savedAcceptedRequests));
    }

    if (savedRejectedRequests) {
      this.rejectedRequests = new Set(JSON.parse(savedRejectedRequests));
    }
  }

  loadPage(page: number) {
    this.requestService.loadRequests(page, this.size).subscribe({
      next: data => {
        this.requests = data.requests;
        this.currentPage = data.currentPage;
        this.totalItems = data.totalItems;
        this.totalPages = data.totalPages;
      },
      error: error => {
        console.error('Error loading the requests', error);
      }
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.loadPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.loadPage(this.currentPage - 1);
    }
  }

  initializeFormWithUserData() {
    this.cancelForm.patchValue({
      requesterName: this.user?.username,
      requesterEmail: this.user?.email
    });
  }

  isDeleteDisabled(): boolean {
    return !this.requests || this.requests.length === 0 || !this.requests.some(r => r.selected);
  }

  getUser() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1])); 
      return decoded; 
    }
    return null;
  }

  submitAuthorizationRequest() {
    if (this.cancelForm.invalid) {
      Object.values(this.cancelForm.controls).forEach(control => {
        control.markAsTouched();
      });
      alert('Please fill out all required fields.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });

    const formData = this.cancelForm.value;
    this.http.post<any>('http://localhost:8080/submitAuthorizationRequest', formData, { headers })
      .subscribe(
        response => {
          console.log(response);
          alert(response.message); 
          this.cancelForm.get('leavingTime')?.reset();
          this.cancelForm.get('adminEmail')?.reset();
          this.cancelForm.get('reason')?.reset(); 
        },
        error => {
          console.error('Error submitting form:', error);
          alert('There was an error submitting the form. Please try again later.');
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
    this.http.get<any[]>('http://localhost:8080/getAuthorizationRequests', { headers }).subscribe({
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
    this.http.post(`http://localhost:8080/acceptAuthorizationRequest?id=${requestId}`, null, {
      headers: headers,
      responseType: 'text'
    })
    .subscribe({
      next: (response) => {
        console.log('Request accepted:', response);
        this.loadRequests(); 
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
    this.http.post(`http://localhost:8080/rejectAuthorizationRequest?id=${requestId}`, null, {
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
      this.http.delete(`http://localhost:8080/deleteAuthorizationRequestByID/${id}`, { headers })
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
}