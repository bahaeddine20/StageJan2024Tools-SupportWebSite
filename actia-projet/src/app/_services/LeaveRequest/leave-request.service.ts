import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../loginService/token-storage.service';
import { Console } from 'node:console';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {
  private apiUrl = 'http://localhost:8080/api/leaves'; // URL de votre API Spring Boot

  constructor(private http: HttpClient,
              private tokenStorageService: TokenStorageService) { }

  requestLeave(leaveRequest: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken(),
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.apiUrl}/request`, leaveRequest, { headers });
  }

  confirmLeaveRequest(requestId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken(),
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.apiUrl}/confirm/${requestId}`, {},{ headers });
  }

  getLeaveRequestsByEmployeeId(employeeId: number): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken(),
      'Content-Type': 'application/json'
    });
    return this.http.get<any[]>(`${this.apiUrl}/${employeeId}`,{ headers });
  }

  getAllLeaveRequests(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken(),
      'Content-Type': 'application/json'
    });
    console.log(this.http.get<any[]>(`${this.apiUrl}/all`,{ headers }))
    return this.http.get<any[]>(`${this.apiUrl}/all`,{ headers });
 
    
  }

  saveSelectedDatesForEmployee(employeeId: number, dates: string[]): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken(),
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.apiUrl}/save-selected-dates`, { employeeId, dates },{ headers });
  }

  getSelectedDatesForEmployee(employeeId: number): Observable<string[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken(),
      'Content-Type': 'application/json'
    });
    return this.http.get<string[]>(`${this.apiUrl}/selected-dates/${employeeId}`,{ headers });
  }
}
