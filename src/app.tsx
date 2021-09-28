import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { getCurrentUserInfo as queryCurrentUser } from './services/resources/user';
import React from 'react';
import type { CurrentUser } from './interface';

const loginPath = '/user/login/';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: CurrentUser;
  fetchUserInfo?: (val: string) => Promise<CurrentUser | undefined>;
  jupyterUrl?: string;
}> {
  const username: string = window.localStorage.getItem('username') as string;
  const fetchUserInfo = async (val: string) => {
    try {
      const { data: currentUser } = await queryCurrentUser(val);
      return currentUser;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo(username);
    // currentUser.authorities = mockAuthorities;
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

// https://umijs.org/zh-CN/plugins/plugin-layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.username,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

// export function patchRoutes({ routes }) {
//   routes[0]['routes'].forEach((route: any) => {
//     if (route.value && route.routes?.length) {
//       console.log('rerer', route);

//       const { path } = route.routes[0];
//       route.routes.unshift({
//         path: route.path,
//         redirect: path,
//       });
//     }
//   });
//   console.log('routes', routes);
// }
// export function render(oldRender: () => void) {
//   oldRender();
// }
