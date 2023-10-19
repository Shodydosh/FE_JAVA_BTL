"use client"
import React, {useState, useEffect} from 'react'
import { LaptopOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, Button, Input, Typography } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import type { MenuProps } from 'antd';
type MenuItem = Required<MenuProps>['items'][number];

import LoadingPage from '../../components/home/LoadingPage';
import UserManager from '../../components/Admin/UserManager';
import ProductManager from '../../components/Admin/ProductManager';
import AddNewUser from '../../components/Admin/AddNewUser';

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
    getItem('Users', 'user', <UserOutlined />),
    getItem('Products', 'product', <LaptopOutlined/>),
  ];
  

const AdminPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState('user'); // Default value
  const [usersData, setUsersData] = useState([]);
  const [productsData, setProductsData] = useState([]);

  const handleMenuItemClick = (item: any) => {
    setSelectedMenuItem(item.key);
  };

  useEffect(() => {
    // Define the URL you want to fetch data from
    const apiUrl = 'http://localhost:8080/api/';
  
    // Make the GET request using Axios
    console.log("🚀 ~ file: page.tsx:55 ~ useEffect ~ isLoading:", isLoading)
    if (isLoading) {
      fetch(apiUrl + 'product')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); // Assuming the response contains JSON data
        })
        .then(data => {
          setProductsData(data);
          console.log(data); // Log data only once
        })
        .catch(error => {
          // Handle any errors that occurred during the fetch
          console.error('Fetch error:', error);
        });
      fetch(apiUrl + 'admin/users/all')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); // Assuming the response contains JSON data
        })
        .then(data => {
          setUsersData(data);
          setIsLoading(false);
          // Use the 'data' returned from the server
          console.log(data); // Log data only once
        })
        .catch(error => {
          // Handle any errors that occurred during the fetch
          console.error('Fetch error:', error);
        });
    }
  }, []); 
  useEffect(() => {
    console.log(123); // Log 123 only once
  }, [isLoading]);
  // useEffect(() => {
  //   // Handle the selectedMenuItem value whenever it changes.
  //   console.log('Selected Menu Item:', selectedMenuItem);
  // }, [selectedMenuItem]);
  
  return (isLoading ? (
    <LoadingPage />
  ) : (
    <Layout className='flex min-h-screen overflow-auto animate__animated animate__fade'>
        <Layout>
          <Sider width={200}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['user']}
              defaultOpenKeys={['Users']}
              style={{ height: '100%', borderRight: 0 }}
              items={items}
              onClick={handleMenuItemClick}
            />
          </Sider>
          <Layout className='p-4'>

            <Content className='w-full min-h-screen p-4 bg-white rounded-xl'>
              {
                selectedMenuItem === "user" 
                ? <div>
                    <div className='flex justify-between mt-4 mb-8'>
                      <h1 className='text-3xl font-bold text-black'>User Manager</h1>
                      <AddNewUser />
                    </div>
                    <UserManager usersData = {usersData}/> 
                  </div>
                : <ProductManager productsData = {productsData}/>
              }
            </Content>
          </Layout>
        </Layout>
      </Layout>
  ))
}

export default AdminPage