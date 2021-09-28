import { useModel } from 'umi';
import * as React from 'react';

type Props = {
  currentPermission: string | string[];
  fallback?: null | React.ReactElement;
};

const AccessComponent: React.FC<Props> = ({ currentPermission, children, fallback = null }) => {
  const { initialState } = useModel('@@initialState');
  const checkedPermissions = initialState?.currentUser?.authorities?.checkedPermissions;
  const isRenderChildren =
    typeof currentPermission === 'string'
      ? checkedPermissions?.includes(currentPermission)
      : currentPermission.every((item) => checkedPermissions?.includes(item));
  return <>{isRenderChildren ? children : fallback}</>;
};

export default AccessComponent;
