export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/',
        routes: [
          {
            name: 'login',
            path: '/user/login/',
            component: './user/Login',
          },
        ],
      },
    ],
  },
  {
    path: '/',
    // redirect: '/dashboard/event-list',
    redirect: '/setting/user-manage/',
  },
  {
    value: 'setting',
    name: '管理控制台',
    path: '/setting/',
    access: 'adminRouteFilter',
    routes: [
      {
        path: '/setting/',
        redirect: '/setting/user-manage/',
      },
      {
        value: 'userManage',
        name: '用户管理',
        path: '/setting/user-manage/',
        component: './setting/UserManage',
        access: 'adminRouteFilter',
      },
      {
        value: 'authoritiesRole',
        name: '权限角色管理',
        path: '/setting/Authorities-manage/',
        component: './setting/AuthoritiesRole',
        access: 'adminRouteFilter',
      },
    ],
  },
  {
    component: './404',
  },
];
