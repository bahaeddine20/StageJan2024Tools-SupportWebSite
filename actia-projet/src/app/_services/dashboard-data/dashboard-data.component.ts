import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DataFetchService } from '../dataFetch/data-fetch.service';
import { DataPerfJira } from '../../_services/dataPerfJira/dataPerfJira';
import { CommonModule } from '@angular/common';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-dashboard-data',
  standalone: true,
  imports: [CommonModule, CanvasJSAngularChartsModule],
  templateUrl: './dashboard-data.component.html',
  styleUrls: ['./dashboard-data.component.scss']
})
export class DashboardDataComponent implements OnInit {
  data: DataPerfJira[] = [];
  chartOptionsList: any[] = [];
  pieChartOptionsList: any[] = [];
  histogramOptionsList: any[] = [];

  @ViewChildren('chartContainer') chartContainers!: QueryList<any>;
  @ViewChildren('pieChartContainer') pieChartContainers!: QueryList<any>;
  @ViewChildren('histogramContainer') histogramContainers!: QueryList<any>;

  constructor(private dataFetchService: DataFetchService) { }

  ngOnInit(): void {
    this.dataFetchService.getData().subscribe(
      (data: DataPerfJira[]) => {
        this.data = data;
        console.log('Fetched data:', data);
        this.processChartData(data);
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }

  processChartData(data: DataPerfJira[]): void {
    if (data.length > 0) {
      this.chartOptionsList = [];
      this.pieChartOptionsList = [];
      this.histogramOptionsList = [];

      data.forEach(item => {
        let chartData = item.grouped_bar_chart; // Grouped Bar Chart data
        let pieChartData = item.pie_chart; // Pie Chart data
        let histogramData = item.histogram; // Histogram data

        // Parse grouped bar chart data
        if (typeof chartData === 'string') {
          try {
            chartData = JSON.parse(chartData);
          } catch (error) {
            console.error('Error parsing grouped bar chart data:', error);
            return;
          }
        }

        // Parse pie chart data
        if (typeof pieChartData === 'string') {
          try {
            pieChartData = JSON.parse(pieChartData);
          } catch (error) {
            console.error('Error parsing pie chart data:', error);
            return;
          }
        }

        // Parse histogram data
        if (typeof histogramData === 'string') {
          try {
            histogramData = JSON.parse(histogramData);
          } catch (error) {
            console.error('Error parsing histogram data:', error);
            return;
          }
        }

        // Configure grouped bar chart options
        if (Array.isArray(chartData)) {
          this.chartOptionsList.push({
            animationEnabled: true,
            title: {
              text: `Grouped Bar Chart for ${item.sprint_name}`,
              fontColor: "#3f51b5" // Title color
            },
            axisY: {
              title: "Number of Issues",
              labelFontColor: "#333" // Axis label color
            },
            data: [{
              type: "column",
              name: "Treated issues (Integrated or Closed)",
              showInLegend: true,
              color: "#ff4081", // Custom color for this data series
              dataPoints: chartData.map((d: any) => ({ label: d['Issue Type'], y: d['Treated issues (Integrated or Closed)'] }))
            },
            {
              type: "column",
              name: "All issues",
              showInLegend: true,
              color: "#4caf50", // Custom color for this data series
              dataPoints: chartData.map((d: any) => ({ label: d['Issue Type'], y: d['All issues'] }))
            }]
          });
        } else {
          console.error('Grouped bar chart data is not an array after parsing:', chartData);
        }

        // Configure pie chart options
        if (Array.isArray(pieChartData)) {
          this.pieChartOptionsList.push({
            animationEnabled: true,
            title: {
              text: `Pie Chart of Consumed Story Points for ${item.sprint_name}`,
              fontColor: "#3f51b5" // Title color
            },
            data: [{
              type: "pie",
              showInLegend: true,
              toolTipContent: "<b>{label}</b>: {y} points",
              legendText: "{label}",
              indexLabelFontSize: 16,
              indexLabel: "{label} - {y} points",
              dataPoints: pieChartData.map((d: any) => ({ label: d['Status'], y: d['consumed Story Points'] }))
            }]
          });
        } else {
          console.error('Pie chart data is not an array after parsing:', pieChartData);
        }

        // Configure histogram options
        if (Array.isArray(histogramData)) {
          this.histogramOptionsList.push({
            animationEnabled: true,
            title: {
              text: `Histogram of Issue Types for ${item.sprint_name}`,
              fontColor: "#3f51b5" // Title color
            },
            axisY: {
              title: "Count",
              labelFontColor: "#333" // Axis label color
            },
            data: [{
              type: "column",
              name: "Issue Count",
              showInLegend: true,
              color: "#2196f3", // Custom color for this data series
              dataPoints: histogramData.map((d: any) => ({ label: d['Issue Type'], y: d['Count'] }))
            }]
          });
        } else {
          console.error('Histogram data is not an array after parsing:', histogramData);
        }
      });
    } else {
      console.error('No data available to process');
    }
  }

  downloadCharts(index: number): void {
    const chartContainer = this.chartContainers.toArray()[index];
    const pieChartContainer = this.pieChartContainers.toArray()[index];
    const histogramContainer = this.histogramContainers.toArray()[index];

    // Function to capture and download images
    const captureAndDownload = (container: any, fileName: string) => {
      html2canvas(container.nativeElement).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = fileName;
        link.click();
      });
    };

    // Capture and download each chart
    captureAndDownload(chartContainer, 'grouped_bar_chart.png');
    captureAndDownload(pieChartContainer, 'pie_chart.png');
    captureAndDownload(histogramContainer, 'histogram.png');
  }
}
