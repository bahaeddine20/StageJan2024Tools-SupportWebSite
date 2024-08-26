import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenStorageService } from '../loginService/token-storage.service';
import { Observable } from 'rxjs/internal/Observable';
import { Employee } from '../../modules/crud/employees/employee';
import { catchError, of, throwError } from 'rxjs';
import { SaveDatesRequest } from '../../modules/conge-table/SaveDatesRequest';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = 'http://localhost:8080/api/leaves';
  constructor(private http: HttpClient,
    private tokenStorageService: TokenStorageService) {}

  getEmployeeById(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get(`http://localhost:8080/emp/getEmployeeByID/${id}`, { headers });
  }

  getAllEmployees(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get(`http://localhost:8080/emp/getAllEmployees`,{ headers });
  }

  addEmployee(employeeData: any, imageFiles: File[]): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    const formData: FormData = new FormData();
    
    // Append employee data as a JSON string
    formData.append('employee', new Blob([JSON.stringify(employeeData)], { type: 'application/json' }))
    
    // Append each image file
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append(`imagePath`, imageFiles[i]);
    }
  
    // Make the HTTP request
    return this.http.post<Employee>('http://localhost:8080/emp/addEmployee', formData, { headers });
  }
  
  updateEmployee(id: number, employeeData: Employee, imageFiles: File[]): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    const formData: FormData = new FormData();

    // Append employee data as a JSON string
    formData.append('employee', new Blob([JSON.stringify(employeeData)], { type: 'application/json' }));

    // Append each image file with a unique name
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append(`imagePath`, imageFiles[i], imageFiles[i].name); // name will be used as filename
    }

    // Make the HTTP request
    return this.http.put<Employee>(`http://localhost:8080/emp/updateEmployee/${id}`, formData, { headers });
  }
  updateEmployeeTeam(employeeId: number, newTeamId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.put(`http://localhost:8080/emp/updateEmployeeTeam/${employeeId}/${newTeamId}`, {}, { headers });
  }
  
  
  deleteEmployee(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.delete(`http://localhost:8080/emp/deleteEmployeeById/${id}`, { headers });
  }

  searchByGender(gender: string): Observable<any> {
    return this.http.get(`http://localhost:8080/emp/searchByGender/${gender}`);
  }

  getByTeam(idteam: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get(`http://localhost:8080/emp/EmployeeByIdTeam/${idteam}`,{ headers });
  }
  getTeams(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    // Update the URL to point to your backend's team endpoint
    return this.http.get('http://localhost:8080/team/getAllTeams',{ headers });
  }
  countEmployees(): Observable<number> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get<number>(`http://localhost:8080/emp/count`,{ headers });
  }

  checkEmailExists(email: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get<boolean>(`http://localhost:8080/emp/checkEmailExists?email=${email}`,{ headers });
  }

  requestLeave(leaveRequest: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.post<any>(`${this.baseUrl}/request`, leaveRequest,{ headers });
  }

  confirmLeave(requestId: number) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.post<any>(`${this.baseUrl}/confirm/${requestId}`,{}, { headers });
  }
  submitLeaveRequest(employeeId: number, dates: Date[]): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken(),
      'Content-Type': 'application/json'
    });

    const leaveRequest = {
      employeeId,
      selectedDates: dates
    };

    return this.http.post<any>(`${this.baseUrl}/leave-request`, leaveRequest, { headers })
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la soumission de la demande de congés:', error);
          return throwError(error);
        })
      );
  }
  // Méthode pour obtenir toutes les demandes de congés
  getAllLeaveRequests(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken(),
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(`${this.baseUrl}/all`, { headers });
  }

  getSelectedDatesForEmployee(employeeId: number): Observable<string[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken(),
      'Content-Type': 'application/json'
    });
    return this.http.get<string[]>(`${this.baseUrl}/selected-dates/${employeeId}`, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Handle error response here
          console.error('Error fetching selected dates for employee:', error);
          return throwError(error);
        })
      );
  }
  saveSelectedDates(request: SaveDatesRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken(),
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.baseUrl}/save-selected-dates`, request, { headers });
  }
  getSelectedDates(employeeId: number): Observable<string[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken(),
      'Content-Type': 'application/json'
    });
    return this.http.get<string[]>(`${this.baseUrl}/selected-dates/${employeeId}`, { headers });
  }
  
}