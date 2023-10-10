"use client"
import React, {useState} from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, Button, Input, Typography } from 'antd';
import HeaderView from '../components/Core/Header';
import FooterView from '../components/Core/Footer';
const { Search } = Input;
const { Text } = Typography;
const { Header, Content, Footer, Sider } = Layout;
const SearchProps : any = [];
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
    getItem('All', 'sub1', <LaptopOutlined/>),
    getItem('Laptop', 'sub2', <LaptopOutlined />, [
      getItem('Dell', '1'),
      getItem('Asus', '2'),
      getItem('Acer', '3'),
      getItem('Apple', '4'),
    ]),
    getItem('Tablet', 'sub3', <LaptopOutlined />, [
      getItem('Apple', '5'),
      getItem('Xiaomi', '6'),
      getItem('Samsung', '7'),
    ]),
    getItem('Phone', 'sub4', <LaptopOutlined />, [
        getItem('Apple', '9'),
        getItem('Xiaomi', '10'),
        getItem('Apple', '11'),
        getItem('Xiaomi', '12'),
    ]),
  ];

const onSearch = (value: any, _e: any, info: any) => console.log(info?.source, value);

const App: React.FC = () => {
    const [current, setCurrent] = useState('1');

    return (
      //  <div style={appStyles}>
          
          <Layout className='flex min-h-screen overflow-auto '>
            <HeaderView/>
            <Layout>
                <Sider width={200}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    style={{ height: '100%', borderRight: 0 }}
                    items={items}
                />
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <Content className='bg-red-300'>
                    Content
                </Content>
                </Layout>
            </Layout>
            <FooterView/>
          </Layout>
        // </div>
    );
};
// const appStyles:React.CSSProperties = {
//   width: '100vw',
//   height: '100vh',
//   backgroundImage: 'url("https://scontent.fhan14-2.fna.fbcdn.net/v/t1.6435-9/106565054_3970224156385298_2926454980612667154_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=9xSnaV-q_hsAX8F2OIo&_nc_ht=scontent.fhan14-2.fna&oh=00_AfB05TlNJL3_zTQXQdDMyGAXCgY4mFxGCJE_LHT72HEYdA&oe=654605F0")',
//   backgroundSize: 'cover',
//   backgroundRepeat:'no-repeat'
// };

export default App;