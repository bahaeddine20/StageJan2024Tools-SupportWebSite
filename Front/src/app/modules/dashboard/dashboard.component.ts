import { CommonModule } from '@angular/common';
import { Component, NgZone, inject } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor() {
    inject(NgZone).runOutsideAngular(() => {
      setInterval(() => {}, 1000);
    })
  }
  slides: any[] = [
    {
      url: '/assets/images/actia.jpg',
      title: 'First slide',
      description: 'This is the first slide',
    },
    {
      url: '/assets/images/techxauto2.jpeg',
      title: 'Second slide',
      description: 'This is the second slide',
    },
    {
      url: '/assets/images/team1.jpg',
      title: 'Third slide',
      description: 'This is the third slide',
    },
    {
      url: '/assets/images/team2.jpg',
      title: 'Fourth slide',
      description: 'This is the fourth slide',
    },
    {
      url: '/assets/images/techxauto.jpeg',
      title: 'Fifth slide',
      description: 'This is the fifth slide',
    },
  ];
}

