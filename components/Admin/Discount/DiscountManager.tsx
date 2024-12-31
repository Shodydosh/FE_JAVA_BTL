import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, message, DatePicker, Select, InputNumber, Switch } from 'antd';
import type { Discount } from '../../../types/Discount'; // Đảm bảo bạn có định nghĩa kiểu cho Discount
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';

const DiscountManager: React.FC<{ discountsData: Discount[] }> = ({
    discountsData,
}) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingDiscount, setEditingDiscount] = useState<Discount | null>(
        null,
    );

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
            message.success('Mã giảm giá đã được xóa thành công');
            // Cập nhật lại danh sách mã giảm giá ở đây nếu cần
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
                await fetch(
                    `http://localhost:8080/api/discounts/${editingDiscount.id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formattedValues),
                    },
                );
                message.success('Mã giảm giá đã được cập nhật thành công');
            } else {
                // Tạo mã giảm giá mới
                await fetch(`http://localhost:8080/api/discounts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formattedValues),
                });
                message.success('Mã giảm giá đã được tạo thành công');
            }
            setVisible(false);
            form.resetFields();
            // Cập nhật lại danh sách mã giảm giá ở đây nếu cần
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
                <>
                    <Button onClick={() => handleEdit(record)}>
                        Sửa
                    </Button>
                    <Button
                        danger
                        onClick={() => handleDelete(record.id)}
                    >
                        Xóa
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={handleAdd}>
                Thêm mã giảm giá
            </Button>
            <Table
                dataSource={discountsData}
                rowKey="id"
                columns={columns}
            />
            <Modal
                title={editingDiscount ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá'}
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
                dataSource={discountsData}
                rowKey="id"
                columns={columns}
            />
            <Modal
                title={editingDiscount ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá'}
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item name="code" label="Mã" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="FIXED_AMOUNT">Giảm theo số tiền</Select.Option>
                            <Select.Option value="PERCENTAGE">Giảm theo phần trăm</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="value" label="Giá trị" rules={[{ required: true }]}>
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name="maxDiscountAmount" label="Giảm tối đa">
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name="minOrderAmount" label="Đơn hàng tối thiểu">
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name="maxUsage" label="Số lần sử dụng tối đa">
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        name="startDate"
                        label="Ngày bắt đầu"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn ngày bắt đầu!',
                            },
                        ]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        name="endDate"
                        label="Ngày kết thúc"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn ngày kết thúc!',
                            },
                        ]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingDiscount ? 'Cập nhật' : 'Tạo'}

                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DiscountManager;
