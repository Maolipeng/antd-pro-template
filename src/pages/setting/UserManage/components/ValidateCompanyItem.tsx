import * as React from 'react';
import { ProFormSelect } from '@ant-design/pro-form';
import { getCompanies } from '@/services/resources/settings';

const { useState, useEffect } = React;
type Company = {
  label: string;
  value: string;
};
type Companies = Company[];
const ValidateCompanyItem: React.FC = () => {
  const [company, setCompany] = useState<Company>();
  const [companies, setCompanies] = useState<Companies>();
  useEffect(() => {
    (async () => {
      const { data } = await getCompanies();
      setCompany({ label: data.description, value: data.name });
      setCompanies([{ label: data.description, value: data.name }]);
    })();
  }, []);
  return (
    <>
      {company && (
        <ProFormSelect
          name="company"
          label="所属机构"
          placeholder="请输入"
          initialValue={company.value}
          options={companies}
          disabled
          // request={async () => {
          //   const { code, data } = await getCompanies();
          //   return code === 200 ? [{ label: data.description, value: data.name }] : [];
          // }}
        />
      )}
    </>
  );
};

export default ValidateCompanyItem;
