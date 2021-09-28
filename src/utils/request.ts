import { extend } from 'umi-request';
import { message } from 'antd';
import requestConfig from '../../config/request.rc';
import { refreshTokenApi } from '@/services/resources/user';
// import { WindowsOutlined } from '@ant-design/icons';

// const codeMessage: Record<number, string> = {
//   200: '服务器成功返回请求的数据。',
//   201: '新建或修改数据成功。',
//   202: '一个请求已经进入后台排队（异步任务）。',
//   204: '删除数据成功。',
//   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器。',
//   502: '网关错误。',
//   503: '服务不可用，服务器暂时过载或维护。',
//   504: '网关超时。',
// };

// /** 异常处理程序 */

// const errorHandler = (error: { response: Response }): Response => {
//   const { response } = error;
//   if (response && response.status) {
//     const errorText = codeMessage[response.status] || response.statusText;
//     const { status, url } = response;

//     // eslint-disable-next-line no-console
//     console.error({
//       message: `请求错误 ${status}: ${url}`,
//       description: errorText,
//     });
//   } else if (!response) {
//     // eslint-disable-next-line no-console
//     console.error({
//       description: '接口网络发生异常，请重试',
//       message: '网络异常',
//     });
//   }
//   return response;
// };
const { devPrefix = '', prodPrefix = '', ...restConfig } = requestConfig;
const prefix = process.env.NODE_ENV === 'development' ? devPrefix : prodPrefix;

const extendConfig: Record<string, any> = {
  ...restConfig,
};

/** 配置request请求时的默认参数 */
const request = extend({
  // errorHandler, // 默认错误处理
  ...extendConfig,
});
const setToken = (val: string) => {
  window.localStorage.setItem('accessToken', val);
};
const resetToken = () => {
  window.localStorage.removeItem('accessToken');
  window.localStorage.removeItem('refreshToken');
};
// 拦截请求，对@前缀请求不增加前缀，支持代理多种服务器
request.interceptors.request.use((url, options) => {
  let tranUrl = url;
  const reg = /^\/@(\w+)\//;
  let headers = { ...options.headers };
  tranUrl = tranUrl.match(reg) ? tranUrl.replace(reg, '/$1/') : `${prefix}${tranUrl}`;
  if (url.indexOf('/rsc/security/login') === -1 && url.indexOf('/rsc/security/refresh') === -1) {
    const accessToken = window.localStorage.getItem('accessToken');
    // @ts-ignore eslint-disable-next-line
    headers = { ...headers, Authorization: `Bearer ${accessToken}` };

    // headers.Authorization = `Bearer ${accessToken}`;
  }
  return {
    url: tranUrl,
    options: { ...options, headers },
  };
});
let isShowRetryLogin = false;
let isRefreshing = false; // 是否正在刷新
const subscribers: any[] = []; // 重试队列，每一项将是一个待执行的函数形式

const addSubscriber = (listener: any) => subscribers.push(listener);
// 执行被缓存等待的接口事件
const notifySubscriber = (newToken = '') => {
  subscribers.forEach((callback) => callback(newToken));
  subscribers.length = 0;
};
// 刷新 token 请求
const refreshTokenRequst = async () => {
  const refreshToken = window.localStorage.getItem('refreshToken');
  try {
    const res = await refreshTokenApi(`Bearer ${refreshToken}`);
    const accessToken = res?.data?.access_token;
    setToken(accessToken);
    notifySubscriber(accessToken);
  } catch (e) {
    console.error('请求刷新 token 失败');
  }
  isRefreshing = false;
};
// 判断如何响应
function checkStatus(response: Record<string, any>, options: any) {
  const { url } = response;
  let currentUrl: string = url;

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line prefer-destructuring
    currentUrl = `/rsc${url.split('/rsc')[1]}`.split('?')[0];
    console.log('开发环境');
  }

  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenRequst();
  }

  // 正在刷新 token，返回一个未执行 resolve 的 promise
  return new Promise((resolve) => {
    // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
    addSubscriber((newToken: string) => {
      const newOptions = {
        ...options,
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      };
      resolve(request(currentUrl, newOptions));
    });
  });
}
// @ts-ignore
request.interceptors.response.use(async (response, options) => {
  const data = await response.clone().json();
  const { code } = data;
  if (code !== 200) {
    if (code === 4101) {
      return checkStatus(response, options);
    }
    if (code === 4102) {
      if (!isShowRetryLogin) {
        message.warn('登录已过期，请重新登录');
        resetToken();
        isShowRetryLogin = true;
        setTimeout(() => {
          window.location.href = '/user/login/';
        }, 0);
        return null;
      }
      return null;
    }
    return message.warn(data.msg);
  }
  return response;
});

export default request;
