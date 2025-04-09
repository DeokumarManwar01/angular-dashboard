import { Component, Input } from "@angular/core";


@Component({
    standalone: false,
    selector: 'app-toaster',
    templateUrl: './toaster.component.html',
    styleUrl: './toaster.component.scss',
})
export class ToasterComponent {
    @Input() message: string = '';
    @Input() type: 'success' | 'error' | 'info' = 'info';

    visible = false;

    showToast(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) {
        this.message = message;
        this.type = type;
        this.visible = true;

        setTimeout(() => {
            this.visible = false;
        }, duration);
    }
}