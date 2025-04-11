import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent } from './data-table.component';
import { DialogService } from '../../shared/services/dialog.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {
  ITableColumn,
  TABLE_COLUMN_TYPES,
  TABLE_OPERATION_TYPES,
} from '../../models/table.model';
import { IMembers, ITeamsTag } from '../../models/members.model';
import { Component, Input } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-stroked-button',
  template: '<button>{{ label }}</button>',
})
class MockStrokedButtonComponent {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() color: string = '';
}

class MockInfoModalComponent {}

class MockConfirmationModalComponent {}

class MockDialogService {
  open(component: any, data: any) {
    return Promise.resolve(true);
  }
}

class MockTranslateService {
  instant(key: string): string {
    return key;
  }
}

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;
  let dialogService: MockDialogService;
  let translateService: MockTranslateService;

  const mockColumns: ITableColumn[] = [
    { key: 'name', displayName: 'Name', type: TABLE_COLUMN_TYPES.NAME },
    { key: 'email', displayName: 'Email', type: TABLE_COLUMN_TYPES.STRING },
    { key: 'status', displayName: 'Status', type: TABLE_COLUMN_TYPES.STATUS },
    { key: 'teams', displayName: 'Teams', type: TABLE_COLUMN_TYPES.TAGS },
    {
      key: 'licensesUsed',
      displayName: 'Licenses',
      type: TABLE_COLUMN_TYPES.PROGRESS,
    },
  ];

  const mockTeamsTags: ITeamsTag[] = [
    { textColor: '#886FCE', backgroundColor: '#F8F5FE', value: 'Design' },
    { textColor: '#FFB21A', backgroundColor: '#FBF2E1', value: 'Testing' },
  ];

  const mockMembers: IMembers[] = [
    {
      id: '1',
      name: { firstName: 'John', lastName: 'Doe', handle: '@johndoe' },
      status: 'Active',
      email: 'john@example.com',
      image: '/assets/images/avatar1.png',
      role: 'Developer',
      licensesUsed: '75',
      teams: [mockTeamsTags[0]],
    },
    {
      id: '2',
      name: { firstName: 'Jane', lastName: 'Smith', handle: '@janesmith' },
      status: 'Inactive',
      email: 'jane@example.com',
      image: '/assets/images/avatar2.png',
      role: 'Designer',
      licensesUsed: '45',
      teams: [mockTeamsTags[1]],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataTableComponent, MockStrokedButtonComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: DialogService, useClass: MockDialogService },
        { provide: TranslateService, useClass: MockTranslateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    dialogService = TestBed.inject(
      DialogService
    ) as unknown as MockDialogService;
    translateService = TestBed.inject(
      TranslateService
    ) as unknown as MockTranslateService;

    component.columns = mockColumns;
    component.data = mockMembers;
    component.selectable = true;
    component.deletable = true;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('TrackBy Functions', () => {
    it('should track columns by key', () => {
      const result = component.trackByColumnKey(0, mockColumns[0]);
      expect(result).toBe('name');
    });

    it('should track rows by id', () => {
      const result = component.trackByRowId(0, mockMembers[0]);
      expect(result).toBe('1');
    });

    it('should track tags by value', () => {
      const result = component.trackByTagValue(0, mockTeamsTags[0]);
      expect(result).toBe('Design');
    });
  });

  describe('Event Handling', () => {
    it('should handle events correctly', () => {
      const mockEvent = new Event('click');
      spyOn(mockEvent, 'preventDefault');
      spyOn(mockEvent, 'stopPropagation');

      (component as any).handleEvent(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should handle null events gracefully', () => {
      expect(() => (component as any).handleEvent(null)).not.toThrow();
    });
  });

  describe('Row Selection', () => {
    it('should toggle row selection correctly', () => {
      const mockEvent = new Event('change');
      const mockRow = mockMembers[0];
      spyOn(component.tableOperation, 'emit');

      component.toggleRowSelection(mockRow, mockEvent);
      expect(component.isSelected(mockRow)).toBe(true);
      expect(component.tableOperation.emit).toHaveBeenCalledWith({
        type: TABLE_OPERATION_TYPES.SELECT,
        row: new Set([mockRow.id]),
        allSelected: false,
      });

      component.toggleRowSelection(mockRow, mockEvent);
      expect(component.isSelected(mockRow)).toBe(false);
    });

    it('should toggle select all correctly', () => {
      spyOn(component.tableOperation, 'emit');

      component.toggleSelectAll();
      expect(component.allSelected).toBe(true);
      expect(component.selectedRows.size).toBe(mockMembers.length);

      component.toggleSelectAll();
      expect(component.allSelected).toBe(false);
      expect(component.selectedRows.size).toBe(0);
    });
  });

  describe('Cell Value Handling', () => {
    it('should get cell value for regular column correctly', () => {
      const result = component.getCellValue(mockMembers[0], mockColumns[1]);
      expect(result).toBe('john@example.com');
    });

    it('should handle name column specially', () => {
      const result = component.getCellValue(mockMembers[0], mockColumns[0]);
      expect(result).toBe('John Doe');
    });

    it('should get tag color class correctly', () => {
      const result = component.getTagColorClass(mockTeamsTags[0]);
      expect(result).toContain('tag-design');
    });

    it('should calculate progress width class correctly', () => {
      const result = component.getProgressWidthClass('75');
      expect(result).toBe('width-75');
    });
  });

  describe('Row Operations', () => {
    it('should delete a row after confirmation', async () => {
      const mockEvent = new Event('click');
      spyOn(component.tableOperation, 'emit');

      await component.deleteRow(mockMembers[0], mockEvent);

      expect(component.tableOperation.emit).toHaveBeenCalledWith({
        type: TABLE_OPERATION_TYPES.DELETE,
        row: new Set([mockMembers[0].id]),
      });
    });

    it('should delete multiple selected rows after confirmation', async () => {
      component.selectedRows.add(mockMembers[0].id);
      component.selectedRows.add(mockMembers[1].id);

      spyOn(component.tableOperation, 'emit');

      await component.deleteAllSelectedRows();

      expect(component.tableOperation.emit).toHaveBeenCalledWith({
        type: TABLE_OPERATION_TYPES.DELETE_ALL,
        row: component.selectedRows,
        allSelected: false,
      });
      expect(component.selectedRows.size).toBe(0);
    });

    it('should show row info when requested', () => {
      const mockEvent = new Event('click');
      spyOn(dialogService, 'open');

      component.showRowInfo(mockMembers[0], mockEvent);

      expect(dialogService.open).toHaveBeenCalled();
    });
  });

  describe('Helper Methods', () => {
    it('should get selected rows count correctly', () => {
      component.selectedRows.clear();
      expect(component.getSelectedRowsCount()).toBe(0);

      component.selectedRows.add('1');
      expect(component.getSelectedRowsCount()).toBe(1);

      component.selectedRows.add('2');
      expect(component.getSelectedRowsCount()).toBe(2);
    });
  });
});
