import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Components
import { DashboardComponent } from './dashboard.component';
import { ChartComponent } from '../chart/chart.component';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { SidePanelComponent } from '../../components/side-panel/side-panel.component';
import { BarChartComponent } from '../../components/bar-chart/bar-chart.component';
import { GaugeChartComponent } from '../../components/gauge-chart/gauge-chart.component';

// Material and other modules
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgChartsModule } from 'ng2-charts';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HttpLoaderFactory } from '../../app.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    DashboardComponent,
    ChartComponent,
    DataTableComponent,
    SidePanelComponent,
    BarChartComponent,
    GaugeChartComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DashboardRoutingModule,
    MatIconModule,
    MatTooltipModule,
    NgChartsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    SharedModule,
  ],
})
export class DashboardModule {}
