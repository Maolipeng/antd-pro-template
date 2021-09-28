import { Tag } from 'antd';
import React from 'react';

const TaskTag = ({ status }) => (
  <Tag color={status === 1 ? '#87d068' : '#1890ff'}>{status === 1 ? '纵向' : '横向'}</Tag>
);
export default TaskTag;
