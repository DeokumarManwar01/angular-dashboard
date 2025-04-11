import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { FetchMembersAndHeaders } from '../../stores/members.action';
@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new FetchMembersAndHeaders());
  }
}
