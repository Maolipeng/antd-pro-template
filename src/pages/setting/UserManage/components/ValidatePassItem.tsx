import * as React from 'react';
import { ProFormText } from '@ant-design/pro-form';

const ValidatePassItem: React.FC = () => {
  return (
    <ProFormText.Password
      rules={[
        {
          pattern: /^[A-Za-z0-9!@#$%^&*?]{6,18}$/,
          message: '密码只支持输入数字、大小写字母、特殊字符，长度必须介于6-18位之间',
        },
      ]}
      name="password"
      label="密码"
      placeholder="默认密码为：RealAI123456"
    />
  );
};

export default ValidatePassItem;
