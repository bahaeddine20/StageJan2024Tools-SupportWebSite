import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LeaveNotification } from './leave-notification/leave-notification';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from '../../_services/loginService/token-storage.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notifications!: LeaveNotification[];
  isLoggedIn: boolean = false;
  user: any;
  roles: string[] = [];

  constructor(private tokenStorageService: TokenStorageService, private http: HttpClient) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.user = this.tokenStorageService.getUser();
      this.roles = this.user.roles;

      console.log('Is Logged In:', this.isLoggedIn);
      console.log('Roles:', this.roles);

      if (this.roles.includes('ROLE_ADMIN')) {
        this.loadRequests();
      }
    }
  }

  loadRequests() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });

    this.http.get<any[]>('http://localhost:8080/getRequests', { headers }).subscribe({
      next: (data) => {
        console.log('Loaded requests:', data);
        this.notifications = data;
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
        this.sendNotification(requestId, 'accept');
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
    this.http.post(`http://localhost:8080/rejectRequest?id=${requestId}`, null, {
      headers: headers,
      responseType: 'text'
    }).subscribe({
      next: (response) => {
        console.log('Request rejected:', response);
        this.sendNotification(requestId, 'reject');
        this.loadRequests();
      },
      error: (error) => {
        console.error('Error rejecting request', error);
      }
    });
  }

  sendNotification(requestId: number, status: string): void {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken(),
      'Content-Type': 'application/json'
    });

    const notificationData = {
      requestId: requestId,
      status: status,
      userId: this.user.id // Assurez-vous que l'ID utilisateur est inclus dans la notification
    };

    this.http.post('http://localhost:8080/sendNotification', notificationData, { headers }).subscribe({
      next: (response) => {
        console.log('Notification sent:', response);
      },
      error: (error) => {
        console.error('Error sending notification', error);
      }
    });
  }
}
