import { NgModule } from '@angular/core';
import { StrokedButtonComponent } from './components/stroked-button/stroked-button.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { DialogContainerComponent } from './components/dialog-container/dialog-container.component';
import { InfoModalComponent } from './components/info-modal/info-modal.component';
import { ColumnFilterComponent } from './components/column-filter/column-filter.component';

@NgModule({
  declarations: [
    StrokedButtonComponent,
    ConfirmationModalComponent,
    DialogContainerComponent,
    InfoModalComponent,
    ColumnFilterComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [StrokedButtonComponent],
})
export class SharedModule {}
