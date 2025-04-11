import { Component } from '@angular/core';
import { ToastService } from '../../shared/services/toast.service';
import { customIcons } from '../../icons/icon.model';
import { Store } from '@ngxs/store';
import { FetchMembersAndHeaders } from '../../stores/members.action';

@Component({
  standalone: false,
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.scss',
})
export class SidePanelComponent {
  customIconsList = customIcons;
  activeTarget: string = 'chart';
  constructor(private _toastService: ToastService, private _store: Store) {}

  redirectTo(event: Event) {
    const target = event.currentTarget as HTMLElement;
    const destination = target.dataset['target'];
    if (destination === 'dashboard') {
      this._store.dispatch(new FetchMembersAndHeaders());
    } else if (destination !== 'chart') {
      this._toastService.show(`Operation not valid: ${destination}`, 'info');
    }
  }

  isActive(target: string): boolean {
    return this.activeTarget === target;
  }
}
