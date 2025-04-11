import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  TABLE_COLUMN_TYPES,
  TABLE_OPERATION_TYPES,
  ITableColumn,
  ITableOperation,
  ITableOperationType,
} from '../../models/table.model';
import {
  COLOR_MAP,
  IMembers,
  ITeamsTag,
  TAG_COLORS,
} from '../../models/members.model';
import { DialogService } from '../../shared/services/dialog.service';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
import { InfoModalComponent } from '../../shared/components/info-modal/info-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent {
  @Input() columns: ITableColumn[] = [];
  @Input() data: IMembers[] = [];
  @Input() selectable: boolean = true;
  @Input() deletable: boolean = true;

  @Output() tableOperation = new EventEmitter<ITableOperation>();

  selectedRows: Set<string> = new Set();
  allSelected: boolean = false;
  TAG_COLORSList = TAG_COLORS;
  TABLE_COLUMN_TYPES = TABLE_COLUMN_TYPES;

  constructor(
    private _dialog: DialogService,
    private _translate: TranslateService
  ) {}

  private handleEvent(event: Event | null): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  trackByColumnKey(index: number, column: ITableColumn): string {
    return column.key;
  }

  trackByRowId(index: number, row: IMembers): string {
    return row.id;
  }

  trackByTagValue(index: number, tag: ITeamsTag): string {
    return tag.value;
  }

  getProgressWidthClass(percent: string): string {
    return `width-${percent}`;
  }

  toggleSelectAll(): void {
    if (this.allSelected) {
      this.selectedRows.clear();
    } else {
      this.data.forEach((row) => {
        this.selectedRows.add(row.id);
      });
    }
    this.allSelected = !this.allSelected;
    this.emitOperation(
      TABLE_OPERATION_TYPES.SELECT,
      new Set(this.selectedRows),
      this.allSelected
    );
  }

  toggleRowSelection(row: IMembers, event: Event): void {
    this.handleEvent(event);

    if (this.selectedRows.has(row.id)) {
      this.selectedRows.delete(row.id);
    } else {
      this.selectedRows.add(row.id);
    }

    this.allSelected = this.selectedRows.size === this.data.length;
    this.emitOperation(
      TABLE_OPERATION_TYPES.SELECT,
      new Set([row.id]),
      this.allSelected
    );
  }

  isSelected(row: IMembers): boolean {
    return this.selectedRows.has(row.id);
  }

  showRowInfo(row: IMembers, event: Event): void {
    this.handleEvent(event);
    this._dialog.open(InfoModalComponent, {
      ...row,
    });
  }

  async deleteRow(row: IMembers, event: Event): Promise<void> {
    this.handleEvent(event);
    const result = await this._dialog.open(ConfirmationModalComponent, {
      title:
        this._translate.instant('CHART.DELETE_ROW') +
        row.name?.firstName +
        ' ' +
        row.name?.lastName,
      message:
        this._translate.instant('CHART.DELETE_ROW_CONFIRMATION') +
        row.name?.firstName +
        ' ' +
        row.name?.lastName,
    });

    if (result) {
      this.confirmDelete(row);
      this.allSelected = false;
      this.selectedRows.clear();
    }
  }

  confirmDelete(row: IMembers): void {
    if (row) {
      this.emitOperation(TABLE_OPERATION_TYPES.DELETE, new Set([row.id]));
    }
  }

  async deleteAllSelectedRows(): Promise<void> {
    const result = await this._dialog.open(ConfirmationModalComponent, {
      title: this._translate.instant('CHART.DELETE_SELECTED_ROWS'),
      message: this._translate.instant(
        'CHART.DELETE_SELECTED_ROWS_CONFIRMATION'
      ),
    });

    if (result) {
      this.emitOperation(
        TABLE_OPERATION_TYPES.DELETE_ALL,
        this.selectedRows,
        this.allSelected
      );
      this.allSelected = false;
      this.selectedRows.clear();
    }
  }

  emitOperation(
    type: ITableOperationType,
    row: Set<string>,
    allSelected?: boolean
  ): void {
    this.tableOperation.emit({ type, row, allSelected });
  }

  getCellValue(row: IMembers, column: ITableColumn) {
    const props = column.key.split('.');
    if (props[0] === TABLE_COLUMN_TYPES.NAME) {
      return `${row.name.firstName} ${row.name.lastName}`;
    }
    return props.reduce((obj, prop) => (obj as any)?.[prop], row);
  }

  getTagColorClass(tag: ITeamsTag): string {
    return COLOR_MAP[tag.value.toLowerCase()] || '';
  }

  getProgressPercentage(value: number, max: number): number {
    return (value / max) * 100;
  }

  getSelectedRowsCount(): number {
    return this.selectedRows.size;
  }

  parseInt(value: string): number {
    return parseInt(value, 10);
  }
}
