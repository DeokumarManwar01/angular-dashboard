import { Component, OnInit } from "@angular/core";
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastService } from "../../shared/services/toast.service";
import { customIcons } from "../../icons/icon.model";

@Component({
    standalone: false,
    selector: 'app-side-panel',
    templateUrl: './side-panel.component.html',
    styleUrl: './side-panel.component.scss',
})
export class SidePanelComponent implements OnInit {
    customIconsList = customIcons;
    activeTarget: string = 'chart';
    constructor(private toastService: ToastService) { }

    ngOnInit() {

    }

    redirectTo(event: any) {
        const target = event.currentTarget as HTMLElement;
        const destination = target.dataset['target'];
        if (destination === 'dashboard') {
            //! TODO: reset the dashboard to initial Stage
            console.log('Resetting the dashboard')
        } else if (destination !== 'chart') {
            this.toastService.show(`Operation not valid on destination: ${destination}`, 'info');
        }

    }

    isActive(target: string): boolean {
        return this.activeTarget === target;
    }

}
