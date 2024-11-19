'use client';

import { ReactNode } from 'react';
import { Layout } from 'antd';
import Header from '@/components/Core/Header';
import Footer from '@/components/Core/Footer';
const { Content } = Layout;

export default function HomeLayout({ children }: { children: ReactNode }) {
    return (
        <Layout>
            <Header />
            <Content
                style={{
                    margin: 0,
                    minHeight: '100vh',
                    background: '#ffffff',
                }}
            >
                {children}
            </Content>
        </Layout>
    );
}
