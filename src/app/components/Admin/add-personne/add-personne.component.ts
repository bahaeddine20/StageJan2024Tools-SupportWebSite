import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Activite } from 'src/app/Class/Activite/activite';
import { Role } from 'src/app/role';
import { ActionSService } from 'src/app/servive/action-s.service';

@Component({
  selector: 'app-add-personne',
  templateUrl: './add-personne.component.html',
  styleUrls: ['./add-personne.component.css']
})
export class AddPersonneComponent implements OnInit{
  lesActivites:Activite[]=[];
  ajoutPersonneForm!:FormGroup
  lesroles=Object.values(Role);
  lesactivite!:Activite;
  idActivite!:number;

  constructor(private activatedRoute: ActivatedRoute,private router:Router,private formBuilder:FormBuilder, private actionSService:ActionSService) { }

  ngOnInit(): void {
    this.idActivite=this.activatedRoute.snapshot.params['id']

    this.afficherAct()

    this.ajoutPersonneForm = this.formBuilder.nonNullable.group(
      {
      id:[''],
      nom:[''],
      prenom:[''],
      role:[''],
      img:['assets/images/layout_img/profile.jpg'],
      linkdin:['']
      }
    )

    this.actionSService.getActivite().subscribe(data=>{
      this.lesActivites=data;
      console.log(this.lesActivites);

    })
  }

  afficherAct(){
    this.actionSService.getActiviteid(this.idActivite).subscribe((data)=>{
      this.lesactivite=data;
    })

  }
  
  onDetails(id:number){
    this.router.navigate(['/admin/detailsA/'+id]); 
  }

  onAddPForm() {

      const idNext=this.lesactivite.equipe.length+1
      const newPerson = {
        id:idNext.toString(),
        lastName: this.ajoutPersonneForm.get('nom')?.value,
        firstName: this.ajoutPersonneForm.get('prenom')?.value,
        role: this.ajoutPersonneForm.get('role')?.value,
        image: this.ajoutPersonneForm.get('img')?.value,
        linkdin: this.ajoutPersonneForm.get('linkdin')?.value
      };

      this.lesactivite.equipe?.push(newPerson);

      this.actionSService.updateAct(this.lesactivite).subscribe(() => {
        this.router.navigate(['/admin/mainA']);
      });

  }
}
