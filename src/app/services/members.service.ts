// src/app/services/items.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { IFetchedHeadersAndMembers } from '../models/members.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  constructor(private http: HttpClient) {}

  getItems(): Observable<IFetchedHeadersAndMembers> {
    return this.http.get<IFetchedHeadersAndMembers>(environment.apiUrl).pipe(
      catchError((error) => {
        console.error('Fetch failed:', error);
        return of({ grid_columns: [], grid_data: [] });
      })
    );
  }
}
