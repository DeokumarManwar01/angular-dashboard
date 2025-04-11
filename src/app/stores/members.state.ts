import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { DeleteMembers, FetchMembersAndHeaders } from './members.action';
import {
  IFetchedHeadersAndMembers,
  MembersStateModel,
} from '../models/members.model';
import { MembersService } from '../services/members.service';
import { of } from 'rxjs';

@State<MembersStateModel>({
  name: 'members',
  defaults: {
    loading: false,
    headers: [],
    members: [],
  },
})
@Injectable()
export class MembersState {
  constructor(private membersService: MembersService) {}

  @Selector()
  static getLoadingState(state: MembersStateModel) {
    return state.loading;
  }

  @Selector()
  static getHeaders(state: MembersStateModel) {
    return state.headers;
  }

  @Selector()
  static getMembers(state: MembersStateModel) {
    return state.members;
  }

  @Action(FetchMembersAndHeaders)
  fetchItems(ctx: StateContext<MembersStateModel>) {
    ctx.patchState({ loading: true });

    return this.membersService.getItems().pipe(
      tap((data: IFetchedHeadersAndMembers) => {
        const headersData = data.grid_columns.map((header) => ({
          key: header.column_key,
          displayName: header.column_name,
          type: header.type,
        }));

        const membersData = data.grid_data.map((member) => ({
          id: member.id,
          name: {
            firstName: member.name.first_name,
            lastName: member.name.last_name,
            handle: member.name.handle,
          },
          status: member.status,
          email: member.email,
          role: member.role,
          licensesUsed: member.license_used,
          teams: member.teams.map((team) => ({
            textColor: team.text_color,
            backgroundColor: team.background_color,
            value: team.value,
          })),
        }));

        ctx.patchState({
          loading: false,
          headers: headersData,
          members: membersData,
        });
      }),
      catchError((error) => {
        console.error('Error fetching members and headers:', error);

        ctx.patchState({ loading: false });

        return of();
      })
    );
  }

  @Action(DeleteMembers)
  deleteMembers(
    ctx: StateContext<MembersStateModel>,
    data: { ids: Set<string> }
  ) {
    ctx.patchState({
      members: ctx
        .getState()
        .members.filter((header) => !data.ids.has(header.id)),
    });
  }
}
