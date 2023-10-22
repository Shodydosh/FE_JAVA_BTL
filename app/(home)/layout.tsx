'use client';

import { ReactNode, createElement } from 'react';
import { Layout, Menu, MenuProps } from 'antd';
import {
    LaptopOutlined,
    NotificationOutlined,
    UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
}));

const items2: MenuProps['items'] = [
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
].map((icon, index) => {
    const key = String(index + 1);

    return {
        key: `sub${key}`,
        icon: createElement(icon),
        label: `subnav ${key}`,

        children: new Array(4).fill(null).map((_, j) => {
            const subKey = index * 4 + j + 1;
            return {
                key: subKey,
                label: `option${subKey}`,
            };
        }),
    };
});

export default function HomeLayout({ children }: { children: ReactNode }) {
    return (
        <Layout>
            <Sider width={200} style={{ background: '#ffffff' }}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    style={{ height: '100%', borderRight: 0 }}
                    items={items2}
                />
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
                <Content
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: '100vh',
                        background: '#ffffff',
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
