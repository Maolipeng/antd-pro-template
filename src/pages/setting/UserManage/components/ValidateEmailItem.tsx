import * as React from 'react';
import { ProFormText } from '@ant-design/pro-form';

const ValidateEmailItem: React.FC = () => {
  return (
    <ProFormText
      rules={[{ type: 'email', message: '请输入正确的邮箱' }]}
      name="email"
      label="邮箱"
      placeholder="请输入"
    />
  );
};

export default ValidateEmailItem;
