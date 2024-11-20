import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, DatePicker, Select, Space } from 'antd';
import { UserOutlined, ShoppingOutlined, DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    img_url: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  user: {
    id: string;
  };
  totalAmount: number;
  customerName: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  orderItems: OrderItem[];
}

interface PopularProduct {
  id: string;
  name: string;
  img_url: string;
  salesCount: number;
  revenue: number;
}

interface StatisticsProps {
  statisticsData: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    popularProducts: any[];
  };
}

const StatisticsManager: React.FC<StatisticsProps> = ({ statisticsData }) => {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [quarter, setQuarter] = useState<string>('all');
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
  const [productShareData, setProductShareData] = useState<any[]>([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const filterOrdersByDate = (orders: Order[], startDate: Date | null, endDate: Date | null) => {
    if (!startDate || !endDate) return orders;
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });
  };

  const filterOrdersByQuarter = (orders: Order[], selectedQuarter: string) => {
    if (selectedQuarter === 'all') return orders;
    
    const currentYear = new Date().getFullYear();
    const quarters = {
      'Q1': [0, 1, 2],
      'Q2': [3, 4, 5],
      'Q3': [6, 7, 8],
      'Q4': [9, 10, 11]
    };
    
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return quarters[selectedQuarter as keyof typeof quarters].includes(orderDate.getMonth());
    });
  };

  const prepareChartData = (orders: Order[]) => {
    // Dữ liệu doanh thu theo thời gian
    const revenueByDate = orders.reduce((acc: any, order) => {
      const date = new Date(order.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + order.totalAmount;
      return acc;
    }, {});

    const revenueChartData = Object.entries(revenueByDate).map(([date, amount]) => ({
      date,
      revenue: amount,
    }));

    // Dữ liệu đơn hàng theo trạng thái
    const ordersByStatus = orders.reduce((acc: any, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const statusChartData = Object.entries(ordersByStatus).map(([status, count]) => ({
      status: status === 'PENDING' ? 'Chờ xử lý' :
              status === 'COMPLETED' ? 'Hoàn thành' :
              status === 'CANCELLED' ? 'Đã hủy' : status,
      count,
    }));

    // Dữ liệu tỷ lệ sản phẩm bán chạy
    const productShareChartData = popularProducts.map(product => ({
      name: product.name,
      value: product.salesCount,
    }));

    setRevenueData(revenueChartData);
    setOrderStatusData(statusChartData);
    setProductShareData(productShareChartData);
  };

  useEffect(() => {
    const fetchRecentOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/orders/all', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (response.ok) {
          const data: Order[] = await response.json();
          setAllOrders(data);
          
          // Áp dụng các bộ lọc
          let filteredOrders = data;
          if (dateRange[0] && dateRange[1]) {
            filteredOrders = filterOrdersByDate(filteredOrders, dateRange[0], dateRange[1]);
          }
          filteredOrders = filterOrdersByQuarter(filteredOrders, quarter);
          
          const sortedOrders = filteredOrders
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
          
          setRecentOrders(sortedOrders);
          
          // Tính toán doanh thu từ đơn hàng đã lọc
          const revenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
          setTotalRevenue(revenue);

          // Tính toán sản phẩm bán chạy từ đơn hàng đã lọc
          const productStats = new Map<string, PopularProduct>();
          
          filteredOrders.forEach(order => {
            order.orderItems.forEach(item => {
              const product = item.product;
              const existingStat = productStats.get(product.id) || {
                id: product.id,
                name: product.name,
                img_url: product.img_url,
                salesCount: 0,
                revenue: 0
              };

              existingStat.salesCount += item.quantity;
              existingStat.revenue += item.quantity * item.price;
              
              productStats.set(product.id, existingStat);
            });
          });

          const popularProductsArray = Array.from(productStats.values())
            .sort((a, b) => b.salesCount - a.salesCount)
            .slice(0, 5);

          setPopularProducts(popularProductsArray);
          prepareChartData(filteredOrders);
        } else {
          console.error('Failed to fetch orders:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
      setLoading(false);
    };

    fetchRecentOrders();
  }, [dateRange, quarter]); // Thêm dependencies

  const productColumns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số lượng đã bán',
      dataIndex: 'salesCount',
      key: 'salesCount',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value: number) => `${value.toLocaleString('vi-VN')}đ`,
    },
  ];

  const orderColumns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `${amount.toLocaleString('vi-VN')}đ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'PENDING' ? 'gold' :
          status === 'COMPLETED' ? 'green' :
          status === 'CANCELLED' ? 'red' : 'blue'
        }>
          {status === 'PENDING' ? 'Chờ xử lý' :
           status === 'COMPLETED' ? 'Hoàn thành' :
           status === 'CANCELLED' ? 'Đã hủy' : status}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  const renderCharts = () => (
    <Row gutter={16} style={{ marginTop: '24px' }}>
      <Col span={24}>
        <Card title="Biểu đồ doanh thu theo thời gian">
          <LineChart width={1100} height={300} data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString('vi-VN')}đ`} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#8884d8" 
              name="Doanh thu"
            />
          </LineChart>
        </Card>
      </Col>

      <Col span={12} style={{ marginTop: '24px' }}>
        <Card title="Thống kê trạng thái đơn hàng">
          <BarChart width={500} height={300} data={orderStatusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="count" 
              fill="#82ca9d" 
              name="Số lượng"
            />
          </BarChart>
        </Card>
      </Col>

      <Col span={12} style={{ marginTop: '24px' }}>
        <Card title="Tỷ lệ sản phẩm bán chạy">
          <PieChart width={500} height={300}>
            <Pie
              data={productShareData}
              cx={250}
              cy={150}
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {productShareData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </Card>
      </Col>
    </Row>
  );

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card>
            <Space size="large">
              <div>
                <span style={{ marginRight: '8px' }}>Khoảng thời gian:</span>
                <RangePicker
                  onChange={(dates) => {
                    setDateRange(dates ? [dates[0]?.toDate() || null, dates[1]?.toDate() || null] : [null, null]);
                  }}
                />
              </div>
              <div>
                <span style={{ marginRight: '8px' }}>Quý:</span>
                <Select
                  defaultValue="all"
                  style={{ width: 120 }}
                  onChange={setQuarter}
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="Q1">Quý 1</Option>
                  <Option value="Q2">Quý 2</Option>
                  <Option value="Q3">Quý 3</Option>
                  <Option value="Q4">Quý 4</Option>
                </Select>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={statisticsData.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số sản phẩm"
              value={statisticsData.totalProducts}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số đơn hàng"
              value={statisticsData.totalOrders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              formatter={(value) => `${value.toLocaleString('vi-VN')}đ`}
            />
          </Card>
        </Col>
      </Row>

      {renderCharts()}

      <Row gutter={16} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card title="Sản phẩm bán chạy">
            <Table 
              dataSource={popularProducts}
              columns={productColumns}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Đơn hàng gần đây">
            <Table 
              dataSource={recentOrders}
              columns={orderColumns}
              pagination={false}
              size="small"
              rowKey="id"
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsManager;
