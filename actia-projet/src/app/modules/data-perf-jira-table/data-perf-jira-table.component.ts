import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataFetchService } from '../../_services/dataFetch/data-fetch.service';
import { DataPerfJira } from '../../_services/dataPerfJira/dataPerfJira';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SprintService } from '../../_services/sprint/sprint.service';

@Component({
  selector: 'app-data-perf-jira-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './data-perf-jira-table.component.html',
  styleUrls: ['./data-perf-jira-table.component.scss']
})
export class DataPerfJiraTableComponent implements OnInit {
  dataSource = new MatTableDataSource<DataPerfJira>();
  displayedColumns: string[] = ['start_date', 'end_date', 'sprint_name', 'date_genere'];
  idsprint!: number;  // Capture the parameter from the route
  sprint: any;

  constructor(   
     private sprintService: SprintService,

    private dataFetchService: DataFetchService, 
    private router: Router,
    private route: ActivatedRoute // Inject ActivatedRoute to capture the idsprint
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idsprint = +params.get('idsprint')!; // Capture idsprint from the route
      this.fetchDataByIdsprint(this.idsprint);
      this.getSprintData(this.idsprint)
    });
  }
  getSprintData(sprintId: number) {
    this.sprintService.getSprintById(sprintId).subscribe(data => {
      this.sprint = data; // Assurez-vous que la propriété 'team' est définie dans votre composant
    });
  }
  fetchDataByIdsprint(idsprint: number): void {
    this.dataFetchService.getDataByIdsprint(idsprint).subscribe(
      (data: DataPerfJira[]) => {
        this.dataSource.data = data.map(item => {
          const generatedDate = new Date(item.date_genere);
          const now = new Date();
          
          const diffInSeconds = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()+1, now.getMinutes(), now.getSeconds()) - 
                                            Date.UTC(generatedDate.getFullYear(), generatedDate.getMonth(), generatedDate.getDate(), generatedDate.getHours(), generatedDate.getMinutes(), generatedDate.getSeconds())) / 1000);
          
          let formattedDateGenere;
        
          if (diffInSeconds < 60) {
            formattedDateGenere = 'Just now';
          } else if (diffInSeconds < 3600) {
            formattedDateGenere = `${Math.floor(diffInSeconds / 60)} minute${Math.floor(diffInSeconds / 60) > 1 ? 's' : ''} ago`;
          } else if (diffInSeconds < 86400) {
            formattedDateGenere = `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''} ago`;
          } else {
            formattedDateGenere = `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''} ago`;
          }
        
          return {
            ...item,
            date_genere: formattedDateGenere
          };
        });
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }

  viewDetails(row: DataPerfJira): void {
    this.router.navigate(['/data-perf-jira-details', row.id]);
  }

  addStatsPerformance(): void {
    // Navigate to /sprintForm/idsprint using the captured idsprint
    this.router.navigate([`/sprintForm/${this.idsprint}`]);
  }
}
