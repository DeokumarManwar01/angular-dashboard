import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrl: './info-modal.component.scss',
})
export class InfoModalComponent {
  @Input() data!: {
    name?: { firstName: string; lastName: string; handle?: string };
  };
  @Input() close!: () => void;

  constructor() {}
}
