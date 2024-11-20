"use client"
import React, {useState, useEffect} from 'react'
import { LaptopOutlined, UserOutlined, ShoppingCartOutlined, BarChartOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, Button, Input, Typography } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import type { MenuProps } from 'antd';
type MenuItem = Required<MenuProps>['items'][number];

import LoadingPage from '../../components/home/LoadingPage';
import UserManager from '../../components/Admin/User/UserManager';
import ProductManager from '../../components/Admin/Product/ProductManager';
import AddNewUser from '../../components/Admin/User/AddNewUser';
import AddProductButton from '../../components/Admin/Product/AddProductButton';
import OrderManager from '../../components/Admin/Order/OrderManager';
import StatisticsManager from '../../components/Admin/Statistics/StatisticsManager';

interface Order {
  id: string;
  user: {
    id: string;
  };
  orderItems: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  phoneNumber: string;
  customerName: string;
  note: string;
  paymentMethod: string;
  cardNumber?: string;
  cardHolder?: string;
  status: string;
  createdAt: string;
}

interface OrderItem {
  id: string;
  order: Order;
  product: {
    id: string;
    name: string;
    price: number;
    img_url: string;
    retailer: string;
  };
  quantity: number;
  price: number;
}

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
    getItem('Orders', 'order', <ShoppingCartOutlined/>),
    getItem('Statistics', 'statistics', <BarChartOutlined/>),
  ];
  

const AdminPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState('user'); // Default value
  const [usersData, setUsersData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [statisticsData, setStatisticsData] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    popularProducts: []
  });

  const handleMenuItemClick = (item: any) => {
    setSelectedMenuItem(item.key);
  };

  const calculateStatistics = () => {
    const totalUsers = usersData.length;
    const totalProducts = productsData.length;
    const totalOrders = ordersData.length;
    
    // Calculate total revenue with null check
    const totalRevenue = ordersData.reduce((sum: number, order: any) => {
      const orderPrice = order.totalPrice ? parseFloat(order.totalPrice) : 0;
      return sum + orderPrice;
    }, 0);

    // Get recent orders (last 5) with null checks
    const recentOrders = [...ordersData]
      .filter(order => order && order.orderDate)
      .sort((a: any, b: any) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, 5);

    // Calculate popular products with null checks
    const productCounts = new Map();
    ordersData.forEach((order: any) => {
      if (order.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach((item: any) => {
          if (item && item.productId) {
            const count = productCounts.get(item.productId) || 0;
            productCounts.set(item.productId, count + (parseInt(item.quantity) || 1));
          }
        });
      }
    });

    const popularProducts = Array.from(productCounts.entries())
      .map(([productId, count]) => ({
        product: productsData.find((p: any) => p.id === productId) || null,
        soldCount: count
      }))
      .filter(item => item.product !== null)
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 5);

    setStatisticsData({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      popularProducts
    });
  };

  useEffect(() => {
    // Define the URL you want to fetch data from
    const apiUrl = 'http://localhost:8080/api/';
  
    // Make the GET request using Axios
    console.log("���� ~ file: page.tsx:55 ~ useEffect ~ isLoading:", isLoading)
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
      fetch(apiUrl + 'orders/all')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setOrdersData(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });
    }
  }, []); 
  useEffect(() => {
    console.log(123); // Log 123 only once
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      calculateStatistics();
    }
  }, [usersData, productsData, ordersData, isLoading]);

  const handleOrderStatusUpdate = async (id: string, status: string) => {
    try {
      // Encode the status parameter to handle special characters
      const encodedStatus = encodeURIComponent(status);
      const response = await fetch(`http://localhost:8080/api/orders/${id}/status?status=${encodedStatus}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedOrder = await response.json();
      const updatedOrders = ordersData.map((order: any) => 
        order.id === id ? updatedOrder : order
      );
      setOrdersData(updatedOrders);
    } catch (error) {
      console.error('Error updating order status:', error);
      // You might want to add error handling UI here
    }
  };

  const handleOrderDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setOrdersData(ordersData.filter((order: any) => order.id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
      // You might want to add error handling UI here
    }
  };

  const fetchOrderItems = async (orderId: string) => {
    setLoading(true);
    try {
      const order = ordersData.find(o => o.id === orderId);
      setSelectedOrder(order || null);
      
      // Use order's existing orderItems instead of making new request
      if (order && order.orderItems) {
        setSelectedOrderItems(order.orderItems);
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error('Error setting order items:', error);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
  
      const updatedOrder = await response.json();
      const updatedOrders = ordersData.map(order => 
        order.id === orderId ? updatedOrder : order
      );
      setOrdersData(updatedOrders);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  
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
                : selectedMenuItem === "product"
                ? <div>
                  <div className='flex justify-between mt-4 mb-8'>
                    <h1 className='text-3xl font-bold text-black'>Product Manager</h1>
                    <AddProductButton/>
                  </div>
                  <ProductManager productsData = {productsData}/>
                </div>
                : selectedMenuItem === "order"
                ? <div>
                    <div className='flex justify-between mt-4 mb-8'>
                      <h1 className='text-3xl font-bold text-black'>Order Manager</h1>
                    </div>
                    <OrderManager 
                      ordersData={ordersData}
                      onStatusUpdate={handleOrderStatusUpdate}
                      onOrderDelete={handleOrderDelete}
                    />
                  </div>
                : <div>
                    <div className='flex justify-between mt-4 mb-8'>
                      <h1 className='text-3xl font-bold text-black'>Statistics Dashboard</h1>
                    </div>
                    <StatisticsManager statisticsData={statisticsData} />
                  </div>
              }
            </Content>
          </Layout>
        </Layout>
      </Layout>
  ))
}

export default AdminPage