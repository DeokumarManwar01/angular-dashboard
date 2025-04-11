import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable,
  Injector,
  Type,
  EmbeddedViewRef,
} from '@angular/core';
import { DialogContainerComponent } from '../components/dialog-container/dialog-container.component';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(
    private injector: Injector,
    private appRef: ApplicationRef,
    private cfr: ComponentFactoryResolver
  ) {}

  open<T>(component: Type<T>, data?: any): Promise<boolean> {
    const factory = this.cfr.resolveComponentFactory(DialogContainerComponent);
    const containerRef = factory.create(this.injector);

    this.appRef.attachView(containerRef.hostView);
    const domElem = (containerRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    containerRef.instance.childComponentType = component;
    containerRef.instance.data = data;

    return new Promise((resolve) => {
      containerRef.instance.data = data;
      containerRef.instance.close = (result?: any) => {
        resolve(result);
        containerRef.destroy();
      };
    });
  }
}
