import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sprint } from './sprint.model';
import { TokenStorageService } from '../loginService/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SprintService {

  private apiUrl = 'http://localhost:5000';
  private apiUrlSprint = 'http://localhost:8080/api/sprints';

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) { }

  submitForm(idsprint: number, formData: FormData): Observable<any> {

    return this.http.post<any>(`${this.apiUrl}/submit-form/${idsprint}`, formData);
  }

  createSprint(sprint: Sprint, teamId: number): Observable<Sprint> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.post<Sprint>(`${this.apiUrlSprint}/create/${teamId}`, sprint, { headers });
  }

  getSprints(): Observable<Sprint[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get<Sprint[]>(`${this.apiUrlSprint}/all`, { headers });
  }

  getSprintsByTeamId(teamId: number): Observable<Sprint[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get<Sprint[]>(`${this.apiUrlSprint}/all/${teamId}`, { headers });
  }

  getSprintById(id: number): Observable<Sprint> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get<Sprint>(`${this.apiUrlSprint}/${id}`, { headers });
  }

  


  updateSprint(sprint: Sprint, sprintId: number): Observable<Sprint> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    console.log(sprint);
    return this.http.put<Sprint>(`${this.apiUrlSprint}/update/${sprintId}`, sprint, { headers });
  }





}
