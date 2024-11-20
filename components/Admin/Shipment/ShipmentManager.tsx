import React, { useState } from 'react';
import { Table, Tag, Space, Button, Modal, Select, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface ShipmentManagerProps {
  shipmentsData: any[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, shipment: any) => void;
  onStatusUpdate: (id: string, status: string) => void;
}

const ShipmentManager: React.FC<ShipmentManagerProps> = ({ 
  shipmentsData, 
  onDelete, 
  onUpdate, 
  onStatusUpdate 
}) => {
  const { confirm } = Modal;
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const showDeleteConfirm = (id: string) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa đơn vận chuyển này?',
      content: 'Hành động này không thể hoàn tác',
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      onOk() {
        onDelete(id);
      },
    });
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdatingStatus(id);
      await onStatusUpdate(id, newStatus);
      message.success('Cập nhật trạng thái thành công');
    } catch (error) {
      message.error('Không thể cập nhật trạng thái');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 220,
    },
    {
      title: 'Mã vận đơn',
      dataIndex: 'trackingNumber',
      key: 'trackingNumber',
    },
    {
      title: 'Người nhận',
      key: 'recipient',
      render: (record: any) => (
        <div>
          <div>{record.recipientName}</div>
          <div>{record.recipientPhone}</div>
        </div>
      ),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'shippingAddress',
      key: 'shippingAddress',
    },
    {
      title: 'Phí vận chuyển',
      dataIndex: 'shippingFee',
      key: 'shippingFee',
      render: (fee: number) => `${fee.toLocaleString('vi-VN')}đ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: any) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.id, value)}
          style={{ width: 120 }}
          disabled={updatingStatus === record.id}
          loading={updatingStatus === record.id}
        >
          <Select.Option value="PENDING">Chờ xử lý</Select.Option>
          <Select.Option value="IN_TRANSIT">Đang vận chuyển</Select.Option>
          <Select.Option value="DELIVERED">Đã giao hàng</Select.Option>
          <Select.Option value="CANCELLED">Đã hủy</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Cập nhật lần cuối',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />}
            onClick={() => onUpdate(record.id, record)}
          />
          <Button 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={shipmentsData}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      scroll={{ x: 1500 }}
    />
  );
};

export default ShipmentManager;
