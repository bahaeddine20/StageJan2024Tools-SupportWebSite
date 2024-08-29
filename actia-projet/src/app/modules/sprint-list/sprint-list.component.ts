import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Sprint } from '../../_services/sprint/sprint.model';
import { SprintService } from '../../_services/sprint/sprint.service';
import { TeamService } from '../../_services/teams/team.service';

@Component({
  selector: 'app-sprint-list',
  standalone: true,
  templateUrl: './sprint-list.component.html',
  styleUrls: ['./sprint-list.component.scss'],
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
})
export class SprintListComponent implements OnInit {
  sprints: Sprint[] = [];
  currentTeamId: number | null = null;
  team: any;

  // Add the 'stats' column to the displayed columns array
  displayedColumns: string[] = ['stats', 'id', 'name', 'description', 'date_Debut', 'date_Fin', 'edit'];

  constructor(
    private sprintService: SprintService,
    private route: ActivatedRoute,
    private router: Router,
    private teamService: TeamService

  ) {}

  ngOnInit(): void {
    // Get teamId from the route
    this.currentTeamId = Number(this.route.snapshot.paramMap.get('teamId'));
    this.getTeamData(this.currentTeamId); // Ajoutez cette ligne

    if (this.currentTeamId) {
      this.sprintService.getSprintsByTeamId(this.currentTeamId).subscribe({
        next: (data) => {
          this.sprints = data;
        },
        error: (err) => {
          console.error('Error fetching sprints', err);
        },
      });
      
    } else {
      console.error('No teamId found in the route');
    }
  }

  navigateToAddSprint(): void {
    if (this.currentTeamId !== null) {
      this.router.navigate([`/sprint_Create/${this.currentTeamId}`]);
    } else {
      console.error('No teamId available for navigation');
    }
  }

  // Method to navigate to the stats page for the specific sprint
  navigateToStats(idsprint: number): void {
    this.router.navigate([`/data-table/${idsprint}`]);
  }

  getTeamData(teamId: number) {
    this.teamService.getTeamById(teamId).subscribe(data => {
      this.team = data; // Assurez-vous que la propriété 'team' est définie dans votre composant
    });
  }

  navigateToEditSprint(sprintId: number): void {
    if (this.currentTeamId !== null) {
      this.router.navigate([`/sprints/${this.currentTeamId}/edit/${sprintId}`]);
    } else {
      console.error('No teamId available for navigation');
    }
  }
  
  
}
