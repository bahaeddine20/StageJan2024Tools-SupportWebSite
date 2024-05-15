import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../../modules/profil/user';
import { TokenStorageService } from '../loginService/token-storage.service';
import { ChangePasswordRequest } from '../../modules/profil/change-password-request';

@Injectable({
  providedIn: 'root'
})
export class UserDtoService {
  private apiUrl = 'http://localhost:8080/api/users'; // URL de votre API

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) { }

  getUserById(id: number): Observable<User> {
    const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken() // Assurez-vous que le token est correctement envoyé
    });
  
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers }).pipe(
        catchError(error => {
            console.error('Error fetching user data:', error);
            return throwError(() => new Error('Failed to load user data'));
        })
    );
  }
  updateUser(id: number, user: User, passwordChange: ChangePasswordRequest, formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    formData.append('user', new Blob([JSON.stringify(user)], { type: 'application/json' }));
    if (passwordChange && passwordChange.oldPassword) {
      formData.append('passwordChange', new Blob([JSON.stringify(passwordChange)], { type: 'application/json' }));
    }
    return this.http.put(`${this.apiUrl}/${id}`, formData, { headers }).pipe(
      catchError(error => {
        console.error('Error updating user:', error);
        return throwError(() => new Error('Failed to update user'));
      })
    );
  }
}
