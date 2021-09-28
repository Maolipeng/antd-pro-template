import * as React from 'react';
import { Tree, Checkbox } from 'antd';
import { PERMISSION_LIST, PERMISSION_LIST_MAP } from './const';
import './style.less';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

const { useState } = React;
type Props = {
  value?: { menu: string[]; checkedPermissions: string[] };
  onChange?: (value: any) => void;
};
const filterPermissions = (list: any) => {
  return list.reduce((res: any, item: any) => {
    if (item.children) {
      filterPermissions(item.children);
    }
    const itemPermissions = item.uiPermissions ? item.uiPermissions : [];
    return [...res, ...itemPermissions];
  }, []);
};

const TreeSelectPermissions: React.FC<Props> = ({
  value = { menu: [], checkedPermissions: [] },
  onChange,
}) => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedMenus, setCheckedMenus] = useState(value?.menu);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [uiPermission, setUiPermission] = useState([]);
  const [checkedPermissionKeys, setCheckedPermissionKeys] = useState(value?.checkedPermissions);

  const onExpand = (expandedKeysValue: any) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedMenu: any, e: any) => {
    console.log('checkedMenu', checkedMenu);

    const { checkedNodes } = e;
    const permissions = filterPermissions(checkedNodes);
    const checkedChangedPermissions = checkedPermissionKeys.filter((per) =>
      permissions.includes(per),
    );
    setCheckedMenus(checkedMenu);
    setCheckedPermissionKeys(checkedChangedPermissions);
    onChange?.({ menu: checkedMenu, checkedPermissions: checkedChangedPermissions });
  };

  const onSelect = (selectedKeysValue: any, info: any) => {
    console.log('selectedKeysValue', selectedKeysValue);

    setSelectedMenus(selectedKeysValue);
    setUiPermission(info?.node?.uiPermissions);
  };
  const uiCheckChange = (e: CheckboxChangeEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { checked, value } = e.target;
    let checkedPermissionList = checkedPermissionKeys;
    let changeCheckedMenus = [...checkedMenus];
    const selectedMenuKey = selectedMenus[0];
    if (checked) {
      checkedPermissionList = [...checkedPermissionKeys, value];
    } else {
      checkedPermissionList = checkedPermissionList.filter((item) => item !== value);
    }
    if (uiPermission.some((k: string) => checkedPermissionList.includes(k))) {
      changeCheckedMenus = changeCheckedMenus.includes(selectedMenuKey)
        ? changeCheckedMenus
        : [...changeCheckedMenus, selectedMenuKey];
    } else {
      changeCheckedMenus = changeCheckedMenus.filter((item) => item !== selectedMenuKey);
    }
    setCheckedMenus(changeCheckedMenus);
    setCheckedPermissionKeys(checkedPermissionList);
    onChange?.({ menu: changeCheckedMenus, checkedPermissions: checkedPermissionList });
  };
  return (
    <div className="tree-select-wrap">
      <div className="tree-select-wrap-left">
        <Tree
          checkable
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onCheck={onCheck}
          checkedKeys={checkedMenus}
          onSelect={onSelect}
          selectedKeys={selectedMenus}
          treeData={PERMISSION_LIST}
        />
      </div>
      <div className="tree-select-wrap-right">
        {uiPermission && !!uiPermission.length && (
          <Checkbox.Group value={checkedPermissionKeys}>
            {uiPermission.map((item) => (
              <Checkbox value={item} key={item} onChange={uiCheckChange}>
                {PERMISSION_LIST_MAP[item]}
              </Checkbox>
            ))}
          </Checkbox.Group>
        )}
      </div>
    </div>
  );
};

export default TreeSelectPermissions;
