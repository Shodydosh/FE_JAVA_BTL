import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, message, DatePicker, Select, InputNumber, Switch } from 'antd';
import type { Discount } from '../../../types/Discount';
import moment from 'moment';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const DiscountManager: React.FC<{ discountsData: Discount[] }> = ({
    discountsData,
}) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingDiscount, setEditingDiscount] = useState<Discount | null>(
        null,
    );
    const [discounts, setDiscounts] = useState<Discount[]>(discountsData);

    const handleAdd = () => {
        setEditingDiscount(null);
        form.resetFields();
        setVisible(true);
    };

    const handleEdit = (discount: Discount) => {
        setEditingDiscount(discount);
        form.setFieldsValue({
            ...discount,
            startDate: moment(discount.startDate),
            endDate: moment(discount.endDate),
        });
        setVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`http://localhost:8080/api/discounts/${id}`, {
                method: 'DELETE',
            });
            // Update local state immediately after successful deletion
            setDiscounts(prevDiscounts => prevDiscounts.filter(discount => discount.id !== id));
            message.success('Mã giảm giá đã được xóa thành công');
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa mã giảm giá');
        }
    };

    const handleSubmit = async (values: Discount) => {
        try {
            const formattedValues = {
                ...values,
                startDate: values.startDate?.toISOString(),
                endDate: values.endDate?.toISOString(),
            };

            if (editingDiscount) {
                // Cập nhật mã giảm giá
                const response = await fetch(
                    `http://localhost:8080/api/discounts/${editingDiscount.id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formattedValues),
                    },
                );
                const updatedDiscount = await response.json();
                // Update local state with the updated discount
                setDiscounts(prevDiscounts =>
                    prevDiscounts.map(discount =>
                        discount.id === editingDiscount.id ? updatedDiscount : discount
                    )
                );
                message.success('Mã giảm giá đã được cập nhật thành công');
            } else {
                // Tạo mã giảm giá mới
                const response = await fetch(`http://localhost:8080/api/discounts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formattedValues),
                });
                const newDiscount = await response.json();
                // Add new discount to local state
                setDiscounts(prevDiscounts => [...prevDiscounts, newDiscount]);
                message.success('Mã giảm giá đã được tạo thành công');
            }
            setVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Có lỗi xảy ra khi lưu mã giảm giá');
        }
    };

    const columns = [
        { title: 'Mã', dataIndex: 'code', key: 'code' },
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        { 
            title: 'Loại', 
            dataIndex: 'type', 
            key: 'type',
            render: (type: string) => type === 'FIXED_AMOUNT' ? 'Giảm theo số tiền' : 'Giảm theo phần trăm'
        },
        { 
            title: 'Giá trị', 
            dataIndex: 'value', 
            key: 'value',
            render: (value: number, record: Discount) => 
                record.type === 'FIXED_AMOUNT' ? `${value.toLocaleString()} VNĐ` : `${value}%`
        },
        { 
            title: 'Giảm tối đa', 
            dataIndex: 'maxDiscountAmount', 
            key: 'maxDiscountAmount',
            render: (value: number) => value ? `${value.toLocaleString()} VNĐ` : 'Không giới hạn'
        },
        { 
            title: 'Đơn hàng tối thiểu', 
            dataIndex: 'minOrderAmount', 
            key: 'minOrderAmount',
            render: (value: number) => value ? `${value.toLocaleString()} VNĐ` : 'Không giới hạn'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (active: boolean) => active ? 'Đang hoạt động' : 'Đã khóa'
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date) => moment(date).format('YYYY-MM-DD'),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date) => moment(date).format('YYYY-MM-DD'),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div className="space-x-2">
                    <Button
                        type="primary"
                        ghost
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        className="hover:scale-105 transition-transform"
                    >
                        Sửa
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                        className="hover:scale-105 transition-transform"
                    >
                        Xóa
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Quản lý mã giảm giá</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                    className="hover:scale-105 transition-transform bg-[#1890ff]"
                    size="large"
                >
                    Thêm mã giảm giá
                </Button>
            </div>

            <Table
                dataSource={discounts} // Use local state instead of props
                rowKey="id"
                columns={columns}
                className="shadow-sm rounded-lg"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
                }}
            />

            <Modal
                title={
                    <span className="text-lg font-semibold">
                        {editingDiscount ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá'}
                    </span>
                }
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
                className="rounded-lg"
                width={600}
            >
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    className="space-y-4"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="code" label="Mã" rules={[{ required: true }]}>
                            <Input className="rounded-md" />
                        </Form.Item>
                        <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
                            <Input className="rounded-md" />
                        </Form.Item>
                    </div>

                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea className="rounded-md" rows={4} />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
                            <Select className="rounded-md">
                                <Select.Option value="FIXED_AMOUNT">Giảm theo số tiền</Select.Option>
                                <Select.Option value="PERCENTAGE">Giảm theo phần trăm</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="value" label="Giá trị" rules={[{ required: true }]}>
                            <InputNumber min={0} className="w-full rounded-md" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="maxDiscountAmount" label="Giảm tối đa">
                            <InputNumber min={0} className="w-full rounded-md" />
                        </Form.Item>
                        <Form.Item name="minOrderAmount" label="Đơn hàng tối thiểu">
                            <InputNumber min={0} className="w-full rounded-md" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            name="startDate"
                            label="Ngày bắt đầu"
                            rules={[{ required: true }]}
                        >
                            <DatePicker className="w-full rounded-md" />
                        </Form.Item>
                        <Form.Item
                            name="endDate"
                            label="Ngày kết thúc"
                            rules={[{ required: true }]}
                        >
                            <DatePicker className="w-full rounded-md" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="maxUsage" label="Số lần sử dụng tối đa">
                            <InputNumber min={0} className="w-full rounded-md" />
                        </Form.Item>
                        <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </div>

                    <Form.Item className="flex justify-end mb-0">
                        <Button
                            type="default"
                            onClick={() => setVisible(false)}
                            className="mr-2"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="hover:scale-105 transition-transform bg-[#1890ff]"
                        >
                            {editingDiscount ? 'Cập nhật' : 'Tạo'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DiscountManager;
