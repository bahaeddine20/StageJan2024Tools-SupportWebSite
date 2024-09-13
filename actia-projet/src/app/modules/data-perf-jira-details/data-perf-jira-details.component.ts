import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import { DataPerfJira } from '../../_services/dataPerfJira/dataPerfJira';
import { DataFetchService } from '../../_services/dataFetch/data-fetch.service';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { HttpClient } from '@angular/common/http';
import saveAs from 'file-saver';


@Component({
  selector: 'app-data-perf-jira-details',
  standalone: true,
  imports: [CommonModule, CanvasJSAngularChartsModule],
  templateUrl: './data-perf-jira-details.component.html',
  styleUrls: ['./data-perf-jira-details.component.scss']
})
export class DataPerfJiraDetailsComponent implements OnInit {
  data!: DataPerfJira; // Single object
  chartOptions: any;
  pieChartOptions: any;
  histogramOptions: any;

  @ViewChild('groupedBarChartContainer') groupedBarChartContainer!: ElementRef;
  @ViewChild('pieChartContainer') pieChartContainer!: ElementRef;
  @ViewChild('histogramContainer') histogramContainer!: ElementRef;

  constructor(
    private dataFetchService: DataFetchService,
    private route: ActivatedRoute,    private http: HttpClient // Inject HttpClient

  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id']; // Get the ID from the route parameters
      this.dataFetchService.getDataById(id).subscribe(
        (response: DataPerfJira) => {
          this.data = response;
          this.setupCharts();
        },
        (error) => {
          console.error('Error fetching data by ID', error);
        }
      );
    });
  }

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
    this.http.get(`http://localhost:5000/download-xlsx/${fileId}`, {
        responseType: 'blob', // Set the response type to blob to handle binary data
      })
      .subscribe(
        (response: Blob) => {
          // Use FileSaver.js to save the file
          saveAs(response, `performanceJira_${fileId}.xlsx`);
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

  
}
