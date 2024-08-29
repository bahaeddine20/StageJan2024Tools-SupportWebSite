import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataPerfJira } from '../_services/dataPerfJira/dataPerfJira';

@Injectable({
  providedIn: 'root'
})
export class DataFetchService {
  private apiUrl = 'http://127.0.0.1:5000/data';
  private apiUrlById = 'http://127.0.0.1:5000/data/stats/'; // Base URL for ID-based queries
  private apiUrlByIdsprint = 'http://127.0.0.1:5000/data/'; // Base URL for idsprint-based queries

  constructor(private http: HttpClient) { }

  getData(): Observable<DataPerfJira[]> {
    return this.http.get<DataPerfJira[]>(this.apiUrl);
  }

  

  getDataById(id: string): Observable<DataPerfJira> {
    return this.http.get<DataPerfJira>(`${this.apiUrlById}${id}`);
  }
  getDataByIdsprint(idsprint: number): Observable<DataPerfJira[]> {
    return this.http.get<DataPerfJira[]>(`${this.apiUrlByIdsprint}${idsprint}`);
  }
}
