import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Employee } from '../employee';

@Injectable({
  providedIn: 'root'
})
export class EmpcrudService {

  constructor(private http: HttpClient) {}

  getEmployeeById(id: number): Observable<any> {
    return this.http.get(`http://localhost:8089/emp/getEmployeeByID/${id}`);
  }

  getAllEmployees(): Observable<any> {
    return this.http.get(`http://localhost:8089/emp/getAllEmployees`);
  }

  addEmployee(employeeData: any, imageFiles: File[]): Observable<any> {
    const formData: FormData = new FormData();

    // Append employee data as a JSON string
    formData.append('employee', new Blob([JSON.stringify(employeeData)], { type: 'application/json' }))

    // Append each image file
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append(`imagePath`, imageFiles[i]);
    }

    // Make the HTTP request
    return this.http.post<Employee>('http://localhost:8089/emp/addEmployee', formData);
  }

  updateEmployee(id: number, employeeData: Employee, imageFiles: File[]): Observable<any> {
    const formData: FormData = new FormData();

    // Append employee data as a JSON string
    formData.append('employee', new Blob([JSON.stringify(employeeData)], { type: 'application/json' }));

    // Append each image file with a unique name
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append(`imagePath`, imageFiles[i], imageFiles[i].name); // name will be used as filename
    }

    // Make the HTTP request
    return this.http.put<Employee>(`http://localhost:8089/emp/updateEmployee/${id}`, formData);
  }



  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`http://localhost:8089/emp/deleteEmployeeById/${id}`);
  }

  searchByGender(gender: string): Observable<any> {
    return this.http.get(`http://localhost:8089/emp/searchByGender/${gender}`);
  }

  getByTeam(idteam: string): Observable<any> {
    return this.http.get(`http://localhost:8089/emp/EmployeeByIdTeam/${idteam}`);
  }

  searchByBirthDateRange(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`http://localhost:8089/emp/searchByBirthDateRange/${startDate}/${endDate}`);
  }

  getTeams(): Observable<any> {
    // Update the URL to point to your backend's team endpoint
    return this.http.get('http://localhost:8089/team/getAllTeams');
  }
  searchByBirthYear(year: number): Observable<any> {
    return this.http.get(`http://localhost:8089/emp/searchByBirthYear/${year}`);
  }
}
