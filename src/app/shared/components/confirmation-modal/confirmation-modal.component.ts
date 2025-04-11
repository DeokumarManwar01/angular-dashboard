import { Component, Input } from '@angular/core';
import { IDeleteDialogData } from '../../interfaces/dialog.interface';

@Component({
  standalone: false,
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
})
export class ConfirmationModalComponent {
  @Input() data!: IDeleteDialogData;
  @Input() close!: (result?: boolean) => void;

  confirm() {
    this.close(true);
  }

  cancel() {
    this.close(false);
  }
}
