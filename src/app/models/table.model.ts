export const TABLE_COLUMN_TYPES = {
  NAME: 'name',
  STRING: 'string',
  TAGS: 'tags',
  NUMBER: 'number',
  STATUS: 'status',
  PROGRESS: 'progress',
  TEAMS: 'teams',
} as const;

type ITableColumnType =
  (typeof TABLE_COLUMN_TYPES)[keyof typeof TABLE_COLUMN_TYPES];

export interface ITableColumn {
  key: string;
  displayName: string;
  type: ITableColumnType;
}

export const TABLE_OPERATION_TYPES = {
  SELECT: 'select',
  DELETE_ALL: 'deleteAll',
  DELETE: 'delete',
} as const;

export type ITableOperationType =
  (typeof TABLE_OPERATION_TYPES)[keyof typeof TABLE_OPERATION_TYPES];

export interface ITableOperation {
  type: ITableOperationType;
  row: Set<string>;
  allSelected?: boolean;
}

export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type ISortDirection =
  (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION];

export const SORTABLE_COLUMNS = ['name', 'status', 'role'];
