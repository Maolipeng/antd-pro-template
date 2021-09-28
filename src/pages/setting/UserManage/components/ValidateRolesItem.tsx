import * as React from 'react';
import { ProFormSelect } from '@ant-design/pro-form';
import { getAllRoles } from '@/services/resources/settings';

const ValidateRolesItem: React.FC = () => {
  return (
    <ProFormSelect
      mode="multiple"
      rules={[{ required: true, message: '请选择角色' }]}
      request={async () => {
        const res = await getAllRoles();
        return res.code === 200
          ? res.data.role.map((item: { description: any; name: any }) => ({
              label: item.name,
              value: item.name,
            }))
          : [];
      }}
      name="role"
      label="角色"
    />
  );
};

export default ValidateRolesItem;
