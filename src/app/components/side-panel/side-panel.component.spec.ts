import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidePanelComponent } from './side-panel.component';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';

describe('SidePanelComponent', () => {
  let component: SidePanelComponent;
  let fixture: ComponentFixture<SidePanelComponent>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockStore: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    mockToastService = jasmine.createSpyObj('ToastService', ['show']);
    mockStore = jasmine.createSpyObj('Store', ['dispatch']);

    await TestBed.configureTestingModule({
      declarations: [SidePanelComponent],
      providers: [
        { provide: ToastService, useValue: mockToastService },
        { provide: Store, useValue: mockStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('redirectTo', () => {
    it('should handle dashboard navigation', () => {
      const mockEvent = {
        currentTarget: {
          dataset: {
            target: 'dashboard',
          },
        },
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation'),
      } as unknown as Event;

      component.redirectTo(mockEvent);

      expect(mockToastService.show).toHaveBeenCalledWith({
        title: 'Coming Soon',
        content: 'Dashboard is under construction',
        type: 'info',
      });
    });

    it('should handle chart navigation', () => {
      const mockEvent = {
        currentTarget: {
          dataset: {
            target: 'chart',
          },
        },
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation'),
      } as unknown as Event;

      component.redirectTo(mockEvent);

      expect(component.activeTarget).toBe('chart');
    });

    it('should handle unknown targets gracefully', () => {
      const mockEvent = {
        currentTarget: {
          dataset: {
            target: 'unknown',
          },
        },
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation'),
      } as unknown as Event;

      component.redirectTo(mockEvent);

      expect(component).toBeTruthy();
    });
  });
});
