'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Button, Radio, notification, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import Header from '@/components/Core/Header';

const PaymentPage = () => {
    // Khởi tạo các hooks cần thiết
    const [form] = Form.useForm();
    const router = useRouter();
    const [orderData, setOrderData] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Lấy dữ liệu đơn hàng từ localStorage khi component mount
    useEffect(() => {
        const savedOrder = localStorage.getItem('pendingOrder');
        if (!savedOrder) {
            router.push('/cart');
            return;
        }
        setOrderData(JSON.parse(savedOrder));
    }, [router]);

    // Xử lý submit form thanh toán
    const handleSubmit = async (values: any) => {
        try {
            setIsSubmitting(true);
            
            // Sửa lại cấu trúc dữ liệu orderItems
            const orderItems = orderData.items.map((item: any) => ({
                productId: item.productId, // Thay đổi từ product object sang productId
                quantity: item.quantity,
                price: item.price
            }));

            const finalOrderData = {
                orderItems: orderItems,
                totalAmount: orderData.totalAmount,
                shippingAddress: orderData.shippingAddress,
                phoneNumber: orderData.phoneNumber,
                paymentMethod: values.paymentMethod,
                cardNumber: values.paymentMethod === 'CARD' ? values.cardNumber : null,
                cardHolder: values.paymentMethod === 'CARD' ? values.cardHolder : null
            };

            // Gửi request tạo đơn hàng
            const response = await fetch('http://localhost:8080/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(finalOrderData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                // Log lỗi để debug
                console.error('Đặt hàng thất bại:', responseData);
                throw new Error(responseData.message || 'Đặt hàng thất bại');
            }

            // Xóa đơn hàng tạm thời
            localStorage.removeItem('pendingOrder');

            // Hiển thị thông báo thành công
            notification.success({
                message: 'Đặt hàng thành công',
                description: 'Cảm ơn bạn đã mua hàng!'
            });

            router.push('/');
        } catch (error) {
            console.error('Error details:', error);
            notification.error({
                message: 'Lỗi đặt hàng',
                description: error instanceof Error ? 
                    error.message : 
                    'Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng thử lại sau.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Hiển thị loading khi chưa có dữ liệu
    if (!orderData) {
        return <Spin />;
    }

    // Render giao diện thanh toán
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="mx-auto max-w-3xl px-4">
                    <div className="rounded-lg bg-white p-8 shadow">
                        <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>
                        
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                        >
                            <h3 className="text-lg font-semibold mb-4">Phương thức thanh toán</h3>
                            <Form.Item
                                name="paymentMethod"
                                rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán' }]}
                            >
                                <Radio.Group className="w-full">
                                    <div className="space-y-4">
                                        <Radio value="COD" className="w-full border p-4 rounded-lg">
                                            Thanh toán khi nhận hàng (COD)
                                        </Radio>
                                        <Radio value="CARD" className="w-full border p-4 rounded-lg">
                                            Thanh toán bằng thẻ
                                        </Radio>
                                    </div>
                                </Radio.Group>
                            </Form.Item>

                            {/* Form fields cho thanh toán bằng thẻ */}
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => 
                                    prevValues.paymentMethod !== currentValues.paymentMethod
                                }
                            >
                                {({ getFieldValue }) => 
                                    getFieldValue('paymentMethod') === 'CARD' ? (
                                        <div className="space-y-4">
                                            <Form.Item
                                                name="cardNumber"
                                                label="Số thẻ"
                                                rules={[{ required: true, message: 'Vui lòng nhập số thẻ' }]}
                                            >
                                                <Input placeholder="1234 5678 9012 3456" />
                                            </Form.Item>
                                            <Form.Item
                                                name="cardHolder"
                                                label="Tên chủ thẻ"
                                                rules={[{ required: true, message: 'Vui lòng nhập tên chủ thẻ' }]}
                                            >
                                                <Input placeholder="NGUYEN VAN A" />
                                            </Form.Item>
                                        </div>
                                    ) : null
                                }
                            </Form.Item>

                            {/* Hiển thị tổng tiền và nút đặt hàng */}
                            <div className="mt-6 border-t pt-6">
                                <div className="flex justify-between mb-2">
                                    <span>Tổng tiền hàng:</span>
                                    <span className="font-semibold">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(orderData.totalAmount)}
                                    </span>
                                </div>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    size="large"
                                >
                                    Hoàn tất đặt hàng
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentPage;
