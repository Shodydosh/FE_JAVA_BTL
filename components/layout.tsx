'use client';

import { PropsWithChildren } from 'react';
import { Layout } from 'antd';
import Header from './Core/Header';

interface GlobalLayoutProps extends PropsWithChildren {}

export default function GlobalLayout({ children }: GlobalLayoutProps) {
    return (
        <Layout>
            <Header />
            <Layout>{children}</Layout>
        </Layout>
    );
}
