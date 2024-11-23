"use client"
import React, { useState, useEffect } from 'react'
import { UserOutlined, LaptopOutlined, BarChartOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
const { Content, Sider } = Layout;
import type { MenuProps } from 'antd';
type MenuItem = Required<MenuProps>['items'][number];

import LoadingPage from '../../components/home/LoadingPage';
import UserManager from '../../components/Admin/User/UserManager';
import ProductManager from '../../components/Admin/Product/ProductManager';
import AddNewUser from '../../components/Admin/User/AddNewUser';
import AddProductButton from '../../components/Admin/Product/AddProductButton';
import StatisticsManager from '../../components/Admin/Statistics/StatisticsManager';

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Người dùng', 'user', <UserOutlined />),
  getItem('Sản phẩm', 'product', <LaptopOutlined />),
  getItem('Thống kê', 'statistics', <BarChartOutlined />),
];

const ManagerPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState('user');
  const [usersData, setUsersData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [statisticsData, setStatisticsData] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    popularProducts: []
  });

  const calculateStatistics = () => {
    const totalUsers = usersData.length;
    const totalProducts = productsData.length;
    
    setStatisticsData({
      totalUsers,
      totalProducts,
      totalOrders: 0, // This will be updated if you need orders data
      totalRevenue: 0,
      recentOrders: [],
      popularProducts: productsData
        .slice(0, 5)
        .map(product => ({ product, soldCount: 0 }))
    });
  };

  useEffect(() => {
    const apiUrl = 'http://localhost:8080/api/';
    
    Promise.all([
      // Fetch users data
      fetch(apiUrl + 'admin/users/all')
        .then(response => {
          if (!response.ok) throw new Error('Failed to fetch users');
          return response.json();
        }),
      
      // Fetch products data
      fetch(apiUrl + 'product')
        .then(response => {
          if (!response.ok) throw new Error('Failed to fetch products');
          return response.json();
        })
    ])
    .then(([userData, productData]) => {
      setUsersData(userData);
      setProductsData(productData);
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Fetch error:', error);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      calculateStatistics();
    }
  }, [usersData, productsData, isLoading]);

  return (isLoading ? (
    <LoadingPage />
  ) : (
    <Layout className='flex min-h-screen overflow-auto animate__animated animate__fade'>
      <Layout>
        <Sider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['user']}
            style={{ height: '100%', borderRight: 0 }}
            items={items}
            onClick={(item) => setSelectedMenuItem(item.key)}
          />
        </Sider>
        <Layout className='p-4'>
          <Content className='w-full min-h-screen p-4 bg-white rounded-xl'>
            {selectedMenuItem === "user" && (
              <div>
                <div className='flex justify-between mt-4 mb-8'>
                  <h1 className='text-3xl font-bold text-black'>Quản lý người dùng</h1>
                  <AddNewUser />
                </div>
                <UserManager usersData={usersData} />
              </div>
            )}
            {selectedMenuItem === "product" && (
              <div>
                <div className='flex justify-between mt-4 mb-8'>
                  <h1 className='text-3xl font-bold text-black'>Quản lý sản phẩm</h1>
                  <AddProductButton />
                </div>
                <ProductManager productsData={productsData} />
              </div>
            )}
            {selectedMenuItem === "statistics" && (
              <div>
                <div className='flex justify-between mt-4 mb-8'>
                  <h1 className='text-3xl font-bold text-black'>Bảng điều khiển thống kê</h1>
                </div>
                <StatisticsManager statisticsData={statisticsData} />
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  ))
}

export default ManagerPage
