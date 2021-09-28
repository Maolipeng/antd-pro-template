/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
import type { CurrentUser } from './interface';

export default function access(initialState: { currentUser?: CurrentUser }) {
  const { currentUser } = initialState || {};
  // const authorities = currentUser?.authorities;
  // const allPermissions =
  //   authorities?.menu && authorities?.checkedPermissions
  //     ? [...authorities.menu, ...authorities.checkedPermissions]
  //     : [];
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    // adminRouteFilter: () => currentUser?.role?.map((r) => r.name).includes('Admin'),
    adminRouteFilter: () => true,
    // @ts-ignore
    // normalRouteFilter: (route: { name: string; [x: string]: any }) => {
    //   if (route.routes) {
    //     return route.routes.map((item) => item.value).some((v) => allPermissions.includes(v));
    //   }
    //   return allPermissions.includes(route.value);
    // },
    normalRouteFilter: () => true,
  };
}
