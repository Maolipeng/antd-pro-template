import { Checkbox } from 'antd';
import * as React from 'react';
import { USER_PERMISSIONS_MAP } from '@/const/setting';
import './index.less';

type Props = {
  defaultList: string[];
  value?: { name: string; permission: string[] };
  allName: string;
  onChange?: (value: any) => void;
};

const CheckboxGroup = Checkbox.Group;
const { useState, useRef } = React;

const CheckItem: React.FC<Props> = ({ value, onChange, defaultList, allName }) => {
  console.log('value123', value);

  const [checkedList, setCheckedList] = useState(value?.permission);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const optionsRef = useRef(
    defaultList.map((item) => ({ label: USER_PERMISSIONS_MAP[item], value: item })),
  );

  const handleChange = (list: any) => {
    setCheckedList(list);
    console.log('allName', allName);

    setIndeterminate(!!list.length && list.length < defaultList.length);
    setCheckAll(list.length === defaultList.length);
    // onChange?.([allName, ...list]);
    onChange?.({
      name: allName,
      permission: list,
    });
  };

  const onCheckAllChange = (e: any) => {
    const currentSelectList = e.target.checked ? defaultList : [];
    setCheckedList(currentSelectList);
    setIndeterminate(false);
    setCheckAll(e.target.checked);

    onChange?.(currentSelectList.length ? { name: allName, permission: currentSelectList } : []);
  };
  return (
    <div className="role-check-item-wrap">
      <div className="role-wrap-page">
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          {USER_PERMISSIONS_MAP[allName]}
        </Checkbox>
      </div>
      <div className="role-wrap-page-menu">
        <CheckboxGroup options={optionsRef.current} value={checkedList} onChange={handleChange} />
      </div>
    </div>
  );
};
const defaultProps = {
  defaultList: [],
};

CheckItem.defaultProps = defaultProps;
export default CheckItem;
