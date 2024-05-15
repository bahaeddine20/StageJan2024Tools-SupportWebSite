import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../loginService/token-storage.service';
import { Team } from '../../modules/crud/teams/team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private apiUrl = 'http://localhost:8080/team';

  constructor(private http: HttpClient,
    private tokenStorageService: TokenStorageService ) {}

    getAllTeams(): Observable<any> {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      });
      
      return this.http.get(`${this.apiUrl}/getAllTeams`, { headers });
    }
    

  getTeamById(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get(`http://localhost:8080/team/getTeamById/${id}`, { headers });
  }

  addTeam(teamData: any, teamImages: File[]){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    const formData: FormData = new FormData();
    
  
    // Append team data as a JSON string
    formData.append('team', new Blob([JSON.stringify(teamData)], { type: 'application/json' }));
  
    // Append each image file
    for (let i = 0; i < teamImages.length; i++) {
      formData.append('imagePath', teamImages[i]);
    }
    console.log(formData)
   console.log(teamData)
   console.log(teamImages)
   const formDataEntries = (formData as any).entries();
if (formDataEntries) {
  for (let pair of formDataEntries) {
    console.log(pair[0], pair[1]);
  }
}
    // Make the HTTP request
    return this.http.post<Team>('http://localhost:8080/team/addTeam', formData,{ headers });
  }
  
  
  
  updateTeam(id: number, teamData: Team, imageFiles: File[]): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    const formData: FormData = new FormData();
  
    // Append team data as a JSON string
    formData.append('team', new Blob([JSON.stringify(teamData)], { type: 'application/json' }));
  
    // Append each image file with a unique name
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append(`imagePath`, imageFiles[i]);
    }
  
    // Make the HTTP request
    return this.http.put<Team>(`http://localhost:8080/team/updateTeam/${id}`, formData,{ headers });
  }
  deleteTeam(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.delete(`http://localhost:8080/team/deleteTeamById/${id}`,{ headers });
  }
  countTeams(): Observable<number> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get<number>(`http://localhost:8080/team/count`,{ headers });
  }
}