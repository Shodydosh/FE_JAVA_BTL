'use client';

import { PropsWithChildren } from 'react';
import { Layout } from 'antd';
import Header from './Core/Header';
import FooterView from './Core/Footer';

interface GlobalLayoutProps extends PropsWithChildren {}

export default function GlobalLayout({ children }: GlobalLayoutProps) {
    return (
        <Layout>
            <Layout>{children}</Layout>
            <FooterView />
        </Layout>
    );
}
