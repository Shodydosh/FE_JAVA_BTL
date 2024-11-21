import React, { useState } from 'react';
import { Table, Tag, Space, Button, Modal, Input, message, Tooltip } from 'antd';
import { SearchOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

// Update Shipment interface to match backend model
interface Shipment {
  id: string;
  trackingNumber: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  notes: string;
  shippingFee: number;
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
}

// Update ShipmentStatus enum to match backend
type ShipmentStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

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
  shipmentId: string;
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

interface OrderDetails {
  order: Order;
  shipment: Shipment;
  orderItems: OrderItem[];
}

const OrderManager: React.FC<OrderManagerProps> = ({ ordersData }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState<string>('');

  const fetchOrderItems = async (orderId: string) => {
    setLoading(true);
    try {
      const order = ordersData.find(o => o.id === orderId);
      setSelectedOrder(order || null);

      // Fetch both order items and shipment details
      const [itemsResponse, shipmentResponse] = await Promise.all([
        fetch(`http://localhost:8080/api/orderItems/order/${orderId}`),
        fetch(`http://localhost:8080/api/shipments/order/${orderId}`)
      ]);

      if (itemsResponse.ok && shipmentResponse.ok) {
        const items = await itemsResponse.json();
        const shipments = await shipmentResponse.json();
        
        // Assuming one shipment per order, take the first one
        const shipment = shipments[0];
        
        setSelectedOrderItems(items);
        setSelectedOrder(prev => prev ? {...prev, shipmentId: shipment.id} : null);
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      message.error('Lỗi khi tải thông tin đơn hàng');
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'APPROVED': return 'Đã duyệt';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'gold';
      case 'APPROVED': return 'blue';
      case 'COMPLETED': return 'green';
      case 'CANCELLED': return 'red';
      default: return 'default';
    }
  };

  const updateShipmentStatus = async (id: string, status: ShipmentStatus): Promise<Shipment> => {
    const response = await fetch(`http://localhost:8080/api/shipments/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(status)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Lỗi khi cập nhật trạng thái vận chuyển');
    }

    return response.json();
  };

  const handleStatusUpdate = async (orderId: string, orderStatus: string) => {
    setStatusLoading(orderId);
    try {
      // First, get the shipment for this order
      const shipmentResponse = await fetch(`http://localhost:8080/api/shipments/order/${orderId}`);
      if (!shipmentResponse.ok) {
        throw new Error('Không tìm thấy thông tin vận chuyển');
      }
      const shipments = await shipmentResponse.json();
      const shipment = shipments[0]; // Assuming one shipment per order

      if (!shipment) {
        throw new Error('Không tìm thấy thông tin vận chuyển');
      }

      // Update order status
      const orderResponse = await fetch(`http://localhost:8080/api/orders/${orderId}/status?status=${orderStatus}`, {
        method: 'PUT',
      });

      if (!orderResponse.ok) {
        throw new Error('Lỗi khi cập nhật trạng thái đơn hàng');
      }

      // Map order status to shipment status
      let shipmentStatus: ShipmentStatus;
      switch (orderStatus) {
        case 'APPROVED':
          shipmentStatus = 'CONFIRMED';
          break;
        case 'CANCELLED':
          shipmentStatus = 'CANCELLED';
          break;
        case 'COMPLETED':
          shipmentStatus = 'DELIVERED';
          break;
        default:
          shipmentStatus = 'PENDING';
      }

      await updateShipmentStatus(shipment.id, shipmentStatus);
      message.success('Cập nhật trạng thái thành công');
      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
      message.error(error instanceof Error ? error.message : 'Lỗi khi cập nhật trạng thái');
    } finally {
      setStatusLoading('');
    }
  };

  const styles = {
    table: {
      '.ant-table': {
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      '.ant-table-thead > tr > th': {
        backgroundColor: '#f7f7f7',
        fontWeight: 600,
      }
    },
    actionButton: {
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    modalContent: {
      orderInfo: {
        marginBottom: 24,
        borderBottom: '1px solid #f0f0f0',
        padding: '16px 0'
      },
      grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        marginBottom: 16
      },
      note: {
        padding: '12px',
        backgroundColor: '#f5f5f5',
        borderRadius: '6px',
        marginTop: '8px'
      },
      section: {
        marginBottom: '24px'
      }
    }
  };

  const ActionButtons: React.FC<{ record: Order }> = ({ record }) => (
    <Space size="small">
      <Tooltip title="Xem chi tiết">
        <Button 
          type="primary"
          onClick={() => fetchOrderItems(record.id)}
          style={styles.actionButton}
        >
          <EyeOutlined /> Chi tiết
        </Button>
      </Tooltip>
      {record.status === 'PENDING' && (
        <Button 
          type="primary"
          loading={statusLoading === record.id}
          onClick={() => handleStatusUpdate(record.id, 'APPROVED')}
          style={styles.actionButton}
        >
          <CheckCircleOutlined /> Duyệt
        </Button>
      )}
      {record.status === 'APPROVED' && (
        <Button 
          type="primary"
          style={{ ...styles.actionButton, backgroundColor: '#52c41a' }}
          loading={statusLoading === record.id}
          onClick={() => handleStatusUpdate(record.id, 'COMPLETED')}
        >
          <CheckCircleOutlined /> Hoàn thành
        </Button>
      )}
      {(record.status === 'PENDING' || record.status === 'APPROVED') && (
        <Button 
          danger
          type="primary"
          loading={statusLoading === record.id}
          onClick={() => handleStatusUpdate(record.id, 'CANCELLED')}
          style={styles.actionButton}
        >
          <CloseCircleOutlined /> Hủy
        </Button>
      )}
    </Space>
  );

  const OrderDetailsModal: React.FC = () => (
    <Modal
      title={<h3>Chi tiết đơn hàng</h3>}
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
      width={800}
    >
      {selectedOrder && (
        <>
          <div style={styles.modalContent.section}>
            <h4>Thông tin đơn hàng</h4>
            <div style={styles.modalContent.grid}>
              <div>
                <p><strong>Mã đơn hàng:</strong> {selectedOrder.id}</p>
                <p><strong>Khách hàng:</strong> {selectedOrder.customerName}</p>
                <p><strong>Số điện thoại:</strong> {selectedOrder.phoneNumber}</p>
                <p><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress}</p>
              </div>
              <div>
                <p><strong>Ngày tạo:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p><strong>Thanh toán:</strong> {selectedOrder.paymentMethod}</p>
                {selectedOrder.cardNumber && <p><strong>Số thẻ:</strong> {selectedOrder.cardNumber}</p>}
                {selectedOrder.cardHolder && <p><strong>Chủ thẻ:</strong> {selectedOrder.cardHolder}</p>}
                {renderOrderStatus(selectedOrder.status)}
              </div>
            </div>
            {selectedOrder.note && (
              <div style={styles.modalContent.note}>
                <strong>Ghi chú:</strong> {selectedOrder.note}
              </div>
            )}
          </div>
          <div style={styles.modalContent.section}>
            <h4>Chi tiết sản phẩm</h4>
            <Table
              columns={orderItemColumns}
              dataSource={selectedOrderItems}
              rowKey="id"
              loading={loading}
              pagination={false}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4}>
                      <strong>Tổng tiền:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <strong>{calculateTotal(selectedOrderItems).toLocaleString('vi-VN')}đ</strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </div>
        </>
      )}
    </Modal>
  );

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
        { text: 'Đã duyệt', value: 'APPROVED' },
        { text: 'Hoàn thành', value: 'COMPLETED' },
        { text: 'Đã hủy', value: 'CANCELLED' },
      ],
      onFilter: (value: string, record) => record.status === value,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record: Order) => <ActionButtons record={record} />,
    },
  ];

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

  const renderOrderStatus = (status: string) => (
    <p>
      <strong>Trạng thái:</strong> 
      <Tag color={getStatusColor(status)} style={{ marginLeft: 8 }}>
        {getStatusLabel(status)}
      </Tag>
    </p>
  );

  return (
    <>
      <Table 
        columns={columns} 
        dataSource={ordersData} 
        rowKey="id"
        scroll={{ x: 1200 }}
        style={styles.table}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`
        }}
      />
      <OrderDetailsModal />
    </>
  );
};

export default OrderManager;
