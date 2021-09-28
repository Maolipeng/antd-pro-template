import * as React from 'react';
// import { ModalForm, ProFormFieldSet, ProFormText } from '@ant-design/pro-form';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Form } from 'antd';
import type { RoleData } from '@/services/resources/settings';
// import { getAuthorizeList } from '@/services/resources/settings';
import { editRole } from '@/services/resources/settings';
import { message } from 'antd';
import TreeSelectPermissions from '../TreeSelectPermissions';

// const mockAuths = { menu: ['userManage', 'auditManagement', 'auditActionManagement'], checkedPermissions: ['userManageCreate', 'userManageEdit', 'authoritiesRoleCreate'] }

type Props = {
  editRoleModalShow: boolean;
  setEditRoleModalShow: React.Dispatch<React.SetStateAction<boolean>>;
  details: any;
  finishHook: () => void;
};

// const { useRef, useState, useEffect } = React;
const { useRef } = React;
const EditRoleModal: React.FC<Props> = (props) => {
  // const [permissionList, setPermissionList] = useState<{ name: string; permission: string[] }[]>(
  //   [],
  // );
  // useEffect(() => {
  //   (async () => {
  //     const { code, data } = await getAuthorizeList();
  //     if (code === 200) {
  //       setPermissionList(data);
  //     }
  //   })();
  // }, []);
  const { editRoleModalShow, setEditRoleModalShow, finishHook, details } = props;

  const modalFormRef = useRef<FormInstance>();
  return (
    <ModalForm<RoleData>
      title="编辑角色"
      width="1000px"
      layout="horizontal"
      initialValues={{
        name: details.name,
        description: details.description,
        authorities: details.authorities,
        // authorities: mockAuths,
      }}
      formRef={modalFormRef}
      {...{
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
      }}
      visible={editRoleModalShow}
      onVisibleChange={(bol) => {
        setEditRoleModalShow(bol);

        if (!bol) {
          modalFormRef.current?.resetFields();
        }
      }}
      onFinish={async (value) => {
        try {
          const res = await editRole({
            id: details.id,
            ...value,
          });
          if (res.code === 200) {
            setEditRoleModalShow(false);
            modalFormRef.current?.resetFields();
            message.success('编辑用户成功');
            finishHook();
          }
        } catch (error) {
          console.error(error);
        }
      }}
    >
      <h2>角色信息</h2>
      <ProFormText
        width="md"
        name="name"
        label="角色名"
        rules={[{ required: true, message: '请输入角色名' }]}
      />
      <ProFormText width="md" name="description" label="角色描述" />
      <h2>权限范围</h2>
      <Form.Item name="authorities">
        <TreeSelectPermissions />
      </Form.Item>
    </ModalForm>
  );
};

export default EditRoleModal;
