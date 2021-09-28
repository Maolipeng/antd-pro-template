import * as React from 'react';
import { ProFormText } from '@ant-design/pro-form';

const ValidateNameItem: React.FC = () => {
  return (
    <ProFormText
      rules={[
        {
          required: true,
          message: '姓名为必填项',
        },
      ]}
      name="name"
      label="姓名"
      placeholder="请输入"
    />
  );
};

export default ValidateNameItem;
