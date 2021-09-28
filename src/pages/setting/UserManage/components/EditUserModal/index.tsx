import * as React from 'react';
import { ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Button, Form } from 'antd';
import type { UserItem } from '@/services/resources/settings';
import { editUser, restPass } from '@/services/resources/settings';
import { message } from 'antd';
import ValidateNameItem from '../ValidateNameItem';
import ValidateEmailItem from '../ValidateEmailItem';
import ValidatePhoneItem from '../ValidatePhoneItem';
import ValidateRolesItem from '../ValidateRolesItem';
import ValidateTimeItem from '../ValidateTimeItem';
import ValidateCompanyItem from '../ValidateCompanyItem';

type Props = {
  editUserModalShow: boolean;
  setEditUserModalShow: React.Dispatch<React.SetStateAction<boolean>>;
  details: any;
  finishHook: () => void;
};

const { useState, useRef } = React;
const EditUserModal: React.FC<Props> = (props) => {
  const { editUserModalShow, setEditUserModalShow, finishHook, details } = props;
  const [isResetPass, setIsResetPass] = useState(false);
  const [defaultPass, setDefaultPass] = useState('');
  const restPassFn = async () => {
    const res = await restPass(details.id);
    if (res.code === 200) {
      setDefaultPass(res.data.password);
      setIsResetPass(true);
      // message.info(`您的密码为：${res.data.password}`)
    }
  };
  const modalFormRef = useRef<FormInstance>();
  return (
    <ModalForm<UserItem>
      title="编辑用户"
      width="600px"
      layout="horizontal"
      initialValues={{
        name: details.name,
        phone: details.phone,
        email: details.email,
        role: details.role,
        expiredate: details.expiredate,
        company: details.company,
      }}
      formRef={modalFormRef}
      {...{
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
      }}
      visible={editUserModalShow}
      // onVisibleChange={setEditUserModalShow}
      onVisibleChange={(bol) => {
        setEditUserModalShow(bol);

        if (!bol) {
          modalFormRef.current?.resetFields();
        }
      }}
      onFinish={async (value) => {
        console.log('value', value);
        try {
          const res = await editUser({
            id: details.id,
            ...value,
          });
          if (res.code === 200) {
            setEditUserModalShow(false);
            modalFormRef.current?.resetFields();
            message.success('编辑用户成功');
            finishHook();
          }
        } catch (error) {
          console.error(error);
        }
      }}
    >
      {/* <ValidateUsernameItem /> */}
      <Form.Item label="用户名">{details.username}</Form.Item>
      <ValidateNameItem />
      <Form.Item label="重置用户密码">
        <Button onClick={restPassFn}>点击重置密码</Button>
        {isResetPass && <span>重置成功，默认密码为：{defaultPass}</span>}
      </Form.Item>
      {/* <ValidatePassItem /> */}
      <ValidateEmailItem />
      <ValidatePhoneItem />
      <ValidateRolesItem />
      <ValidateCompanyItem />
      <ValidateTimeItem />
    </ModalForm>
  );
};

export default EditUserModal;
