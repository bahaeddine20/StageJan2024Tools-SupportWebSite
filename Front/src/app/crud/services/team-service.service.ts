import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Team } from '../team';

@Injectable({
  providedIn: 'root'
})
export class TeamServiceService {

  constructor(private http: HttpClient) {}

  getTeamById(id: number): Observable<any> {
    return this.http.get(`http://localhost:8089/team/getTeamById/${id}`);
  }

  getAllTeams(): Observable<any> {
    return this.http.get(`http://localhost:8089/team/getAllTeams`);
  }

  addTeam(teamData: any, teamImages: File[]){
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
    return this.http.post<Team>('http://localhost:8089/team/addTeam', formData);
  }



  updateTeam(id: number, teamData: Team, imageFiles: File[]): Observable<any> {
    const formData: FormData = new FormData();

    // Append team data as a JSON string
    formData.append('team', new Blob([JSON.stringify(teamData)], { type: 'application/json' }));

    // Append each image file with a unique name
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append(`imagePath`, imageFiles[i]);
    }

    // Make the HTTP request
    return this.http.put<Team>(`http://localhost:8089/team/updateTeam/${id}`, formData);
  }
  deleteTeam(id: number): Observable<any> {
    return this.http.delete(`http://localhost:8089/team/deleteTeamById/${id}`);
  }
}
