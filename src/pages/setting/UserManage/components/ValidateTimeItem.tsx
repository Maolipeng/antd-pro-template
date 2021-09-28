import * as React from 'react';
import { ProFormDateTimePicker } from '@ant-design/pro-form';

const ValidateTimeItem: React.FC = () => {
  return (
    <ProFormDateTimePicker
      label="失效日期"
      initialValue="2099-12-31 23:59:59"
      rules={[{ required: true, message: '请选择失效日期' }]}
      name="expiredate"
      width="lg"
    />
  );
};

export default ValidateTimeItem;
