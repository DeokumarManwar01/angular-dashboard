import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { customIcons } from './icons/icon.model';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { ToasterComponent } from './components/toaster/toaster.component';
import { ToastService } from './shared/services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit, AfterViewInit {
  isLoading = true;
  @ViewChild('toast') toast!: ToasterComponent;

  constructor(
    private toastService: ToastService) {
  }
  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

  ngAfterViewInit() {
    this.toastService.register(this.toast);
  }
}
