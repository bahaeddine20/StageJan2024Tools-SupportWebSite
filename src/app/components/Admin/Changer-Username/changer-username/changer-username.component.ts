import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Activite } from 'src/app/Class/Activite/activite';
import { Login } from 'src/app/Class/Login/login';
import { ActionSService } from 'src/app/servive/action-s.service';

@Component({
  selector: 'app-changer-username',
  templateUrl: './changer-username.component.html',
  styleUrls: ['./changer-username.component.css']
})
export class ChangerUsernameComponent implements OnInit {
  ChangerForm!:FormGroup
  login:Login[]=[];
  lesActivites:Activite[]=[];

  constructor(private router:Router,private formBuilder:FormBuilder,private actionSService:ActionSService) { }

  ngOnInit(): void {
    this.afficherLogin();
    this.ChangerForm = this.formBuilder.nonNullable.group(
      {
      ancien:['',Validators.required],
      nouveau:['',Validators.required],
      nouveauC:['',Validators.required],
      }
    )
    console.log(this.lesActivites);
    this.actionSService.getActivite().subscribe(data=>{
      this.lesActivites=data;
      console.log(this.lesActivites);

    })
  }

  afficherLogin(){
    this.actionSService.getLogin()
    .subscribe(data => 
      this.login=data
    )
  }

  
  onChanger(){
    const ancienName = this.ChangerForm.get('ancien')?.value;
    const nouveauName = this.ChangerForm.get('nouveau')?.value;
    const nouveauCName = this.ChangerForm.get('nouveauC')?.value;
    const adminCourant = this.login[0];

    if(adminCourant.username==ancienName){
      console.log('ffff');
      
      if(nouveauName==nouveauCName){
        adminCourant.username=nouveauName;
        this.actionSService.updateAdminUserName(adminCourant.id,adminCourant).subscribe(() => {
          this.router.navigate(['/admin/mainA']);
        });;
      }
      else{
        alert("Verifier la confirmation du mot de passe")
      }
    }
    else{
      alert("L'ancien mot de passe est incorrecte")
    }
    
  }


  
  onDetails(id:number){
    this.router.navigate(['/admin/detailsA/'+id]); 
  }

}
