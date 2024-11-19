import React, { useState } from 'react';
import { Table, Tag, Space, Button, Modal, Input } from 'antd';
import { SearchOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

// Update Order interface to match backend model
interface Order {
  id: string;
  user: {
    id: string;
  };
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

interface OrderManagerProps {
  ordersData: Order[];
}

interface OrderItem {
  id: string;
  product: {
    name: string;
    price: number;
    img_url: string; // Changed from imageUrl to img_url to match backend
  };
  quantity: number;
  price: number;
}

const OrderManager: React.FC<OrderManagerProps> = ({ ordersData }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOrderItems = async (orderId: string) => {
    setLoading(true);
    try {
      // Find and set the selected order
      const order = ordersData.find(o => o.id === orderId);
      setSelectedOrder(order || null);

      const response = await fetch(`http://localhost:8080/api/orderItems/order/${orderId}`);
      if (response.ok) {
        const items = await response.json();
        setSelectedOrderItems(items);
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
    setLoading(false);
  };

  const getColumnSearchProps = (dataIndex: keyof Order) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Tìm kiếm`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
          >
            Tìm
          </Button>
          <Button onClick={() => clearFilters()} size="small">
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: string, record: Order) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()) ?? false,
  });

  const columns: ColumnsType<Order> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      ...getColumnSearchProps('id'),
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
      ...getColumnSearchProps('customerName'),
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 120,
      ...getColumnSearchProps('phoneNumber'),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'shippingAddress',
      key: 'shippingAddress',
      width: 200,
      render: (address: string) => (
        <span style={{ maxWidth: 200, display: 'block', whiteSpace: 'normal' }}>
          {address}
        </span>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 150,
      render: (note: string) => (
        <span style={{ maxWidth: 150, display: 'block', whiteSpace: 'normal' }}>
          {note || '-'}
        </span>
      ),
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 150,
      filters: [
        { text: 'Tiền mặt', value: 'CASH' },
        { text: 'Thẻ', value: 'CARD' },
      ],
      onFilter: (value: string, record) => record.paymentMethod === value,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: 'descend'
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number) => `${amount.toLocaleString('vi-VN')}đ`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Chờ xử lý', value: 'PENDING' },
        { text: 'Hoàn thành', value: 'COMPLETED' },
        { text: 'Đã hủy', value: 'CANCELLED' },
      ],
      onFilter: (value: string, record) => record.status === value,
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
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (_: any, record: Order) => (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Button 
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => fetchOrderItems(record.id)}
            style={{ 
              backgroundColor: '#1890ff',
              borderColor: '#1890ff',
              width: '100%',
              height: '32px'
            }}
          />
          <Button 
            type="primary" 
            icon={<CheckCircleOutlined />}
            onClick={() => handleStatusUpdate(record.id, 'COMPLETED')}
            style={{
              backgroundColor: '#52c41a',
              borderColor: '#52c41a',
              width: '100%',
              height: '32px'
            }}
            disabled={record.status !== 'PENDING'}
          />
          <Button 
            type="primary"
            icon={<CloseCircleOutlined />}
            onClick={() => handleStatusUpdate(record.id, 'CANCELLED')}
            disabled={record.status !== 'PENDING'}
            style={{ 
              backgroundColor: '#f5222d',
              borderColor: '#f5222d',
              width: '100%',
              height: '32px'
            }}
          />
        </Space>
      ),
    },
  ];

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}/status?status=${status}`, {
        method: 'PUT',
      });
      if (response.ok) {
        // Refresh orders data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const orderItemColumns = [
    {
      title: 'Hình ảnh',
      dataIndex: ['product', 'img_url'], // Changed from imageUrl to img_url
      key: 'image',
      width: 80,
      render: (img_url: string) => (
        <img 
          src={img_url} 
          alt="Sản phẩm" 
          style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
        />
      ),
    },
    {
      title: 'Sản phẩm',
      dataIndex: ['product', 'name'],
      key: 'productName',
      width: 300,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number) => `${price.toLocaleString('vi-VN')}đ`,
    },
    {
      title: 'Thành tiền',
      key: 'total',
      width: 120,
      render: (record: OrderItem) => `${(record.price * record.quantity).toLocaleString('vi-VN')}đ`,
    },
  ];

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <>
      <Table 
        columns={columns} 
        dataSource={ordersData} 
        rowKey="id"
        scroll={{ x: 1500 }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
          style: { marginBottom: 16 }
        }}
      />
      <Modal
        title="Chi tiết đơn hàng"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={1000}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        {selectedOrder && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 8, marginBottom: 16 }}>
              Thông tin đơn hàng
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <p><strong>Mã đơn hàng:</strong> {selectedOrder.id}</p>
                <p><strong>Khách hàng:</strong> {selectedOrder.customerName}</p>
                <p><strong>Số điện thoại:</strong> {selectedOrder.phoneNumber}</p>
                <p><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress}</p>
              </div>
              <div>
                <p><strong>Ngày tạo:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p><strong>Phương thức thanh toán:</strong> {selectedOrder.paymentMethod}</p>
                {selectedOrder.cardNumber && (
                  <p><strong>Số thẻ:</strong> {selectedOrder.cardNumber}</p>
                )}
                {selectedOrder.cardHolder && (
                  <p><strong>Chủ thẻ:</strong> {selectedOrder.cardHolder}</p>
                )}
                <p><strong>Trạng thái:</strong> 
                  <Tag color={
                    selectedOrder.status === 'PENDING' ? 'gold' :
                    selectedOrder.status === 'COMPLETED' ? 'green' :
                    selectedOrder.status === 'CANCELLED' ? 'red' : 'blue'
                  } style={{ marginLeft: 8 }}>
                    {selectedOrder.status === 'PENDING' ? 'Chờ xử lý' :
                     selectedOrder.status === 'COMPLETED' ? 'Hoàn thành' :
                     selectedOrder.status === 'CANCELLED' ? 'Đã hủy' : selectedOrder.status}
                  </Tag>
                </p>
              </div>
            </div>
            {selectedOrder.note && (
              <div style={{ marginTop: 16 }}>
                <p><strong>Ghi chú:</strong></p>
                <p style={{ padding: 8, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                  {selectedOrder.note}
                </p>
              </div>
            )}
          </div>
        )}
        <h3 style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 8, marginBottom: 16 }}>
          Chi tiết sản phẩm
        </h3>
        <Table
          columns={orderItemColumns}
          dataSource={selectedOrderItems}
          rowKey="id"
          loading={loading}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}>
                  <strong>Tổng tiền</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <strong>{calculateTotal(selectedOrderItems).toLocaleString('vi-VN')}đ</strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Modal>
    </>
  );
};

export default OrderManager;
