import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import { DataPerfJira } from '../../_services/dataPerfJira/dataPerfJira';
import { DataFetchService } from '../../_services/dataFetch/data-fetch.service';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { HttpClient } from '@angular/common/http';
import saveAs from 'file-saver';
import { FormsModule, NgForm } from '@angular/forms';  // Add forms module
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-data-perf-jira-details',
  standalone: true,
  imports: [CommonModule, CanvasJSAngularChartsModule,FormsModule,MatInputModule,MatFormFieldModule,MatProgressSpinnerModule,MatIconModule,MatCardModule  ],
  templateUrl: './data-perf-jira-details.component.html',
  styleUrls: ['./data-perf-jira-details.component.scss']
})
export class DataPerfJiraDetailsComponent implements OnInit {
  data!: DataPerfJira;
  chartOptions: any;
  pieChartOptions: any;
  histogramOptions: any;
  fileToUpload: File | null = null;
  fileToUploadEXEL: File | null = null;
  capacity!: number;
  capacity2:any
  successMessage: string | null = null; // Propriété pour le message de succès
  errorMessage: string | null = null; // Propriété pour le message d'erreur


  @ViewChild('groupedBarChartContainer') groupedBarChartContainer!: ElementRef;
  @ViewChild('pieChartContainer') pieChartContainer!: ElementRef;
  @ViewChild('histogramContainer') histogramContainer!: ElementRef;

