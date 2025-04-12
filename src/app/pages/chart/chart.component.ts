import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { MembersState } from '../../stores/members.state';
import { IMembers, TYPE_MAP } from '../../models/members.model';
import {
  TABLE_COLUMN_TYPES,
  TABLE_OPERATION_TYPES,
  ITableColumn,
  ITableOperation,
} from '../../models/table.model';
import { DeleteMembers } from '../../stores/members.action';
import { profileImages } from '../../images/images.model';

@Component({
  standalone: false,
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  name = 'Dashboard';
  headers: ITableColumn[] = [];
  members: IMembers[] = [];
  showSearch = false;
  searchText = '';
  isSorting = false;
  isFiltering = false;
  @ViewChild('dataTable') dataTable: any;

  currentPage = 1;
  totalPages = 7;
  itemsPerPage = 10;

  constructor(private _store: Store) {}

  ngOnInit(): void {
    this._store.select(MembersState.getHeaders).subscribe((headers) => {
      this.headers = headers.map((data) => {
        return {
          ...data,
          type: TYPE_MAP[data.key] ?? TABLE_COLUMN_TYPES.STRING,
        };
      });
    });

    this._store.select(MembersState.getMembers).subscribe((members) => {
      this.members = members.map((e) => ({
        ...e,
        image: profileImages[Math.floor(Math.random() * profileImages.length)],
      }));
    });
  }

  onSubmit() {}

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    this.changePage(this.currentPage - 1);
  }

  nextPage(): void {
    this.changePage(this.currentPage + 1);
  }

  onTableOperation(event: ITableOperation) {
    if (
      event.type === TABLE_OPERATION_TYPES.DELETE_ALL ||
      event.type === TABLE_OPERATION_TYPES.DELETE
    ) {
      this._store.dispatch(new DeleteMembers(event.row));
    }
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchText = '';
    }
  }

  clearSearch(): void {
    this.searchText = '';
  }

  onSortChange(isSorting: boolean): void {
    this.isSorting = isSorting;
  }

  clearSorting(): void {
    if (this.dataTable) {
      this.dataTable.clearSort();
    }
  }

  onFilterChange(): void {
    this.isFiltering = this.dataTable?.hasActiveFilters() || false;
  }

  clearFilters(): void {
    if (this.dataTable) {
      this.dataTable.clearAllFilters();
      this.isFiltering = false;
    }
  }
}
