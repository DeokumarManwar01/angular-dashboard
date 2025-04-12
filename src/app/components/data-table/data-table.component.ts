import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  TABLE_COLUMN_TYPES,
  TABLE_OPERATION_TYPES,
  ITableColumn,
  ITableOperation,
  ITableOperationType,
  ISortDirection,
  SORT_DIRECTION,
  SORTABLE_COLUMNS,
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
import { ColumnFilterComponent } from '../../shared/components/column-filter/column-filter.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent implements OnChanges {
  @Input() columns: ITableColumn[] = [];
  @Input() data: IMembers[] = [];
  @Input() selectable: boolean = true;
  @Input() deletable: boolean = true;
  @Input() searchText: string = '';

  @Output() tableOperation = new EventEmitter<ITableOperation>();
  @Output() sortChange = new EventEmitter<boolean>();
  @Output() filterChange = new EventEmitter<void>();

  selectedRows: Set<string> = new Set();
  allSelected: boolean = false;
  TAG_COLORSList = TAG_COLORS;
  TABLE_COLUMN_TYPES = TABLE_COLUMN_TYPES;
  filteredData: IMembers[] = [];

  sortColumn: string | null = null;
  sortDirection: ISortDirection = SORT_DIRECTION.ASC;
  sortableColumns: string[] = SORTABLE_COLUMNS;

  statusFilters: string[] = [];
  roleFilters: string[] = [];

  private _tempSelectedOptions: string[] = [];

  constructor(
    private _dialog: DialogService,
    private _translate: TranslateService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['searchText']) {
      this.filterData();
    }
  }

  filterData(): void {
    let filtered = this.data;

    if (this.searchText && this.searchText.trim() !== '') {
      const searchTermLower = this.searchText.toLowerCase().trim();
      filtered = filtered.filter((row) => {
        return this.columns.some((column) => {
          const cellValue = this.getCellValue(row, column);
          if (cellValue === undefined || cellValue === null) {
            return false;
          }

          const stringValue = String(cellValue).toLowerCase();
          return stringValue.includes(searchTermLower);
        });
      });
    }

    if (this.statusFilters.length > 0) {
      filtered = filtered.filter((row) => {
        return this.statusFilters.includes(row.status);
      });
    }

    if (this.roleFilters.length > 0) {
      filtered = filtered.filter((row) => {
        return this.roleFilters.includes(row.role);
      });
    }

    this.filteredData = filtered;

    if (this.sortColumn) {
      this.sortData();
    }
    this.filterChange.emit();
  }

  sortData(): void {
    const column = this.columns.find(
      (col) =>
        this.sortColumn === col.key ||
        (this.sortColumn === TABLE_COLUMN_TYPES.NAME &&
          col.type === TABLE_COLUMN_TYPES.NAME)
    );

    if (!column) return;

    this.filteredData = [...this.filteredData].sort((a, b) => {
      const valueA = this.getSortValue(a, column);
      const valueB = this.getSortValue(b, column);

      if (valueA < valueB) {
        return this.sortDirection === SORT_DIRECTION.ASC ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === SORT_DIRECTION.ASC ? 1 : -1;
      }
      return 0;
    });
  }

  getSortValue(row: IMembers, column: ITableColumn): any {
    if (column.type === TABLE_COLUMN_TYPES.NAME) {
      return `${row.name?.firstName || ''} ${
        row.name?.lastName || ''
      }`.toLowerCase();
    } else if (column.type === TABLE_COLUMN_TYPES.STATUS) {
      return row.status?.toLowerCase() || '';
    } else {
      return String(this.getCellValue(row, column) || '').toLowerCase();
    }
  }

  toggleSort(column: ITableColumn): void {
    const columnKey =
      column.type === TABLE_COLUMN_TYPES.NAME ? 'name' : column.key;

    if (!this.sortableColumns.includes(columnKey)) {
      return;
    }

    if (this.sortColumn === columnKey) {
      this.sortDirection =
        this.sortDirection === SORT_DIRECTION.ASC
          ? SORT_DIRECTION.DESC
          : SORT_DIRECTION.ASC;
    } else {
      this.sortColumn = columnKey;
      this.sortDirection = SORT_DIRECTION.ASC;
    }

    this.sortData();
    this.sortChange.emit(this.sortColumn !== null);
  }

  getSortIcon(column: ITableColumn): string {
    const columnKey =
      column.type === TABLE_COLUMN_TYPES.NAME
        ? TABLE_COLUMN_TYPES.NAME
        : column.key;

    if (!this.sortableColumns.includes(columnKey)) {
      return '';
    }

    if (this.sortColumn === columnKey) {
      return this.sortDirection === SORT_DIRECTION.ASC
        ? 'arrow_upward'
        : 'arrow_downward';
    }

    return 'unfold_more';
  }

  isSortable(column: ITableColumn): boolean {
    const columnKey =
      column.type === TABLE_COLUMN_TYPES.NAME
        ? TABLE_COLUMN_TYPES.NAME
        : column.key;
    return this.sortableColumns.includes(columnKey);
  }

  clearSort(): void {
    if (this.sortColumn) {
      this.sortColumn = null;
      this.sortDirection = SORT_DIRECTION.ASC;
      this.filterData();
      this.sortChange.emit(false);
    }
  }

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
      this.filteredData.forEach((row) => {
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

    this.allSelected = this.selectedRows.size === this.filteredData.length;
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

  async openStatusFilter(column: ITableColumn, event: Event): Promise<void> {
    this.handleEvent(event);

    // Use a generic string type for filterType to allow any column filter type
    let filterType: string = TABLE_COLUMN_TYPES.STATUS;
    let currentFilters: string[] = [];

    if (column.type === TABLE_COLUMN_TYPES.STATUS) {
      filterType = TABLE_COLUMN_TYPES.STATUS;
      currentFilters = this.statusFilters;
    } else if (column.type === TABLE_COLUMN_TYPES.STRING) {
      filterType = 'role';
      currentFilters = this.roleFilters;
    }

    const uniqueOptions = [
      ...new Set(
        this.data.map((item) => {
          if (column.type === TABLE_COLUMN_TYPES.STATUS) {
            return item.status;
          } else if (column.type === TABLE_COLUMN_TYPES.STRING) {
            return item.role;
          }
          return this.getCellValue(item, column);
        })
      ),
    ] as string[];

    this._tempSelectedOptions = [...currentFilters];

    const dialogConfig = {
      filterType: filterType,
      filterTitle: this._translate.instant(
        `CHART.FILTER_BY_${filterType.toUpperCase()}`
      ),
      availableOptions: uniqueOptions,
      selectedOptions: this._tempSelectedOptions,
      close: (result: boolean) => {
        return result;
      },
    };

    const confirmed = await this._dialog.open(
      ColumnFilterComponent,
      dialogConfig
    );

    if (confirmed) {
      if (column.type === TABLE_COLUMN_TYPES.STATUS) {
        this.statusFilters = [...this._tempSelectedOptions];
      } else if (column.type === TABLE_COLUMN_TYPES.STRING) {
        this.roleFilters = [...this._tempSelectedOptions];
      }

      this.filterData();
      this.filterChange.emit();
    }
  }

  hasActiveFilters(): boolean {
    return this.statusFilters.length > 0 || this.roleFilters.length > 0;
  }

  clearAllFilters(): void {
    this.statusFilters = [];
    this.roleFilters = [];
    this.filterData();
    this.filterChange.emit();
  }
}
