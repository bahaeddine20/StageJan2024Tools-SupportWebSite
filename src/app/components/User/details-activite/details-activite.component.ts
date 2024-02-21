import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Activite } from 'src/app/Class/Activite/activite';
import { ActionSService } from 'src/app/servive/action-s.service';

@Component({
  selector: 'app-details-activite',
  templateUrl: './details-activite.component.html',
  styleUrls: ['./details-activite.component.css']
})
export class DetailsActiviteComponent implements OnInit{
  idActivite!:number;
  act!:Activite; 
 lesActivites:Activite[]=[];
 
  constructor(private activatedRoute: ActivatedRoute,private router:Router,private actionSService:ActionSService) { }

  ngOnInit(): void {
    this.idActivite=this.activatedRoute.snapshot.params['identif']
    this.afficherActivite()
    console.log(this.lesActivites);
    this.actionSService.getActivite().subscribe(data=>{
      this.lesActivites=data;
      console.log(this.lesActivites);

    })

    this.activatedRoute.paramMap.subscribe(params => {
      this.idActivite = +params.get('identif')!;
      this.afficherActivite();
    });
  }

  afficherActivite() {
    this.actionSService.getActiviteid(this.idActivite).subscribe(data=>this.act=data);
  }

 
  
  onDetails(id:number){
    this.router.navigate(['/details/'+id]); 
  }

}
