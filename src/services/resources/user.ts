// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

export type ChangePassData = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};
export async function login(body: { username: string; password: string }) {
  // return request('/rsc/auth/loginIn', {
  return request('/rsc/security/login', {
    method: 'POST',
    data: { ...body, provider: 'db', refresh: true },
  });
}
export function refreshTokenApi(val: string) {
  return request.post('/rsc/security/refresh', {
    headers: {
      Authorization: val,
    },
  });
}

export async function loginOut() {
  return request('/rsc/security/logout', {
    method: 'POST',
  });
}

export function getCurrentUserInfo(val: string) {
  return request('/rsc/user/userInfo/', {
    method: 'GET',
    params: {
      username: val,
    },
  });
}

export const changePassApi = (id: number, data: ChangePassData) =>
  request.post(`/rsc/user/${id}/passwd/`, { data });

export const ssoLoginApi = () => request.get('/rsc/security/sso');

export const ssoGetAuthenticationApi = (val: { code: string; state: string }) =>
  request.post('/rsc/security/sso-auth', { data: val });
