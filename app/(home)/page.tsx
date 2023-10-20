'use client';
import React, { useState } from 'react';
import {
    LaptopOutlined,
    NotificationOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, Button, Input, Typography } from 'antd';

import Banner from '../../components/home/Banner';
import ProductList from '../../components/home/ProductList';
import HeaderView from '../../components/Core/Header';
import FooterView from '../../components/Core/Footer';

const { Search } = Input;
const { Text } = Typography;
const { Header, Content, Footer, Sider } = Layout;
const SearchProps: any = [];
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
    getItem('All', 'sub1', <LaptopOutlined />),
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

const onSearch = (value: any, _e: any, info: any) =>
    console.log(info?.source, value);

const App: React.FC = () => {
    const [current, setCurrent] = useState('1');

    return <>hello home page</>;
};

export default App;

//  <div style={appStyles}>

// <Layout className="flex min-h-screen overflow-auto ">
//     <HeaderView />
//     <Layout>
//         <Sider width={200}>
//             <Menu
//                 mode="inline"
//                 defaultSelectedKeys={['1']}
//                 defaultOpenKeys={['sub1']}
//                 style={{ height: '100%', borderRight: 0 }}
//                 items={items}
//             />
//         </Sider>
//         <Layout style={{ padding: '0 24px 24px' }}>
//             <Content className="w-full min-h-screen">
//                 <Banner></Banner>
//                 <ProductList></ProductList>
//             </Content>
//         </Layout>
//     </Layout>
//     {/* <CartPage/> */}
//     <FooterView />
// </Layout>
// </div>
