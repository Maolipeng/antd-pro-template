import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  // navTheme: 'light',
  headerTheme: 'dark',
  primaryColor: '#1890ff',
  // layout: 'mix',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  title: '',
  logo: '/logo.svg',
  pwa: false,
  menu: {
    locale: false,
    autoClose: false,
  },
  headerHeight: 48,
  // splitMenus: true,
  splitMenus: false,
};

export default Settings;
