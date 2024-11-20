'use client';
//@ts-ignore
import { motion } from 'framer-motion';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
    RightOutlined,
    LaptopOutlined,
    NotificationOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, Button, Input, Typography, Pagination } from 'antd';

import Banner from '../../components/home/Banner';
import ProductList from '../../components/home/ProductList';
import HeaderView from '../../components/Core/Header';
import FooterView from '../../components/Core/Footer';
import LoadingPage from '../../components/home/LoadingPage';
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

const items: MenuItem[] = [getItem('All', 'sub1', <RightOutlined />)];

const onSearch = (value: any, _e: any, info: any) =>
    console.log(info?.source, value);

const App: React.FC = () => {
    const [current, setCurrent] = useState('1');
    const [data, setData] = useState([]);
    const [product, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8; // số sản phẩm trên mỗi trang

    useEffect(() => {
        // Define the URL you want to fetch data from
        const apiUrl = 'http://localhost:8080/api/product';

        // Make the GET request using Axios
        fetch('http://localhost:8080/api/product')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Assuming the response contains JSON data
            })
            .then((data) => {
                setProduct(data);
                setIsLoading(false);
                // Use the 'data' returned from the server
                console.log(data);
            })
            .catch((error) => {
                // Handle any errors that occurred during the fetch
                console.error('Fetch error:', error);
            });
    }, []); // Empty dependency array means this effect runs once after the initial render

    useEffect(() => {}, [isLoading]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Tính toán sản phẩm cho trang hiện tại
    const getCurrentProducts = () => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return product.slice(startIndex, endIndex);
    };

    return isLoading ? (
        <LoadingPage />
    ) : (
        <Layout className="animate__animated animate__fade flex min-h-screen overflow-auto">
            <Layout>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content className="min-h-screen w-full">
                        <ProductList 
                            className="small-product-cards" 
                            productData={getCurrentProducts()} 
                        />
                        <div className="flex justify-center mt-4">
                            <Pagination
                                current={currentPage}
                                total={product.length}
                                pageSize={pageSize}
                                onChange={handlePageChange}
                            />
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default App;
