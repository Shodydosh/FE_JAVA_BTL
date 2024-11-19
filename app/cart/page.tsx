'use client';

import { useEffect, useMemo, useState } from 'react';
import CartDetailItem from './_components/CartDetailItem';
import { Button, Modal, Form, Input, notification, Spin } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Header from '@/components/Core/Header';

// ...existing CartItem interface...

interface CartItem {
    id: string;
    retailer: string;
    img_url: string;
    name: string;
    price: number;
    url: string;
    category: string;
}

interface PaymentFormData {
    fullName: string;
    phone: string;
    address: string;
    note?: string;
}

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form] = Form.useForm();
    const router = useRouter();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/cartitems/59cd9ce2-1b15-4fe9-a775-9169fc90c907', {
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch cart items');
                }
                const data = await response.json();
                // Wrap the single item in an array if the API returns a single object
                setCartItems(Array.isArray(data) ? data : [data]);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const groupedCartItems = useMemo(() => {
        const grouped = cartItems.reduce((acc, item) => {
            const key = item.id;
            if (!acc[key]) {
                acc[key] = {
                    ...item,
                    quantity: 1
                };
            } else {
                acc[key].quantity += 1;
            }
            return acc;
        }, {} as Record<string, CartItem & { quantity: number }>);
        
        return Object.values(grouped);
    }, [cartItems]);

    const calcTotalPrice = useMemo(() => {
        return groupedCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [groupedCartItems]);

    const calcTotalQuantity = useMemo(() => {
        return groupedCartItems.reduce((total, item) => total + item.quantity, 0);
    }, [groupedCartItems]);

   

    const removeHandler = async (id: string) => {
        const filteredCart = cartItems.filter((x) => x.id !== id);
        setCartItems(filteredCart);
    };

    const handleQuantityChange = (newQuantity: number, itemId: string) => {
        setCartItems(prevItems => {
            const targetItem = prevItems.find(item => item.id === itemId);
            if (!targetItem) return prevItems;

            // Remove all instances of this item
            const filteredItems = prevItems.filter(item => item.id !== itemId);
            
            // Add back the correct number of instances
            const newItems = [...filteredItems];
            for (let i = 0; i < newQuantity; i++) {
                newItems.push({ ...targetItem });
            }
            
            return newItems;
        });
    };

    const checkoutHandler = () => {
        setIsModalOpen(true);
    };

    const handleModalOk = async () => {
        try {
            setIsSubmitting(true);
            const values = await form.validateFields();
            
            // Prepare order data
            const orderData = {
                ...values,
                userId: 'a08f9e729dd84ea9b6606cb4dfabd97a', // Default userId
                phoneNumber: values.phone,
                shippingAddress: values.address,
                items: groupedCartItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                })),
                totalAmount: calcTotalPrice,
                totalQuantity: calcTotalQuantity,
            };

            // Call API to submit order
            const response = await fetch('http://localhost:8080/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error('Đặt hàng thất bại');
            }

            const createdOrder = await response.json();

            notification.success({
                message: 'Đặt hàng thành công',
                description: 'Cảm ơn bạn đã mua hàng!'
            });
            setCartItems([]); // Clear cart
            setIsModalOpen(false);
            form.resetFields();
            
            // Redirect to order details page
            router.push(`/orders/${createdOrder.id}`);
            
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: error instanceof Error ? error.message : 'Đặt hàng thất bại'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    if (isLoading) {
        return <div className="p-10">Đang tải giỏ hàng...</div>;
    }

    if (!cartItems.length) {
        return (
            <div className="p-10">
                Không tìm thấy sản phẩm nào trong giỏ hàng
            </div>
        );
    }

    return (
        <>
        <Header />
        <div className="mx-auto max-w-6xl px-4">
            <div className="mt-4 flex justify-center border-b text-[18px]">
                <span className="mb-2 font-semibold" style={{ color: '#1890ff' }}>
                    Giỏ hàng của bạn
                </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                    <div className="rounded-md border bg-white shadow">
                        {groupedCartItems.map((item) => (
                            <CartDetailItem
                                key={item.id}
                                cart={item}
                                onRemove={removeHandler}
                                onQuantityChange={(qty) => handleQuantityChange(qty, item.id)}
                            />
                        ))}
                    </div>
                </div>

                <div className="sticky top-4 h-fit rounded-md border bg-white p-4 shadow">
                    <h3 className="mb-4 text-lg font-semibold">Tổng đơn hàng</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Số lượng:</span>
                            <span>{calcTotalQuantity}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                            <span>Tổng tiền:</span>
                            <span className="text-lg font-bold text-red-500">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(calcTotalPrice)}
                            </span>
                        </div>
                    </div>
                    <Button 
                        size="large" 
                        className="mt-4 w-full bg-blue-500 text-white hover:!bg-green-500 hover:!text-white"
                        onClick={checkoutHandler}
                    >
                        Thanh toán
                    </Button>
                </div>
            </div>

            <Modal 
                title="Thông tin thanh toán" 
                open={isModalOpen} 
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Đặt hàng"
                cancelText="Hủy"
                width={600}
                confirmLoading={isSubmitting}
                okButtonProps={{
                    style: { 
                        backgroundColor: '#4caf50',
                        borderColor: '#4caf50'
                    }
                }}
            >
                <Spin spinning={isSubmitting}>
                    <Form
                        form={form}
                        layout="vertical"
                        className="mt-4"
                    >
                        <Form.Item
                            name="fullName"
                            label="Họ và tên"
                            rules={[
                                { required: true, message: 'Vui lòng nhập họ tên' },
                                { min: 3, message: 'Họ tên phải có ít nhất 3 ký tự' }
                            ]}
                        >
                            <Input placeholder="Nhập họ và tên" />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại' },
                                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                            ]}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                        <Form.Item
                            name="address"
                            label="Địa chỉ"
                            rules={[
                                { required: true, message: 'Vui lòng nhập địa chỉ' },
                                { min: 10, message: 'Địa chỉ phải có ít nhất 10 ký tự' }
                            ]}
                        >
                            <Input.TextArea 
                                rows={3} 
                                placeholder="Nhập địa chỉ đầy đủ (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                            />
                        </Form.Item>
                        <Form.Item
                            name="note"
                            label="Ghi chú"
                        >
                            <Input.TextArea 
                                rows={2} 
                                placeholder="Ghi chú thêm về đơn hàng (không bắt buộc)"
                            />
                        </Form.Item>

                        <div className="mt-4 border-t pt-4">
                            <div className="flex justify-between text-base">
                                <span className="font-medium">Thông tin đơn hàng:</span>
                            </div>
                            <div className="mt-2 space-y-2">
                                <div className="flex justify-between">
                                    <span>Tổng số lượng:</span>
                                    <span className="font-medium">{calcTotalQuantity} sản phẩm</span>
                                </div>
                                <div className="flex justify-between border-t pt-2">
                                    <span>Tổng tiền:</span>
                                    <span className="text-lg font-bold text-red-500">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(calcTotalPrice)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Spin>
            </Modal>
        </div>
        </>
    );
};

export default CartPage;
