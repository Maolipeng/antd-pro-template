# antd-pro-template

This project is initialized with [Ant Design Pro](https://pro.ant.design). Follow is the quick guide for how to use.

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```

## 项目目录

```
├── config  // 配置文件
├── mock   // 本地mock文件
├── node_modules
├── public // 静态资源
├── src  // 主要开发目录
└── tests // 单元测试
```

### 配置

```
├── config.dev.ts // 只在开发环境生效的配置
├── config.ts // 配置
├── defaultSettings.ts // 默认配置文件
├── oneapi.json // api文档
├── proxy.ts // 本地代理服务器配置
├── request.rc.ts // 服务器默认配置
└── routes.ts // 路由配置
```

配置里主要说下 request.rc.ts，其他配置可以参考[Ant Design Pro](https://pro.ant.design) request.rc.ts 基于二次封装的请求（src/utils/request.ts）抛出的 api 配置，处理见下，配置会透传到 extend 函数中，同时也支持[umi-request](https://github.com/umijs/umi-request/blob/master/README_zh-CN.md)其它的 api.

```
const { devPrefix = '', prodPrefix = '', ...restConfig } = requestConfig;
const prefix = process.env.NODE_ENV === 'development' ? devPrefix : prodPrefix;

const extendConfig: Record<string, any> = {
  prefix,
  ...restConfig,
};

/** 配置request请求时的默认参数 */
const request = extend({
  errorHandler, // 默认错误处理
  ...extendConfig,
});
```

### 开发

业务开发主要在 src 文件里

```
├── assets // 静态图片
├── components // 组件
├── e2e // 测试
├── locales  // 多语言
├── pages  // 页面
├── services // 接口资源
└── utils // 工具函数
```

开发按照单一业务对请求，业务，组件进行统一划分。

利用开发 dashboard 页面，相应的路由级别的页面应该创建在 page 下面，

```
page
├── dashboard

```

然后公共组件放在/components 文件夹，只属于本模块的组件可以在/page/dashboard 下面。

```
dashboard
├── EventList
└── SystemInfo

```

请求接口应该是 services 资源，统一放在/services 下面,

```
services
|
resources
├── dashboard.ts
```

因为国际化的考虑，我们每个名称都会用 id 变量去指代，所以会在/locales 下面相应的语言包去定义，页面层级都会统一注入，

```
locales
|
zh-CN
├── dashboard.ts
```

**_本着同等业务在不同的页面，api 资源，国际化遵循同样的命名规范。(例如 dashboard 相关的都是用 dashboard 命名)_**
