import { Injectable } from '@angular/core';
import { TokenStorageService } from '../loginService/token-storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationRequestsService {
  private baseUrl = 'http://localhost:8080'; // Adjust as necessary for your environment

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) { }

  deleteSelectedRequests(ids: number[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });

    // Notice that the body is being sent as an option in the second parameter for HttpClient.delete
    return this.http.delete(`${this.baseUrl}/deleteMultipleAuthorizationRequests`, { headers, body: ids });
  }
  loadRequests(page: number, size: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });

    return this.http.get<any>(`${this.baseUrl}/getAuthorizationRequests?page=${page}&size=${size}`, { headers });
  }
}
