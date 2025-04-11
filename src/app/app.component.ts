import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToasterComponent } from './components/toaster/toaster.component';
import { ToastService } from './shared/services/toast.service';
import { Store } from '@ngxs/store';
import { MembersState } from './stores/members.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements AfterViewInit {
  @ViewChild('toast') toast!: ToasterComponent;
  isLoading = false;

  constructor(
    private _toastService: ToastService,
    private _translate: TranslateService,
    private _store: Store,
    private _cdr: ChangeDetectorRef
  ) {
    _translate.setDefaultLang('en');
    _translate.use('en');
  }

  ngAfterViewInit() {
    this._toastService.register(this.toast);

    this._store.select(MembersState.getLoadingState).subscribe((loading) => {
      this.isLoading = loading;
      this._cdr.detectChanges();
    });
  }
}
