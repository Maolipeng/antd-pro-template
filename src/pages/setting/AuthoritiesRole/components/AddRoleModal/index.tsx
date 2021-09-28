import * as React from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Form } from 'antd';
import type { RoleData } from '@/services/resources/settings';
// import { addRole, validateRoleName, getAuthorizeList } from '@/services/resources/settings';
import { addRole, validateRoleName } from '@/services/resources/settings';
import { message } from 'antd';
// import CheckItem from '../CheckItem';
import TreeSelectPermissions from '../TreeSelectPermissions';
import { ALL_AUTHORITIES } from '../TreeSelectPermissions/const';

type Props = {
  createRoleModalShow: boolean;
  setCreateRoleModalShow: React.Dispatch<React.SetStateAction<boolean>>;
  finishHook: () => void;
};

// const { useRef, useState, useEffect } = React;
const { useRef } = React;
const AddRoleModal: React.FC<Props> = (props) => {
  // eslint-disable-next-line
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
  const { createRoleModalShow, setCreateRoleModalShow, finishHook } = props;
  const modalFormRef = useRef<FormInstance>();
  const validateRoleNameFn = (
    rule: any,
    value: string,
    callback: (arg0?: string | undefined) => void,
  ) => {
    // console.log('value', value);
    if (value === '') return;
    validateRoleName(value).then((res) => {
      if (res.code !== 200) {
        callback('用户名已存在');
      } else {
        callback();
      }
    });
  };

  return (
    <ModalForm<RoleData>
      title="添加角色"
      width="1000px"
      // layout="horizontal"
      formRef={modalFormRef}
      {...{
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
      }}
      visible={createRoleModalShow}
      onVisibleChange={(bol) => {
        // console.log('bol', bol);
        setCreateRoleModalShow(bol);

        if (!bol) {
          modalFormRef.current?.resetFields();
        }
      }}
      onFinish={async (value) => {
        const formVal = value;
        // console.log('formVal', formVal);

        if (!formVal.authorities) {
          formVal.authorities = [];
        }
        try {
          const res = await addRole(formVal);
          if (res.code === 200) {
            setCreateRoleModalShow(false);
            modalFormRef.current?.resetFields();
            message.success('添加角色成功');
            finishHook();
          }
        } catch (error) {
          // console.error(error);
        }
      }}
      initialValues={{
        authorities: ALL_AUTHORITIES,
        // authorities: mockAuths,
      }}
    >
      <h2>角色信息</h2>
      <ProFormText
        width="md"
        name="name"
        label="角色名"
        rules={[{ required: true, message: '请输入角色名' }, { validator: validateRoleNameFn }]}
      />
      <ProFormText width="md" name="description" label="角色描述" />
      <h2>权限范围</h2>
      <Form.Item name="authorities">
        <TreeSelectPermissions />
      </Form.Item>
    </ModalForm>
  );
};

export default AddRoleModal;
