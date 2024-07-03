import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }
  // Ajouter getUserId pour récupérer l'ID de l'utilisateur connecté
  getUserId(): number | null {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      return userData.id;
    }
    return null;
  }
  login(usernameOrEmail: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      usernameOrEmail,
      password
    }, httpOptions);
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password
    }, httpOptions);
  }
  uploadProfileImage(userId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`http://localhost:8080/api/auth/${userId}/uploadProfileImage`, formData);
  }

  
  requestResetPassword(email: string) {
    const url = 'http://localhost:8080/api/auth/forgot-password';
    return this.http.post(url, JSON.stringify({ email: email }), httpOptions);
}
resetPassword(token: string, newPassword: string): Observable<any> {
  const payload = { token: token, newPassword: newPassword };
  return this.http.put(`http://localhost:8080/api/auth/api/auth/reset-password`, payload);
}



validateToken(token: string): Observable<any> {
  const url = `'http://localhost:8080/api/auth/reset-password?token=${token}`;
  return this.http.get(url);
}

}
