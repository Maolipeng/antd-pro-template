import React from 'react';
import { FormattedMessage } from 'umi';

interface Props {
  status?: string;
  id: string;
  defaultMessage?: string;
}

const customStatusMap = {
  Default: '#d9d9d9',
  Success: '#52c41a',
  Error: '#ff4d4f',
  Warning: '#faad14',
  Processing: '#1890ff',
};

const StatusFormat = (props: Props) => {
  const { id, defaultMessage, status = 'Default' } = props;
  return (
    <FormattedMessage id={id} defaultMessage={defaultMessage}>
      {(txt) => <span style={{ color: customStatusMap[status] }}>{txt}</span>}
    </FormattedMessage>
  );
};

export default StatusFormat;
