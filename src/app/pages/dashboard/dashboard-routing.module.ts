import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ChartComponent } from '../chart/chart.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { 
        path: 'chart', 
        component: ChartComponent 
      },
      { 
        path: '', 
        redirectTo: 'chart', 
        pathMatch: 'full' 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
