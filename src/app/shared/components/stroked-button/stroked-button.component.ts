import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-stroked-button',
  styleUrl: './stroked-button.component.scss',
  templateUrl: './stroked-button.component.html',
})
export class StrokedButtonComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() color = 'primary';
  @Input() disabled = false;

  @Output() buttonClick = new EventEmitter<void>();

  onClick() {
    this.buttonClick.emit();
  }
}