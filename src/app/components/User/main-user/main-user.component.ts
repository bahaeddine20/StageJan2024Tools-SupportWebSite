import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Activite } from 'src/app/Class/Activite/activite';
import { ActionSService } from 'src/app/servive/action-s.service';

@Component({
  selector: 'app-main-user',
  templateUrl: './main-user.component.html',
  styleUrls: ['./main-user.component.css']
})
export class MainUserComponent implements OnInit {
  lesActivites:Activite[]=[];

  constructor(private router:Router, private actionSService:ActionSService) { }

  ngOnInit(): void {
    console.log(this.lesActivites);
    this.actionSService.getActivite().subscribe(data=>{
      this.lesActivites=data;
      console.log(this.lesActivites);

    })
  }
  
  onDetails(id:number){
    this.router.navigate(['/details/'+id]); 
  }


}
