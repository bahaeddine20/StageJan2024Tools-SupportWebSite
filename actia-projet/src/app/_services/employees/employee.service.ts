import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenStorageService } from '../loginService/token-storage.service';
import { Observable } from 'rxjs/internal/Observable';
import { Employee } from '../../modules/crud/employees/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
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
}