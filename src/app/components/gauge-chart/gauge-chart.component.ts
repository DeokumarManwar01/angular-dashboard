import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  standalone: false,
  selector: 'app-gauge-chart',
  styleUrls: ['./gauge-chart.component.scss'],
  templateUrl: './gauge-chart.component.html',
})
export class GaugeChartComponent {
  public gaugeValue: number = 240;
  public vendorsUsed: number = 80;
  public hikeValue: number = 10;
  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    datasets: [
      {
        data: [1200, 270],
        backgroundColor: ['rgb(147, 107, 251)', 'rgb(236, 236, 236)'],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
        borderRadius: 20,
      },
    ],
  };

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    aspectRatio: 2,
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
    cutout: '85%',
  };

  onViewReport(): void {
    console.log('View full report clicked');
  }
}
