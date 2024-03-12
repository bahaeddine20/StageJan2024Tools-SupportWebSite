import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrl: './default.component.scss'
})
export class DefaultComponent implements OnInit {

  sideBarOpen = true;

  constructor(){ }

  ngOnInit(): void { }

  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }
}
