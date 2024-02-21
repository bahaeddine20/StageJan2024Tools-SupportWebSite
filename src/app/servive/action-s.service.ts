import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Activite } from '../Class/Activite/activite';
import { Observable } from 'rxjs/internal/Observable';
import { Login } from '../Class/Login/login';
import { Membre } from '../Class/Membre/membre';

const URL = "http://localhost:3000/activite";
const URL2 = "http://localhost:3000/membre";
const URL3="http://localhost:3000/login";

@Injectable({
  providedIn: 'root'
})

export class ActionSService implements OnInit {

  constructor(private http: HttpClient) { }


  ngOnInit(): void {
  }


  getLogin():Observable<Login[]>{
    return this.http.get<Login[]>(URL3);
  }

  getLoginId(id:number):Observable<Login>{
    return this.http.get<Login>(URL3+"/"+id);
  }

  getActivite():Observable<Activite[]>{
    return this.http.get<Activite[]>(URL);
  }

  getActiviteid(id:number):Observable<Activite>{
    return this.http.get<Activite>(URL+"/"+id)
  }

  updateAdminPassword(id:number, p:Login):Observable<Login>{
    return this.http.put<Login>(URL3+"/"+ id, p);
  }

  updateAdminUserName(id:number, u:Login):Observable<Login>{
    return this.http.put<Login>(URL3+"/"+ id, u);
  }

  deleteA(id:number){
    return this.http.delete(URL+"/"+ id);
  }

  updateActivite(id: number, activite: Activite): Observable<Activite> {
    return this.http.put<Activite>(`${URL}/${id}`, activite);
  }

  updateMembre(id: number, membre: Membre): Observable<Membre> {
    return this.http.put<Membre>(`${URL}/${id}`, Membre);
  }

  addPersonne(m:Membre):Observable<Membre>{
    return this.http.post<Membre>(URL, m);
  }


  updateAct(act: Activite): Observable<Activite> {
    const updateUrl = `${URL}/${act.id}`;
    return this.http.put<Activite>(updateUrl, act);
  }
  

  addAvtivity(a: Activite): Observable<Activite> {
    return this.http.post<Activite>(URL, a);
  }
  
  EditActivity(Act:Activite):Observable<Activite>{
    return this.http.put<Activite>(URL+'/'+Act.id,Act);
  }

  
}
