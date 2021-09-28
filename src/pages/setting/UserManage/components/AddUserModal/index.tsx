import * as React from 'react';
import { ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import type { UserItem } from '@/services/resources/settings';
import { addUser } from '@/services/resources/settings';
import { message } from 'antd';
import ValidateUsernameItem from '../ValidateUsernameItem';
import ValidateNameItem from '../ValidateNameItem';
import ValidatePassItem from '../ValidatePassItem';
import ValidateEmailItem from '../ValidateEmailItem';
import ValidatePhoneItem from '../ValidatePhoneItem';
import ValidateRolesItem from '../ValidateRolesItem';
import ValidateTimeItem from '../ValidateTimeItem';
import ValidateCompanyItem from '../ValidateCompanyItem';

type Props = {
  createUserModalShow: boolean;
  setCreateUserModalShow: React.Dispatch<React.SetStateAction<boolean>>;
  finishHook: () => void;
};

const { useRef } = React;
const AddUserModal: React.FC<Props> = (props) => {
  const { createUserModalShow, setCreateUserModalShow, finishHook } = props;
  const modalFormRef = useRef<FormInstance>();

  return (
    <ModalForm<UserItem>
      title="添加用户"
      width="600px"
      layout="horizontal"
      formRef={modalFormRef}
      {...{
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
      }}
      visible={createUserModalShow}
      onVisibleChange={(bol) => {
        console.log('bol', bol);
        setCreateUserModalShow(bol);

        if (!bol) {
          modalFormRef.current?.resetFields();
        }
      }}
      onFinish={async (value) => {
        try {
          const res = await addUser(value);
          if (res.code === 200) {
            setCreateUserModalShow(false);
            modalFormRef.current?.resetFields();
            message.success('添加用户成功');
            finishHook();
          }
        } catch (error) {
          console.error(error);
        }
      }}
    >
      <ValidateUsernameItem />
      <ValidateNameItem />
      <ValidatePassItem />
      <ValidateEmailItem />
      <ValidatePhoneItem />
      <ValidateRolesItem />
      <ValidateCompanyItem />
      <ValidateTimeItem />
    </ModalForm>
  );
};

export default AddUserModal;
