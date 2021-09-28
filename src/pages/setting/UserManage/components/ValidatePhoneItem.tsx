import * as React from 'react';
import { ProFormText } from '@ant-design/pro-form';

const ValidatePhoneItem: React.FC = () => {
  return (
    <ProFormText
      rules={[
        {
          pattern:
            /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/,
          message: '请输入正确的手机号码',
        },
      ]}
      name="phone"
      label="手机"
      placeholder="请输入"
    />
  );
};

export default ValidatePhoneItem;
