'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Button, Radio, notification, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import Header from '@/components/Core/Header';
import emailjs from '@emailjs/browser';

const PaymentPage = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const [orderData, setOrderData] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const savedOrder = localStorage.getItem('pendingOrder');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userIdFromStorage = userData.id;

        
        if (!savedOrder) {
            router.push('/cart');
            return;
        }
        if (!userIdFromStorage) {
            router.push('/login');
            return;
        }
        
        setUserId(userIdFromStorage);
        setOrderData(JSON.parse(savedOrder));
    }, [router]);

    const sendOrderNotificationToAdmin = async (orderData: any) => {
        try {
            const templateParams = {
                order_number: orderData.orderId,
                order_total: new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                }).format(orderData.totalAmount),
                customer_name: orderData.customerName || 'Khách hàng',
                shipping_address: orderData.shippingAddress,
                phone_number: orderData.phoneNumber,
                payment_method: orderData.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Thanh toán thẻ',
                order_items: orderData.orderItems.map((item: any) => 
                    `${item.productId} - SL: ${item.quantity} - Giá: ${new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    }).format(item.price)}`
                ).join('\n')
            };

            const result = await emailjs.send(
                'service_zbhd07p',
                'template_r6aj2sh',
                templateParams,
                'GMDxfdGqL-yu58YOF',
            );
            
            console.log('Admin notification email sent successfully:', result);
        } catch (error) {
            console.error('Error sending admin notification:', error);
        }
    };

    const createShipment = async (orderId: string, orderData: any) => {
        try {
            const shipmentPayload = {
                trackingNumber: `SHIP-${Date.now()}`,
                recipientName: orderData.customerName,
                recipientPhone: orderData.phoneNumber,
                shippingAddress: orderData.shippingAddress,
                notes: orderData.note || '',
                shippingFee: 0,
                status: 'PENDING',
                order: { id: orderId }
            };

            const response = await fetch('http://localhost:8080/api/shipments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(shipmentPayload),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Shipment creation failed: ${errorData}`);
            }

            const data = await response.json();
            if (!data) {
                throw new Error('No data received from shipment creation');
            }

            return data;
        } catch (error) {
            console.error('Shipment creation error:', error);
            throw new Error(error instanceof Error ? error.message : 'Failed to create shipment');
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            setIsSubmitting(true);

            const orderPayload = {
                totalAmount: orderData.totalAmount,
                shippingAddress: orderData.shippingAddress,
                phoneNumber: orderData.phoneNumber,
                customerName: orderData.customerName,
                note: orderData.note,
                paymentMethod: values.paymentMethod,
                cardNumber: values.paymentMethod === 'CARD' ? values.cardNumber : null,
                cardHolder: values.paymentMethod === 'CARD' ? values.cardHolder : null,
                status: 'PENDING',
                user: { id: userId }  // Add user information
            };

            const orderResponse = await fetch('http://localhost:8080/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(orderPayload),
            });

            const orderResponseData = await orderResponse.json();

            if (!orderResponse.ok) {
                throw new Error(orderResponseData.message || 'Failed to create order');
            }

            let shipmentResult;
            try {
                shipmentResult = await createShipment(orderResponseData.id, orderData);
                console.log('Shipment created:', shipmentResult);
            } catch (shipmentError) {
                console.error('Shipment creation failed:', shipmentError);
                // Continue with the order process even if shipment creation fails
            }

            const orderItemsPromises = orderData.items.map(async (item: any) => {
                const orderItemPayload = {
                    order: { id: orderResponseData.id },
                    product: { id: item.productId },
                    quantity: item.quantity,
                    price: item.price
                };

                return fetch('http://localhost:8080/api/orderItems', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(orderItemPayload),
                });
            });

            await Promise.all(orderItemsPromises);

            await sendOrderNotificationToAdmin({
                ...orderPayload,
                orderId: orderResponseData.id,
                orderItems: orderData.items
            });

            // Clear the cart
            const cartResponse = await fetch('http://localhost:8080/api/cart/59cd9ce2-1b15-4fe9-a775-9169fc90c907/clear', {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!cartResponse.ok) {
                console.error('Failed to clear cart');
            }

            localStorage.removeItem('pendingOrder');
            notification.success({
                message: 'Đặt hàng thành công',
                description: 'Đơn hàng và vận chuyển đã được tạo. Email xác nhận đã được gửi.'
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

    if (!orderData) {
        return <Spin />;
    }

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
