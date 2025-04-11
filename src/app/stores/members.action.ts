export class FetchMembersAndHeaders {
  static readonly type = '[Members] Fetch';
  constructor() {}
}

export class DeleteMembers {
  static readonly type = '[Members] Delete';
  constructor(public ids: Set<string>) {}
}
