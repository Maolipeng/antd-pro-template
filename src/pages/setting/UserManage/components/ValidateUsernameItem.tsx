import * as React from 'react';
import { ProFormText } from '@ant-design/pro-form';
import { validateUsername } from '@/services/resources/settings';

const ValidateUsernameItem: React.FC = () => {
  const validateUsernameRule = (
    rule: any,
    value: string,
    callback: (arg0?: string | undefined) => void,
  ) => {
    if (value === '') return;
    validateUsername(value).then((res) => {
      if (res.code !== 200) {
        callback('用户名已存在');
      } else {
        callback();
      }
    });
  };
  return (
    <ProFormText
      name="username"
      label="用户名"
      placeholder="请输入"
      rules={[{ required: true, message: '姓名为必填项' }, { validator: validateUsernameRule }]}
      validateTrigger="onBlur"
    />
  );
};

export default ValidateUsernameItem;
