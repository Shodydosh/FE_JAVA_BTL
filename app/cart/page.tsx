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

interface OrderData {
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
    phoneNumber: string;
    shippingAddress: string;
    customerName: string;
    note?: string;
}

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form] = Form.useForm();
    const router = useRouter();
    const [cartId, setCartId] = useState<string | null>(null);

    const getCartId = async (userId: string) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/cart/user/${userId}`,
                {
                    credentials: 'include',
                }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }
            const cartData = await response.json();
            console.log('cartData: ', cartData);
            // cartData is now a Cart object with id property
            return cartData.id;
        } catch (error) {
            console.error('Error fetching cart:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const userId = userData.id;
                if (!userId) {
                    notification.error({
                        message: 'Chưa đăng nhập',
                        description: 'Vui lòng đăng nhập để xem giỏ hàng',
                    });
                    router.push('/login');
                    return;
                }

                const cartId = await getCartId(userId);
                console.log('cartId: ', cartId);
                if (!cartId) {
                    setIsLoading(false);
                    return;
                }
                
                setCartId(cartId);

                const response = await fetch(
                    `http://localhost:8080/api/cartitems/${cartId}`,
                    {
                        credentials: 'include',
                    }
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch cart items');
                }
                const data = await response.json();
                setCartItems(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching cart data:', error);
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải thông tin giỏ hàng'
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchCart();
    }, [router]);

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
        try {
            if (!cartId) return;

            const response = await fetch(
                `http://localhost:8080/api/cartitems/delete/${cartId}/${id}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                }
            );
            if (!response.ok) {
                throw new Error('Failed to delete cart item');
            }
            const filteredCart = cartItems.filter((x) => x.id !== id);
            setCartItems(filteredCart);
        } catch (error) {
            console.error('Error deleting cart item:', error);
        }
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
            
            const orderData: OrderData = {
                items: groupedCartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: calcTotalPrice,
                phoneNumber: values.phone,
                shippingAddress: values.address,
                customerName: values.fullName,
                note: values.note // Thêm note vào đây
            };

            localStorage.setItem('pendingOrder', JSON.stringify(orderData));
            router.push('/payment');
            
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: error instanceof Error ? error.message : 'Có lỗi xảy ra'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="flex items-center justify-center">
                            <Spin size="large" />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (!cartItems.length) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="rounded-lg bg-white p-8 text-center shadow">
                            <h2 className="mb-4 text-2xl font-semibold text-gray-800">Giỏ hàng trống</h2>
                            <p className="mb-6 text-gray-600">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
                            <Button 
                                size="large"
                                type="primary"
                                onClick={() => router.push('/')}
                            >
                                Tiếp tục mua sắm
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="mx-auto max-w-7xl px-4">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Giỏ hàng</h1>
                        <div className="mt-2 text-sm text-gray-500">
                            Trang chủ / Giỏ hàng
                        </div>
                    </div>

                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-8">
                            <div className="rounded-lg bg-white shadow">
                                <div className="p-6">
                                    <h2 className="mb-4 text-lg font-medium text-gray-900">
                                        Sản phẩm ({calcTotalQuantity})
                                    </h2>
                                    <div className="divide-y divide-gray-200">
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
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="mt-6 lg:col-span-4 lg:mt-0">
                            <div className="sticky top-4">
                                <div className="rounded-lg bg-white shadow">
                                    <div className="p-6">
                                        <h2 className="text-lg font-medium text-gray-900">
                                            Thông tin đơn hàng
                                        </h2>
                                        <div className="mt-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-600">Tạm tính</p>
                                                <p className="text-base font-medium text-gray-900">
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(calcTotalPrice)}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                                <p className="text-base font-medium text-gray-900">Tổng tiền</p>
                                                <p className="text-xl font-semibold text-red-600">
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(calcTotalPrice)}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            size="large"
                                            className="mt-6 w-full bg-blue-600 text-white hover:bg-blue-700"
                                            onClick={checkoutHandler}
                                        >
                                            Tiến hành thanh toán
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal 
                title="Thông tin giao hàng" 
                open={isModalOpen} 
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Tiếp tục thanh toán"
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
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">Danh sách sản phẩm</h3>
                        <div className="max-h-48 overflow-auto">
                            {groupedCartItems.map(item => (
                                <div key={item.id} className="flex items-center gap-4 py-2 border-b">
                                    <img 
                                        src={item.img_url} 
                                        alt={item.name} 
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium">{item.name}</h4>
                                        <div className="text-sm text-gray-500">
                                            Số lượng: {item.quantity}
                                        </div>
                                        <div className="text-sm font-semibold text-blue-600">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(item.price * item.quantity)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-right">
                            <span className="text-lg font-bold text-red-600">
                                Tổng: {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(calcTotalPrice)}
                            </span>
                        </div>
                    </div>
                    
                    <Form
                        form={form}
                        layout="vertical"
                        className="mt-4"
                    >
                        <h3 className="text-lg font-semibold mb-4">Thông tin giao hàng</h3>
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
                    </Form>
                </Spin>
            </Modal>
        </>
    );
};

export default CartPage;
