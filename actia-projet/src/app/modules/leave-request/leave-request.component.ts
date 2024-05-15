import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TokenStorageService } from '../../_services/loginService/token-storage.service';
import { RequestService } from '../../_services/Request/request.service';

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss'] // Corrected from 'styleUrl' to 'styleUrls'
})
export class LeaveRequestComponent implements OnInit {
  cancelForm!: FormGroup;
  requests: any[] = [];  
  roles: string[] = [];
  user: any;
  isLoggedIn = false;
  currentPage = 0;
  totalItems = 0;
  totalPages = 0;
  size = 10;

  constructor(private fb: FormBuilder, private http: HttpClient,private tokenStorageService: TokenStorageService, private requestService: RequestService) {
    this.cancelForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      employeeEmail: ['', [Validators.required, Validators.email]],
      adminEmail: ['', [Validators.required, Validators.email]],
      reason: ['', Validators.required]
    });
  }
  
  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.user = this.tokenStorageService.getUser();
      this.roles = this.user.roles;
      
      console.log('Is Logged In:', this.isLoggedIn); // Log the login status
      console.log('Roles:', this.roles); // Log the roles
  
      // Execute actions specific to the admin role
      if (this.roles.includes('ROLE_ADMIN')) {
        this.loadRequests(); // Load requests if the user is an admin
      }
  
      // Execute actions specific to the user role
      if (this.roles.includes('ROLE_USER') && !this.roles.includes('ROLE_ADMIN')) {
        this.initializeFormWithUserData(); // Initialize form with user data if only a user
      }
    }
    this.loadPage(0);
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
      name: this.user?.username,
      employeeEmail: this.user?.email
    });
  }

  isDeleteDisabled(): boolean {
    return !this.requests || this.requests.length === 0 || !this.requests.some(r => r.selected);
  }
  getUser() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Assuming JWT structure
      return decoded; // Or however you store user details in the token
    }
    return null;
  }

  submitForm() {
    if (this.cancelForm.invalid) {
        // Mark all form fields as touched to trigger validation messages
    Object.values(this.cancelForm.controls).forEach(control => {
      control.markAsTouched();
    });
    alert('Please fill out all required fields.');
    return; // This return statement exits the function if the form is invalid
  }
  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
  });
    // Send form data to backend
    const formData = this.cancelForm.value;
    this.http.post<any>('http://localhost:8080/submitForm', formData, { headers })
      .subscribe(
        response => {
          console.log(response); // Log success message
          alert(response.message); // Display success message from JSON response
          // Reset only specific fields after successful submission
          this.cancelForm.get('startDate')?.reset();
          this.cancelForm.get('endDate')?.reset();
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
    // Reset the form
    this.cancelForm.reset();
  }

  // Helper method to check if a form control has an error
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
      responseType: 'text'  // Specify that the expected response is plain text
    })
    .subscribe({
      next: (response) => {
        console.log('Request accepted:', response);
        this.loadRequests(); // Reload the requests to reflect changes
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
  
    // Adding responseType: 'text' if the backend returns plain text
    this.http.post(`http://localhost:8080/rejectRequest?id=${requestId}`, null, {
      headers: headers,
      responseType: 'text'
    }).subscribe({
      next: (response) => {
        console.log('Request rejected:', response);
        this.loadRequests();  // Reload the requests to reflect changes
      },
      error: (error) => {
        console.error('Error rejecting request:', error);
      }
    });
  }
// In your component class
hasRequests(): boolean {
  return this.requests && this.requests.length > 0;
}
deleteRequestById(id: number) {
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

deleteSelectedRequests(): void {
  const selectedIds = this.requests.filter(req => req.selected).map(req => req.id);
  if (selectedIds.length === 0) {
    alert('No requests selected for deletion.');
    return; // Exit the method if no requests are selected
  }
  this.requestService.deleteSelectedRequests(selectedIds).subscribe({
    next: (response) => {
      console.log('Deleted successfully:', response);
      // Filter out the deleted requests from the local array to update the UI
      this.requests = this.requests.filter(req => !selectedIds.includes(req.id));
    },
    error: (error) => console.error('Failed to delete requests:', error)
  });
}
selectAllRequests(event: any) {
  const allSelected = this.requests.every(req => req.selected);
  this.requests.forEach(req => req.selected = !allSelected);
}
}