import React, { useRef, useState, useCallback } from 'react';
import { FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getUsersApi, delUser, disable2EnableUser } from '@/services/resources/settings';
import { Button, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AddUserModal from './components/AddUserModal';
import EditUserModal from './components/EditUserModal';
import cloneDeep from 'lodash/cloneDeep';
import { Popconfirm } from 'antd';

const { Search } = Input;

type PageParams = {
  current?: number;
  pageSize?: number;
  [x: string]: any;
};

type ListItem = {
  id: number;
  name: string;
  role: string[];
  authorities: string[];
  updateTime: number;
};

const STATUS_TEXT = {
  enabled: '已启用',
  disabled: '已禁用',
};

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createUserModalShow, setCreateUserModalShow] = useState<boolean>(false);
  const [editUserModalShow, setEditUserModalShow] = useState<boolean>(false);
  const [editDetail, setEditDetail] = useState();
  const [customParams, setCustomParams] = useState({});
  const [currentNum, setCurrentNum] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const finishHook = useCallback(() => {
    actionRef.current?.reload();
  }, [actionRef]);
  const searchByName = (value: string) => {
    const params = cloneDeep(customParams);
    params.page = 1;
    setCurrentNum(1);
    if (value === '' && params.hasOwnProperty('username')) {
      delete params.username;
    } else {
      params.username = value;
    }
    setCustomParams(params);
  };
  const getUsers = async (params: PageParams) => {
    const { current: page, pageSize, ...rest } = params;
    const { data } = await getUsersApi({ page, pageSize, ...rest });
    setCurrentNum(data.currPageNum);
    return {
      data: data.user,
      success: true,
      total: data.totalNum,
    };
  };
  const paginationChange = (page: number, changePageSize: number) => {
    setCurrentPageSize(changePageSize);
    setCustomParams({ ...customParams, page, pageSize: changePageSize });
  };
  const columns: any[] = [
    {
      title: <FormattedMessage id="settings.userManage.username" defaultMessage="用户名" />,
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: <FormattedMessage id="settings.userManage.name" defaultMessage="姓名" />,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: <FormattedMessage id="settings.userManage.role" defaultMessage="角色" />,
      dataIndex: 'role',
      key: 'role',
      renderText: (text: string[]) => text.join('、'),
    },
    {
      title: <FormattedMessage id="settings.userManage.email" defaultMessage="邮箱" />,
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: <FormattedMessage id="settings.userManage.phone" defaultMessage="手机" />,
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: <FormattedMessage id="settings.userManage.modify-time" defaultMessage="修改时间" />,
      // sorter: true,
      dataIndex: 'modify-time',
      valueType: 'modify-time',
      key: 'modify-time',
    },
    {
      title: <FormattedMessage id="settings.userManage.status" defaultMessage="状态" />,
      // sorter: true,
      dataIndex: 'status',
      valueType: 'status',
      key: 'status',
      renderText: (value: string) => STATUS_TEXT[value],
    },
    {
      title: <FormattedMessage id="settings.userManage.operate" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (
        _text: any,
        record: { id: number; [x: string]: any },
        index: number,
        action: any,
      ) => [
        <a
          key="edit"
          href="#"
          onClick={() => {
            setEditDetail(record);
            setEditUserModalShow(true);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="status"
          title={`确认${record.status === 'disabled' ? '启用' : '禁用'}该用户?`}
          okText="确定"
          cancelText="取消"
          onConfirm={async () => {
            const operateStatus = record.status === 'disabled' ? 'enable' : 'disable';
            const res = await disable2EnableUser(`${record.id}`, operateStatus);
            if (res.code === 200) {
              message.success(`${record.status === 'disabled' ? '启用' : '禁用'}成功`);
              action.reload();
            }
          }}
        >
          <a href="#"> {record.status === 'disabled' ? '启用' : '禁用'}</a>
        </Popconfirm>,
        <Popconfirm
          key="delete"
          title="确认删除该用户？"
          okText="确定"
          cancelText="取消"
          onConfirm={async () => {
            const res = await delUser(record.id);
            if (res.code === 200) {
              message.success('删除成功');
              action.reload();
            }
          }}
        >
          <a href="#">删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<ListItem, PageParams>
        actionRef={actionRef}
        params={customParams}
        pagination={{
          pageSize: currentPageSize,
          current: currentNum,
          onChange: paginationChange,
        }}
        rowKey={(record) => record.id}
        search={false}
        toolBarRender={() => [
          <Search onSearch={searchByName} />,
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateUserModalShow(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        // request={(params, sorter) => getUsers({params, sorter })}
        request={getUsers}
        columns={columns}
      />
      <AddUserModal
        createUserModalShow={createUserModalShow}
        setCreateUserModalShow={setCreateUserModalShow}
        finishHook={finishHook}
      />
      {editUserModalShow && (
        <EditUserModal
          editUserModalShow={editUserModalShow}
          setEditUserModalShow={setEditUserModalShow}
          details={editDetail}
          finishHook={finishHook}
        />
      )}
    </PageContainer>
  );
};

export default TableList;
