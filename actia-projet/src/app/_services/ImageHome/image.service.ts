import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../loginService/token-storage.service';
import { ImageUploadModule } from '../../modules/Image-Home/upload-image.model'; 

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private baseUrl = 'http://localhost:8080/api/images'; 

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
  }

  uploadImage(file: File): Observable<ImageUploadModule> {
    const headers = this.getAuthHeaders();
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<ImageUploadModule>(`${this.baseUrl}/api/images/uploadHome`, formData, { headers });
  }

  getAllImages(): Observable<ImageUploadModule[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<ImageUploadModule[]>(this.baseUrl, { headers });
  }

  getImageById(id: number): Observable<Blob> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/${id}`, { responseType: 'blob', headers });
  }

  deleteImage(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers });
  }
}
