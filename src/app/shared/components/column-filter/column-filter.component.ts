import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-column-filter',
  templateUrl: './column-filter.component.html',
  styleUrls: ['./column-filter.component.scss'],
  standalone: false,
})
export class ColumnFilterComponent implements OnInit {
  availableOptions: string[] = [];
  filterTitle: string = '';
  filterType: string = 'status';
  data: any;
  @Input() close!: (result?: boolean) => void;

  constructor(private _translate: TranslateService) {}

  ngOnInit(): void {
    this.filterTitle =
      this.data.filterTitle ||
      this._translate.instant(
        `CHART.FILTER_BY_${this.filterType.toUpperCase()}`
      );

    if (this.data.filterType) {
      this.filterType = this.data.filterType;
    }

    if (this.data && this.data.availableOptions) {
      this.availableOptions = [...this.data.availableOptions];
    }
  }

  toggleOption(option: string): void {
    if (!this.data.selectedOptions) {
      this.data.selectedOptions = [];
    }

    const index = this.data.selectedOptions.indexOf(option);
    if (index > -1) {
      this.data.selectedOptions.splice(index, 1);
    } else {
      this.data.selectedOptions.push(option);
    }
  }

  isSelected(option: string): boolean {
    return (
      this.data.selectedOptions && this.data.selectedOptions.includes(option)
    );
  }

  applyFilter(): void {
    this.data.close(true);
    this.close(true);
  }

  cancel(): void {
    this.data.close(false);
    this.close(false);
  }

  selectAll(): void {
    if (!this.data.selectedOptions) {
      this.data.selectedOptions = [];
    }

    this.data.selectedOptions.length = 0;
    this.availableOptions.forEach((option) => {
      this.data.selectedOptions.push(option);
    });
  }

  clearAll(): void {
    if (!this.data.selectedOptions) {
      this.data.selectedOptions = [];
    }

    this.data.selectedOptions.length = 0;
  }
}
