import StatusFormat from '@/components/StatusFormat';
// 数据中心状态
export const DATA_STATUS = {
  1: {
    text: (
      <StatusFormat status="Normal" id="dataManage.dataset.beforeread" defaultMessage="待读取" />
    ),
    status: 'Default',
  },
  2: {
    text: <StatusFormat status="Normal" id="dataManage.dataset.reading" defaultMessage="读取中" />,
    status: 'Default',
  },
  3: {
    text: (
      <StatusFormat
        status="Success"
        id="dataManage.dataset.readSuccess"
        defaultMessage="读取成功"
      />
    ),
    status: 'Success',
  },
  4: {
    text: (
      <StatusFormat status="Error" id="dataManage.dataset.readFailed" defaultMessage="读取失败" />
    ),
    status: 'Error',
  },
};

// 项目中心状态
export const PROJECT_STATUS = {
  1: {
    text: <StatusFormat status="Normal" id="status.action2.inital" defaultMessage="初始化" />,
    status: 'Default',
  },
  2: {
    text: <StatusFormat status="Normal" id="status.action2.inital" defaultMessage="初始化" />,
    status: 'Default',
  },
  3: {
    text: <StatusFormat status="Normal" id="status.action2.default" defaultMessage="已创建" />,
    status: 'Default',
  },
  4: {
    text: (
      <StatusFormat status="Processing" id="status.action2.processing" defaultMessage="运行中" />
    ),
    status: 'Processing',
  },
  5: {
    text: <StatusFormat status="Success" id="status.action2.success" defaultMessage="运行成功" />,
    status: 'Success',
  },
  6: {
    text: <StatusFormat status="Error" id="status.action2.fail" defaultMessage="运行失败" />,
    status: 'Error',
  },
  7: {
    text: <StatusFormat status="Normal" id="status.action2.stop" defaultMessage="终止" />,
    status: 'Default',
  },
  8: {
    text: <StatusFormat status="Processing" id="status.action2.creating" defaultMessage="创建中" />,
    status: 'Processing',
  },
  9: {
    text: <StatusFormat status="Processing" id="status.action2.cut" defaultMessage="切分中" />,
    status: 'Processing',
  },
};

// 在线服务状态
export const SERVICE_STATUS = {
  0: {
    text: <StatusFormat status="Normal" id="status.action2.preExamine" defaultMessage="待审核" />,
    status: 'Default',
  },
  1: {
    text: <StatusFormat status="Processing" id="status.action2.online" defaultMessage="已上线" />,
    status: 'Processing',
  },
  2: {
    text: <StatusFormat status="Normal" id="status.action2.offline" defaultMessage="已下线" />,
    status: 'Default',
  },
  3: {
    text: <StatusFormat status="Error" id="status.action2.refuse" defaultMessage="审核不通过" />,
    status: 'Error',
  },
  4: {
    text: <StatusFormat status="Success" id="status.action2.pass" defaultMessage="审核通过" />,
    status: 'Success',
  },
};
