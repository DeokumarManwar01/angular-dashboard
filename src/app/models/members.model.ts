import { ITableColumn } from './table.model';

export interface IFetchedHeaders {
  align: string;
  column_key: string;
  column_name: string;
  type: string;
}

export interface IFetchedMembers {
  id: string;
  name: { first_name: string; last_name: string; handle: string };
  status: string;
  email: string;
  role: string;
  license_used: string;
  teams: { text_color: string; background_color: string; value: string }[];
}

export interface IFetchedHeadersAndMembers {
  grid_columns: IFetchedHeaders[];
  grid_data: IFetchedMembers[];
}

export interface IMemberName {
  firstName: string;
  lastName: string;
  handle: string;
}

export interface ITeamsTag {
  textColor: string;
  backgroundColor: string;
  value: string;
}

export interface IMembers {
  id: string;
  name: IMemberName;
  status: string;
  email: string;
  image?: string;
  role: string;
  licensesUsed: string;
  teams: ITeamsTag[];
}

export interface IHeaders {
  key: string;
  displayName: string;
  type: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

export interface MembersStateModel {
  loading: boolean;
  headers: IHeaders[];
  members: IMembers[];
}

export const TYPE_MAP: Record<string, ITableColumn['type']> = {
  name: 'name',
  status: 'status',
  role: 'string',
  license_used: 'progress',
  teams: 'tags',
};

export const TAG_COLORS = [
  {
    value: 'Design',
    background_color: '#F8F5FE',
    text_color: '#886FCE',
  },
  {
    value: 'Testing',
    background_color: '#FBF2E1',
    text_color: '#FFB21A',
  },
  {
    value: 'Product',
    background_color: '#F1F8FE',
    text_color: '#2C5BCC',
  },
  {
    value: 'Marketing',
    background_color: '#EFF4FE',
    text_color: '#494DCB',
  },
];

export const COLOR_MAP: Record<string, string> = {
  design: 'tag-design',
  testing: 'tag-testing',
  product: 'tag-product',
  marketing: 'tag-marketing',
};
