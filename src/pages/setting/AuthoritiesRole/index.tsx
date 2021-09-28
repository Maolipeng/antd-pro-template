import React, { useRef, useState, useCallback } from 'react';
import { FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getRolesApi, delRole } from '@/services/resources/settings';
import type { RoleItem } from '@/services/resources/settings';
import { Button, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import cloneDeep from 'lodash/cloneDeep';
import { Popconfirm } from 'antd';
import AddRoleModal from './components/AddRoleModal';
import EditRoleModal from './components/EditRoleModal';
// import { USER_PERMISSIONS_MAP } from '@/const/setting';
import { PERMISSION_LIST_MAP } from './components/TreeSelectPermissions/const';

const { Search } = Input;

type PageParams = {
  current?: number;
  pageSize?: number;
  [x: string]: any;
};

type ListItem = {
  id: number;
  name: string;
  description: string;
  authorities: RoleItem[];
  modifytime: number;
};

const AuthoritiesRole: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createRoleModalShow, setCreateRoleModalShow] = useState<boolean>(false);
  const [editRoleModalShow, setEditRoleModalShow] = useState<boolean>(false);
  const [editDetail, setEditDetail] = useState({});
  const [customParams, setCustomParams] = useState({});
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [currentNum, setCurrentNum] = useState(1);
  const finishHook = useCallback(() => {
    actionRef.current?.reload();
  }, [actionRef]);
  const searchByName = (value: string) => {
    const params = cloneDeep(customParams);
    params.page = 1;
    setCurrentNum(1);
    if (value === '' && params.hasOwnProperty('rolename')) {
      delete params.rolename;
    } else {
      params.rolename = value;
    }
    setCustomParams(params);
  };
  const getRoles = async (params: PageParams) => {
    const { current: page, pageSize, ...rest } = params;
    const { data } = await getRolesApi({ page, pageSize, nameOnly: 0, ...rest });
    setCurrentNum(data.currPageNum);
    return {
      data: data.role,
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
      title: <FormattedMessage id="settings.userRole.name" defaultMessage="角色名" />,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: <FormattedMessage id="settings.userRole.description" defaultMessage="角色描述" />,
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: <FormattedMessage id="settings.userRole.authorities" defaultMessage="权限范围" />,
      dataIndex: 'authorities',
      key: 'authorities',
      renderText: (text: { menu: string[]; checkedPermissions: string[] }) => {
        const list = [...text.menu];
        return list.map((v) => PERMISSION_LIST_MAP[v]).join(',');
      },
      // eslint-disable-next-line
      // renderText: (text: any) =>
      //   text
      //     .reduce(
      //       (arr: any, item: RoleItem) => [
      //         ...arr,
      //         USER_PERMISSIONS_MAP[item.name],
      //         ...item.permission.map((w) => USER_PERMISSIONS_MAP[w]),
      //       ],
      //       [],
      //     )
      //     .join(','),
    },
    {
      title: <FormattedMessage id="settings.userRole.modifytime" defaultMessage="修改时间" />,
      // sorter: true,
      dataIndex: 'modifytime',
      valueType: 'modifytime',
      key: 'modifytime',
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
            setTimeout(() => {
              setEditRoleModalShow(true);
            }, 0);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确认删除该角色？"
          okText="确定"
          cancelText="取消"
          onConfirm={async () => {
            const res = await delRole(record.id);
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
              setCreateRoleModalShow(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        // request={(params, sorter) => getUsers({ ...params, sorter })}
        request={getRoles}
        columns={columns}
      />
      <AddRoleModal
        createRoleModalShow={createRoleModalShow}
        setCreateRoleModalShow={setCreateRoleModalShow}
        finishHook={finishHook}
      />
      {editRoleModalShow && (
        <EditRoleModal
          editRoleModalShow={editRoleModalShow}
          setEditRoleModalShow={setEditRoleModalShow}
          details={editDetail}
          finishHook={finishHook}
        />
      )}
    </PageContainer>
  );
};

export default AuthoritiesRole;