  constructor(
    private dataFetchService: DataFetchService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.dataFetchService.getDataById(id).subscribe(
        (response: DataPerfJira) => {
          if (response) {
            console.log('Data fetched:', response);
            this.data = response;
            
            // Fetch capacity if data is valid
            if (this.data.id) {
              this.dataFetchService.getCapacity(this.data.idsprint, this.data.start_date, this.data.end_date).subscribe(
                (capacity: number) => {
                  this.capacity2 = capacity;
                   this.capacity = this.capacity2;
                  console.log('Capacity:', this.capacity2);
                },
                (error) => {
                  console.error('Error fetching capacity:', error);
                }
              );
            } else {
              console.error('No ID in data');
            }
          } else {
            console.error('Empty response received');
          }
          this.setupCharts();
        },
        (error) => {
          console.error('Error fetching data by ID:', error);
        }
      );
    });
  }
  

  // Function to handle file input change event
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fileToUpload = file;
    }
  }
  
  onFileSelectedEXEL(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fileToUploadEXEL = file;
    }
  }
  
  // Submit form data

  

 setupCharts(): void {
    // Ensure grouped_bar_chart is an array
   let groupedBarChartData = this.data.grouped_bar_chart;
  if (typeof groupedBarChartData === 'string') {
    try {
      groupedBarChartData = JSON.parse(groupedBarChartData);
    } catch (error) {
      console.error('Error parsing grouped bar chart data:', error);
      groupedBarChartData = [];
    }
  }

    // Ensure pie_chart is an array
    let pieChartData = this.data.pie_chart;
    if (typeof pieChartData === 'string') {
      try {
        pieChartData = JSON.parse(pieChartData);
      } catch (error) {
        console.error('Error parsing pie chart data:', error);
        pieChartData = [];
      }
    }

    // Ensure histogram is an array
    let histogramData = this.data.histogram;
    if (typeof histogramData === 'string') {
      try {
        histogramData = JSON.parse(histogramData);
      } catch (error) {
        console.error('Error parsing histogram data:', error);
        histogramData = [];
      }
    }

    // Setup Grouped Bar Chart
    this.chartOptions = {
      animationEnabled: true,
      title: {
        text: ` ${this.data.sprint_name}`,
        fontColor: "#3f51b5"
      },
      axisY: {
        title: "Number of Issues",
        labelFontColor: "#333"
      },
      data: [
        {
          type: "column",
          name: "Treated issues (Integrated or Closed)",
          showInLegend: true,
          color: "#ff4081",
          dataPoints: groupedBarChartData.map((d: any) => ({
            label: d['Issue Type'],
            y: d['Treated issues (Integrated or Closed)']
          }))
        },
        {
          type: "column",
          name: "All issues",
          showInLegend: true,
          color: "#4caf50",
          dataPoints: groupedBarChartData.map((d: any) => ({
            label: d['Issue Type'],
            y: d['Count']  // Use 'Count' instead of 'All issues'
          }))
        }
      ]
    };

    // Setup Pie Chart
    this.pieChartOptions = {
      animationEnabled: true,
      title: {
        text: ` Consumed Story Points for ${this.data.sprint_name}`,
        fontColor: "#3f51b5"
      },
      data: [
        {
          type: "pie",
          showInLegend: true,
          toolTipContent: "<b>{label}</b>: {y} points",
          legendText: "{label}",
          indexLabelFontSize: 16,
          indexLabel: "{label}",
          dataPoints: pieChartData.map((d: any) => ({ label: d['Status'], y: d['consumed Story Points'] }))
        }
      ]
    };

    // Setup Histogram
    this.histogramOptions = {
      animationEnabled: true,
      title: {
        text: `Issue Types for ${this.data.sprint_name}`,
        fontColor: "#3f51b5"
      },
      axisY: {
        title: "Count",
        labelFontColor: "#333"
      },
      data: [
        {
          type: "column",
          name: "Issue Count",
          showInLegend: true,
          color: "#2196f3",
          dataPoints: histogramData.map((d: any) => ({ label: d['Issue Type'], y: d['Count'] }))
        }
      ]
    };
  }
  downloadExcelFile(): void {
    const fileId = this.data.id; // Assuming data.id contains the file ID
    const currentDate = new Date(); // Get the current date
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  
    this.http.get(`http://localhost:5000/download-xlsx/${fileId}`, {
        responseType: 'blob', // Set the response type to blob to handle binary data
      })
      .subscribe(
        (response: Blob) => {
          // Use FileSaver.js to save the file with the current date
          saveAs(response, `${this.data.sprint_name}  (${formattedDate}).xlsx`);
        },
        (error) => {
          console.error('Error downloading the file:', error);
        }
      );
  }
  

  downloadChart(chartType: string): void {
    let chartContentContainer: HTMLElement | undefined;
    let fileName = '';
  
    switch (chartType) {
      case 'grouped_bar_chart':
        chartContentContainer = this.groupedBarChartContainer?.nativeElement.querySelector('.chart-content') as HTMLElement;
        fileName = 'grouped_bar_chart.png';
        break;
      case 'pie_chart':
        chartContentContainer = this.pieChartContainer?.nativeElement.querySelector('.chart-content') as HTMLElement;
        fileName = 'pie_chart.png';
        break;
      case 'histogram':
        chartContentContainer = this.histogramContainer?.nativeElement.querySelector('.chart-content') as HTMLElement;
        fileName = 'histogram.png';
        break;
      default:
        console.error('Unknown chart type');
        return;
    }
  
    if (chartContentContainer) {
      html2canvas(chartContentContainer).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = fileName;
        link.click();
      }).catch(error => {
        console.error('Error capturing chart:', error);
      });
    }
  }
  isLoading = false; // État de chargement
  onSubmit(): void {
    const currentDate = new Date(); // Get the current date
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  
    this.isLoading = true; // Démarrer le chargement
    const fileId = this.data.id;
    const formData = new FormData();

    const captureChart = (chartContainer: HTMLElement, fileName: string): Promise<File> => {
      return html2canvas(chartContainer).then(canvas => {
        return new Promise((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], fileName, { type: 'image/png' }));
            }
          }, 'image/png');
        });
      });
    };

    const groupedBarChartContainer = this.groupedBarChartContainer.nativeElement.querySelector('.chart-content') as HTMLElement;
    const pieChartContainer = this.pieChartContainer.nativeElement.querySelector('.chart-content') as HTMLElement;
    const histogramContainer = this.histogramContainer.nativeElement.querySelector('.chart-content') as HTMLElement;

    if (!groupedBarChartContainer || !pieChartContainer || !histogramContainer) {
      console.error('One or more chart containers not found.');
      this.isLoading = false; // Arrêter le chargement
      return;
    }

    Promise.all([
      captureChart(groupedBarChartContainer, 'grouped_bar_chart.png'),
      captureChart(pieChartContainer, 'pie_chart.png'),
      captureChart(histogramContainer, 'histogram.png')
    ]).then(([groupedBarChartFile, pieChartFile, histogramFile]) => {
      formData.append('image1', groupedBarChartFile);
      formData.append('image2', pieChartFile);
      formData.append('image3', histogramFile);
      formData.append('sprintName', this.data.sprint_name);

      if (this.fileToUpload && this.capacity ) {
        formData.append('file', this.fileToUpload);
        if (this.capacity != null) {
          console.log(this.capacity.toString());
          formData.append('capacity', this.capacity.toString());
        } else {
          console.log('Capacity is null or undefined');
        }
      }


      if (this.fileToUploadEXEL  ) {
        formData.append('fileexel', this.fileToUploadEXEL);
        
      }

      this.http.post(`http://localhost:5000/download-presentation/${fileId}`, formData, { responseType: 'blob' })
        .subscribe({
          next: (response: Blob) => {
            // Créer une URL pour le Blob et initier le téléchargement
            const url = window.URL.createObjectURL(response);
            const a = document.createElement('a');
            a.href = url;
            a.download =  `${this.data.sprint_name} Presentation_${formattedDate}.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
            this.isLoading = false; // Arrêter le chargement
            this.successMessage = 'Form submitted successfully'; // Message de succès

          },
          error: (error) => {
            console.error('Error downloading presentation:', error);
            this.isLoading = false; // Arrêter le chargement
            this.errorMessage = 'Server error, please try again later.'; // Message d'erreur

          }
        });
    }).catch((error) => {
      console.error('Error capturing charts:', error);
      this.isLoading = false; // Arrêter le chargement
    });
  }


}
