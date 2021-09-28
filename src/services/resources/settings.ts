import request from '@/utils/request';

// @ts-ignore
/* eslint-disable */
type Params = {
  current?: number;
  pageSize?: number;
  [x: string]: any;
};

export type UserItem = {
  name?: string;
  username?: string;
  password?: string;
  id?: number;
  role?: string[];
  email?: string;
  phone?: string;
  expiredate?: string;
  company?: string;
};
export type RoleItem = {
  name: string;
  permission: string[];
};
export interface RoleData {
  name: string;
  description?: string;
  authorities: RoleItem[];
}
export interface EditRoleData extends RoleData {
  id: number;
}

export const getUsersApi = (params: Params) =>
  request('/rsc/user/', {
    method: 'GET',
    params,
  });

export const getJupyterUrl = async () => {
  return request('/@mock/rsc/jupyterUrl', { method: 'GET' });
};

// 添加用户
export const addUser = async (data: UserItem) => {
  return request.post('/rsc/user/add/', { data });
};

// 用户名校验
export const validateUsername = (value: string) => {
  return request.post(`/rsc/user/verify/`, { data: { username: value } });
};

// 编辑用户
export const editUser = (data: { id: number; [x: string]: any }) => {
  const { id, ...rest } = data;
  return request.patch(`/rsc/user/${id}/`, { data: rest });
};

// 禁用用户
export const disable2EnableUser = (id: string, operation: string) => {
  return request.post(`/rsc/user/${id}/${operation}/`);
};

// 删除用户
export const delUser = (id: number) => request.delete(`/rsc/user/${id}/`);

// 获取机构列表
export const getCompanies = () => request.get('/rsc/company/');

// 获取所有角色集合
// export const getRoles = () => request.get('/rsc/roles');

// 重置密码
export const restPass = (id: number) => request.post(`/rsc/user/${id}/passwdreset/`);

// 获取角色列表
export const getRolesApi = (params: Params) => request.get('/rsc/role/', { params });

// 角色名校验
export const validateRoleName = (value: string) => {
  return request.post(`/rsc/role/verify/`, { data: { name: value } });
};
// 获取全部角色信息
export const getAllRoles = () => request.get('/rsc/role/', { params: { nameOnly: 1 } });
// 添加role
export const addRole = (data: RoleData) => request.put('/rsc/role/', { data });
// 删除role
export const delRole = (id: number) => request.delete(`/rsc/role/${id}/`);

export const getAuthorizeList = () => request.get('/rsc/role/authorities/');

export const editRole = (data: EditRoleData) => {
  const { id, ...rest } = data;
  return request.patch(`/rsc/role/${data.id}/`, { data: rest });
};
