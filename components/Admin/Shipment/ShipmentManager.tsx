import React, { useState } from 'react';
import { Table, Select, message } from 'antd';
import dayjs from 'dayjs';

interface Shipment {
  id: string;
  trackingNumber: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  shippingFee: number;
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

enum ShipmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED'
}

interface ShipmentManagerProps {
  shipmentsData: Shipment[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, shipment: Shipment) => void;
  onStatusUpdate: (id: string, status: ShipmentStatus) => Promise<void>;
}

// Add this type for API error handling
interface ApiError {
  message: string;
  status: number;
}

const ShipmentManager: React.FC<ShipmentManagerProps> = ({ 
  shipmentsData: initialShipments,  // rename prop to indicate it's initial data
  onDelete, 
  onUpdate, 
  onStatusUpdate 
}) => {
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);

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

  const updateShipmentStatus = async (id: string, status: ShipmentStatus): Promise<Shipment> => {
    const response = await fetch(`/api/shipments/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(status)
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Lỗi khi cập nhật trạng thái');
    }

    return response.json();
  };

  const handleStatusChange = async (id: string, newStatus: ShipmentStatus) => {
    try {
      setUpdatingStatus(id);
      const updatedShipment = await updateShipmentStatus(id, newStatus);
      
      // Cập nhật state local
      setShipments(prevShipments => 
        prevShipments.map(shipment => 
          shipment.id === id ? updatedShipment : shipment
        )
      );
      
      await onStatusUpdate(id, newStatus);
      message.success('Cập nhật trạng thái thành công');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const columns = [
    {
      title: 'Mã vận chuyển',
      dataIndex: 'id',
      key: 'id',
      width: 180,
    },
    {
      title: 'Mã vận đơn',
      dataIndex: 'trackingNumber',
      key: 'trackingNumber',
      width: 150,
    },
    {
      title: 'Người nhận',
      key: 'recipient',
      width: 180,
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
      width: 250,
    },
    {
      title: 'Phí vận chuyển',
      dataIndex: 'shippingFee',
      key: 'shippingFee',
      width: 120,
      render: (fee: number) => `${fee.toLocaleString('vi-VN')}đ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status: ShipmentStatus, record: Shipment) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.id, value as ShipmentStatus)}
          style={{ width: 150 }}
          disabled={updatingStatus === record.id}
          loading={updatingStatus === record.id}
        >
          <Select.Option value={ShipmentStatus.PENDING}>Chờ xử lý</Select.Option>
          <Select.Option value={ShipmentStatus.CONFIRMED}>Đã xác nhận</Select.Option>
          <Select.Option value={ShipmentStatus.PROCESSING}>Đang xử lý</Select.Option>
          <Select.Option value={ShipmentStatus.SHIPPING}>Đang giao hàng</Select.Option>
          <Select.Option value={ShipmentStatus.DELIVERED}>Đã giao hàng</Select.Option>
          <Select.Option value={ShipmentStatus.CANCELLED}>Đã hủy</Select.Option>
          <Select.Option value={ShipmentStatus.RETURNED}>Đã hoàn trả</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Cập nhật lần cuối',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      width: 200,
      ellipsis: true,
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={shipments} // Sử dụng state thay vì prop
      rowKey="id"
      pagination={{ pageSize: 10 }}
      scroll={{ x: 1500 }}
    />
  );
};

export default ShipmentManager;
