import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/Class/Login/login';
import { AuthSService } from 'src/app/servive/auth-s.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm!:FormGroup
  login:Login[]=[];

  constructor(private router:Router,private authSService:AuthSService,private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    localStorage.setItem("etat","disconnected")
    this.afficherLogin();
    this.loginForm = this.formBuilder.nonNullable.group(
      {
      username:['',Validators.required],
      password:['',Validators.required],
      }
    )
  }
  
  afficherLogin(){
    this.authSService.getLogin()
    .subscribe(data => 
      this.login=data
    )
  }

  onAuthentif(){
    if(this.authSService.login(this.loginForm.get('username')?.value,this.loginForm.get('password')?.value,this.login[0].username,this.login[0].password)){
      this.router.navigate(['/admin/mainA'])
    }
    else{
      alert("Incorrect Informations")
    }
  }
}
