import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Activite } from 'src/app/Class/Activite/activite';
import { ActionSService } from 'src/app/servive/action-s.service';

@Component({
  selector: 'app-modif-personne',
  templateUrl: './modif-personne.component.html',
  styleUrls: ['./modif-personne.component.css']
})
export class ModifPersonneComponent implements OnInit {
  lesActivites: Activite[] = [];
  lesactivite!: Activite;
  lesequipes!: Activite;
  idActivite!: number;  
  index!: number;  

  yourFormGroupReference!: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private actionSService: ActionSService
  ) { }

  ngOnInit(): void {
    this.idActivite = this.activatedRoute.snapshot.params['id'];
    this.index = this.activatedRoute.snapshot.params['id2'];


    this.actionSService.getActiviteid(this.idActivite).subscribe(data => {
      this.lesactivite = data;
      console.log(this.lesactivite.equipe[this.index]);
      this.yourFormGroupReference = this.formBuilder.group({
        firstName:[this.lesactivite.equipe[this.index].firstName],
        lastName:[this.lesactivite.equipe[this.index].lastName],
        role:[this.lesactivite.equipe[this.index].role],
        image: [this.lesactivite.equipe[this.index].image],
        linkdin:[this.lesactivite.equipe[this.index].linkdin],
    });
      
      
    });

    // this.yourFormGroupReference = this.formBuilder.group({
    //   lastName: [''],
    //   firstName: [''],
    //   role: [''],
    //   image: ['assets/images/layout_img/bg1.png'],
    //   linkdin: ['']
      
    // });

    this.afficherAct();
    this.afficherActv();
  }

  afficherAct() {
    this.actionSService.getActiviteid(this.idActivite).subscribe((data) => {
      this.lesactivite = data;
    });
  }

  afficherActv() {
    this.actionSService.getActivite().subscribe((data) => {
      this.lesActivites = data;
    });
  }

  onDetails(id: number) {
    this.router.navigate(['/admin/detailsA/' + id]);
  }

  onSubmit() {
    const formData = this.yourFormGroupReference.value;
  
    const activiteActuelle = { ...this.lesactivite };
  
    this.lesactivite.equipe[this.index] = formData;

    console.log( this.lesactivite.equipe);
    
    this.actionSService.updateActivite(this.idActivite, activiteActuelle).subscribe(response => {
      this.router.navigate(['/admin/detailsA/' + this.idActivite]);
    });
  }
}