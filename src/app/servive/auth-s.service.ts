import { Injectable } from '@angular/core';
import { Login } from '../Class/Login/login';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const URL = "http://localhost:3000/login";

@Injectable({
  providedIn: 'root'
})

export class AuthSService {
  constructor(private http: HttpClient) { }

  getLogin():Observable<Login[]>{
      return this.http.get<Login[]>(URL);
  }

  public login(username:string,pwd:string,namebase:string,pwdbase:string){
    if(username==namebase && pwd==pwdbase){
      localStorage.setItem("etat","connected")
      return true;
    }
    else{
      localStorage.setItem("etat","disconnected")
      return false;
    }
  }

  public logout(){
    localStorage.removeItem('etat');
  }


}
