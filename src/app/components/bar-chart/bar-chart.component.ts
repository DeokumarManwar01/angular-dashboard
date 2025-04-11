import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { customIcons } from '../../icons/icon.model';

@Component({
  standalone: false,
  selector: 'app-bar-chart',
  styleUrls: ['./bar-chart.component.scss'],
  templateUrl: './bar-chart.component.html',
})
export class BarChartComponent implements OnInit {
  public chartType: 'bar' = 'bar';
  public customIcons = customIcons;

  constructor(private _translate: TranslateService) {}

  public chartData: ChartDataset[] = [
    {
      label: 'Firewall',
      data: [20, 30, 15, 25, 20, 30, 25, 30, 28, 35, 40, 30],
      backgroundColor: 'rgba(103, 58, 183, 0.8)',
      borderRadius: 0,
    },
    {
      label: 'Antivirus',
      data: [25, 30, 20, 25, 20, 30, 25, 30, 28, 35, 40, 30],
      backgroundColor: 'rgba(162, 121, 235, 0.8)',
      borderRadius: 0,
    },
    {
      label: 'Access Control',
      data: [15, 25, 18, 30, 22, 28, 27, 25, 26, 28, 30, 25],
      backgroundColor: 'rgba(206, 206, 206, 0.3)',
      borderRadius: {
        topLeft: 6,
        topRight: 6,
        bottomLeft: 0,
        bottomRight: 0,
      },
    },
  ];

  public chartLabels: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  ngOnInit(): void {
    this._translate
      .get(['CHART.MONTH', 'CHART.SECURITY'])
      .subscribe((translations) => {
        this.chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false },
          },
          scales: {
            x: {
              stacked: true,
              grid: { display: false },
              ticks: {
                font: {
                  weight: '600',
                },
              },
              title: {
                display: true,
                text: translations['CHART.MONTH'],
                font: { size: 14, weight: '600' },
              },
            },
            y: {
              stacked: true,
              beginAtZero: true,
              max: 100,
              ticks: {
                font: {
                  weight: '600',
                },
              },
              title: {
                display: true,
                text: translations['CHART.SECURITY'],
                font: { size: 14, weight: '600' },
              },
            },
          },
        };
      });
  }

  onSubmit() {}
}
