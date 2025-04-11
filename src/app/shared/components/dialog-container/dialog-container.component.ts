import {
  Component,
  ComponentRef,
  Input,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-dialog-container',
  template: `
    <div class="modal-backdrop" (click)="close()"></div>
    <div class="dialog-content">
      <ng-template #container></ng-template>
    </div>
  `,
  styleUrls: ['./dialog-container.component.scss'],
})
export class DialogContainerComponent implements OnInit {
  @Input() childComponentType!: Type<any>;
  @Input() data: any;
  @Input() close!: () => void;

  @ViewChild('container', { read: ViewContainerRef, static: true })
  containerRef!: ViewContainerRef;

  ngOnInit(): void {
    const componentRef: ComponentRef<any> = this.containerRef.createComponent(
      this.childComponentType
    );
    if (this.data) {
      componentRef.instance.data = this.data;
    }
    if (this.close) {
      componentRef.instance.close = this.close;
    }
  }
}
