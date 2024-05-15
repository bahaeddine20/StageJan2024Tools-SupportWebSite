import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordGuard implements CanActivate {

  constructor(private http: HttpClient, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const token = next.queryParams['token'];
    if (!token) {
      return this.router.parseUrl('/login');
    }

    return this.http.get<boolean>(`http://localhost:8080/api/auth/validate-reset-token?token=${token}`).toPromise().then(response => {
      if (response) {
        return true;
      } else {
        return this.router.parseUrl('/login');
      }
    }).catch(() => {
      return this.router.parseUrl('/login');
    });
  }
  
}
