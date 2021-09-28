import React, { useCallback, useRef, useState } from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { LogoutOutlined, SettingOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import { Menu, Spin, Avatar, message } from 'antd';
import { history, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import type { ChangePassData } from '@/services/resources/user';
import { loginOut as outLogin, changePassApi } from '@/services/resources/user';
import userLogo from '@/assets/user.svg';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const removeToken = () => {
  window.localStorage.removeItem('accessToken');
  window.localStorage.removeItem('refreshToken');
  window.localStorage.removeItem('username');
};
/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await outLogin();
  removeToken();
  // window.localStorage.removeItem('jupyterUrl');
  history.push('/user/login/');
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [changePassModalShow, setchangePassModalShow] = useState(false);
  const modalFormRef: any = useRef();
  const validateConfirmPass = (
    rule: any,
    value: string,
    callback: (arg0?: string | undefined) => void,
  ) => {
    const newPass = modalFormRef.current?.getFieldValue('new_password');
    if (value && newPass !== value) {
      callback('两次输入密码不一致');
    } else {
      callback();
    }
  };
  const onMenuClick: any = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        setInitialState({ ...initialState, currentUser: undefined });
        loginOut();
        return;
      }
      if (key === 'changePass' && initialState) {
        setchangePassModalShow(true);
      }
      // history.push(`/account/${key}`);
    },
    [initialState, setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.username) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}
      <Menu.Item key="username">用户名：{currentUser.username}</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="company">所属机构：{currentUser.company?.description}</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="companyAddress">机构地址：{currentUser.company?.address || '-'}</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="changePass">
        <LogoutOutlined />
        修改密码
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );

  // const menuHeaderDropdown2 = (
  //   <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
  //     {menu && (
  //       <Menu.Item key="center">
  //         <UserOutlined />
  //         个人中心
  //       </Menu.Item>
  //     )}
  //     {menu && (
  //       <Menu.Item key="settings">
  //         <SettingOutlined />
  //         个人设置
  //       </Menu.Item>
  //     )}
  //     {menu && <Menu.Divider />}
  //     <Menu.Divider />
  //     <Menu.Item key="company">所属机构：{currentUser.company?.description}</Menu.Item>
  //     <Menu.Divider />
  //     <Menu.Item key="companyAddress">机构地址：{currentUser.company?.address || '-'}</Menu.Item>
  //   </Menu>
  // );
  return (
    <div style={{ display: 'flex' }}>
      <HeaderDropdown overlay="">
        <span>
          <span className={`${styles.name} anticon`}>{currentUser.peerName}</span>
          <span style={{ marginLeft: '6px' }}>{/* <DownOutlined /> */}</span>
        </span>
      </HeaderDropdown>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar
            size="small"
            className={styles.avatar}
            src={currentUser.avatar || userLogo}
            alt="avatar"
          />
          <span className={`${styles.name} anticon`}>{currentUser.username}</span>
          <span style={{ marginLeft: '6px' }}>
            <DownOutlined />
          </span>
        </span>
      </HeaderDropdown>
      {changePassModalShow && (
        <ModalForm<ChangePassData>
          title="修改密码"
          width="600px"
          layout="horizontal"
          formRef={modalFormRef}
          {...{
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
          }}
          visible={changePassModalShow}
          onVisibleChange={(bol) => {
            // console.log('bol', bol);
            setchangePassModalShow(bol);

            if (!bol) {
              // @ts-ignore
              modalFormRef.current?.resetFields();
            }
          }}
          onFinish={async (value) => {
            try {
              const res = await changePassApi(currentUser.id, value);
              if (res.code === 200) {
                message.success('修改成功，请重新登录');
                removeToken();
                setTimeout(() => {
                  history.push('/user/login/');
                }, 1000);
              }
            } catch (error) {
              // console.error(error);
            }
          }}
        >
          <ProFormText.Password
            label="旧密码"
            name="old_password"
            rules={[{ required: true, message: '请输入新密码' }]}
          />
          <ProFormText.Password
            label="新密码"
            name="new_password"
            rules={[
              { required: true, message: '请输入新密码' },
              {
                pattern: /^[A-Za-z0-9!@#$%^&*?]{6,18}$/,
                message: '密码只支持输入数字、大小写字母、特殊字符，长度必须介于6-18位之间',
              },
            ]}
          />
          <ProFormText.Password
            label="确认密码"
            name="confirm_password"
            rules={[
              { required: true, message: '请输入新密码' },
              { validator: validateConfirmPass },
            ]}
          />
        </ModalForm>
      )}
    </div>
  );
};

export default AvatarDropdown;
