import { Injectable } from '@angular/core';
import { ToasterComponent } from '../../components/toaster/toaster.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toastComponent!: ToasterComponent;

  register(toast: ToasterComponent) {
    this.toastComponent = toast;
  }

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastComponent?.showToast(message, type);
  }
}
