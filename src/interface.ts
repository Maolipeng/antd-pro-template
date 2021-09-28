export interface PageParams {
  current?: number;
  pageSize?: number;
  [x: string]: any;
}

export interface CurrentUser {
  username: string;
  authorities: { menu: string[]; checkedPermissions: string[] };
  role: { description: string; name: string }[];
  company: { name: string; address: string };
  avatar?: string;
  userId?: string;
  title?: string;
  group?: string;
  tags?: { key?: string; label?: string }[];
  notifyCount?: number;
  unreadCount?: number;
  country?: string;
  access?: string;
  geographic?: {
    province?: { label?: string; key?: string };
    city?: { label?: string; key?: string };
  };
  address?: string;
  id: number;
  phone?: string;
}
