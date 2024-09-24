import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataPerfJira } from '../dataPerfJira/dataPerfJira';
import { TokenStorageService } from '../loginService/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class DataFetchService {
  private apiUrl = 'http://127.0.0.1:5000/data';
  private apiUrlById = 'http://127.0.0.1:5000/data/stats/'; // Base URL for ID-based queries
  private apiUrlByIdsprint = 'http://127.0.0.1:5000/data/'; // Base URL for idsprint-based queries

  constructor(private http: HttpClient,
    private tokenStorageService: TokenStorageService) {}

  getData(): Observable<DataPerfJira[]> {
    return this.http.get<DataPerfJira[]>(this.apiUrl);
  }

  
  deleteDataPerfJira(id: number): Observable<any> {
    return this.http.delete(`http://127.0.0.1:5000/data-perf-jira/${id}`);
  }
  
  getDataById(id: string): Observable<DataPerfJira> {
    return this.http.get<DataPerfJira>(`${this.apiUrlById}${id}`);
  }
  getDataByIdsprint(idsprint: number): Observable<DataPerfJira[]> {
    return this.http.get<DataPerfJira[]>(`${this.apiUrlByIdsprint}${idsprint}`);
  }
  getCapacity(idsprint: number, start: string, end: string): Observable<number> {
    const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });

    // Formater les dates au format yyyy-MM-dd
    const startDate = start; // Extrait la partie date de la chaîne ISO
    const endDate = end;     // Extrait la partie date de la chaîne ISO

    // Construire l'URL avec les paramètres de date
    const url = `http://localhost:8080/api/sprints/${idsprint}/congee?start=${startDate}&end=${endDate}`;

    return this.http.get<number>(url, { headers });
}

}
