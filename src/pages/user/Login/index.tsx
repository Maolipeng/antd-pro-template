import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
// import { useIntl, Link, history, FormattedMessage, SelectLang, useModel } from 'umi';
import { useIntl, Link, history, FormattedMessage, useModel, useLocation } from 'umi';
import { login, ssoLoginApi, ssoGetAuthenticationApi } from '@/services/resources/user';
// import { getJupyterUrl } from '@/services/resources/settings';

import styles from './index.less';

interface LoginParams {
  username: string;
  password: string;
}

interface LoginResult {
  status?: string;
  type?: string;
  currentAuthority?: string;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

/** 此方法会跳转到 redirect 参数所在的位置 */
const goto = () => {
  if (!history) return;
  setTimeout(() => {
    const { query } = history.location;
    const { redirect } = query as { redirect: string };
    history.push(redirect || '/');
  }, 10);
};

const loginToken = (data: { access_token: string; refresh_token: string; username: string }) => {
  window.localStorage.setItem('accessToken', data.access_token);
  window.localStorage.setItem('refreshToken', data.refresh_token);
  window.localStorage.setItem('username', data.username);
};

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState<LoginResult>({});
  const [type] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { query: queryDetail } = useLocation();
  const intl = useIntl();

  const fetchUserInfo = async (val: string) => {
    const userInfo = await initialState?.fetchUserInfo?.(val);
    // const { data } = await getJupyterUrl();
    // window.localStorage.setItem('jupyterUrl', data.url);
    if (userInfo) {
      setInitialState({
        ...initialState,
        currentUser: userInfo,
        // jupyterUrl: data.url,
      });
    }
  };

  useEffect(() => {
    if (queryDetail.code && queryDetail.state) {
      const { code, state } = queryDetail;
      (async () => {
        const res = await ssoGetAuthenticationApi({ code, state });
        if (res.code === 200) {
          loginToken(res.data);
          message.success('登录成功！');
          await fetchUserInfo(res.data.username);
          goto();
        }
      })();
    }
  }, []);
  const ssoLogin = async () => {
    const { code, data } = await ssoLoginApi();
    if (code === 200) {
      window.open(data.url, '_self');
    }
  };

  const handleSubmit = async (values: LoginParams) => {
    setSubmitting(true);
    try {
      // 登录
      const res = await login({ ...values });
      if (res.code === 200) {
        const { data } = res;
        loginToken(data);
        message.success('登录成功！');
        console.log('username', data.username);

        await fetchUserInfo(data.username);
        goto();
        return;
      }

      // 如果失败去设置用户错误信息
      setUserLoginState(res);
    } catch (error) {
      message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };
  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      {/* <div className={styles.lang}>{SelectLang && <SelectLang />}</div> */}
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <span className={styles.title}>RealSecure</span>
            </Link>
          </div>
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: intl.formatMessage({
                  id: 'user.login.submit',
                  defaultMessage: '登录',
                }),
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values as LoginParams);
            }}
          >
            {status === 'error' && loginType === 'account' && (
              <LoginMessage
                content={intl.formatMessage({
                  id: 'user.login.accountLogin.errorMessage',
                  defaultMessage: '账户或密码错误',
                })}
              />
            )}
            {type === 'account' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'user.login.username.placeholder',
                    defaultMessage: '账号',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="user.login.username.required"
                          defaultMessage="请填写账号"
                        />
                      ),
                    },
                    // {
                    //   pattern: /^[a-zA-Z0-9]{1,16}$/,
                    //   message: (
                    //     <FormattedMessage
                    //       id="user.login.username.validate"
                    //       defaultMessage="账号格式错误，账号为1-16位英文字符串,区分大小写"
                    //     />
                    //   ),
                    // },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'user.login.password.placeholder',
                    defaultMessage: '密码',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="user.login.password.required"
                          defaultMessage="请填写密码"
                        />
                      ),
                    },
                    {
                      pattern: /^[A-Za-z0-9!@#$%^&*?]{6,18}$/,
                      message: '密码只支持输入数字、大小写字母、特殊字符，长度必须介于6-18位之间',
                    },
                  ]}
                />
              </>
            )}
          </ProForm>
          <Space className={styles.other}>
            <div className={styles.thirdLogin} onClick={ssoLogin}>
              统一认证登录
            </div>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default Login;
