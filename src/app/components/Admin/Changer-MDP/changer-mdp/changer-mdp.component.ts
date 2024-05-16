import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Activite } from 'src/app/Class/Activite/activite';
import { Login } from 'src/app/Class/Login/login';
import { ActionSService } from 'src/app/servive/action-s.service';

@Component({
  selector: 'app-changer-mdp',
  templateUrl: './changer-mdp.component.html',
  styleUrls: ['./changer-mdp.component.css']
})
export class ChangerMDPComponent implements OnInit {
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
    const ancienMDP = this.ChangerForm.get('ancien')?.value;
    const nouveauMDP = this.ChangerForm.get('nouveau')?.value;
    const nouveauCMDP = this.ChangerForm.get('nouveauC')?.value;
    const adminCourant = this.login[0];

    if(adminCourant.password==ancienMDP){
      console.log('ffff');
      
      if(nouveauMDP==nouveauCMDP){
        adminCourant.password=nouveauMDP;
        this.actionSService.updateAdminPassword(adminCourant.id,adminCourant).subscribe(() => {
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
