import { Component, OnInit } from "@angular/core";
import { Store } from "@ngxs/store";

@Component({
    standalone: false,
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
    constructor(private store: Store) { }
    ngOnInit(): void {

    }
}
