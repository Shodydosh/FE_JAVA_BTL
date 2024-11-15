'use client';

import { useEffect, useMemo, useState } from 'react';
import CartDetailItem from './_components/CartDetailItem';
import { Button, Modal, Form, Input, notification } from 'antd';
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
    const [quantities, setQuantities] = useState<Map<string, number>>(new Map());
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // Add modal state
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

    // Initialize quantities when cart items are loaded
    useEffect(() => {
        const newQuantities = new Map();
        cartItems.forEach(item => {
            const key = `${item.name}-${item.price}`;
            const currentQty = newQuantities.get(key) || 0;
            newQuantities.set(key, currentQty + 1);
        });
        setQuantities(newQuantities);
    }, [cartItems]);

    const groupedCartItems = useMemo(() => {
        const grouped = cartItems.reduce((acc, item) => {
            const key = `${item.name}-${item.price}`;
            if (!acc[key]) {
                acc[key] = {
                    ...item,
                    quantity: quantities.get(key) || 1
                };
            }
            return acc;
        }, {} as Record<string, CartItem & { quantity: number }>);
        
        return Object.values(grouped);
    }, [cartItems, quantities]);

    const calcTotalPrice = useMemo(() => {
        return groupedCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [groupedCartItems]);

    const calcTotalQuantity = useMemo(() => {
        return groupedCartItems.reduce((total, item) => total + item.quantity, 0);
    }, [groupedCartItems]);

    const isValidUUID = (uuid: string) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    };

    const removeHandler = async (id: string) => {
        const filterCart = cartItems.filter((x) => x.id !== id);
        setCartItems(filterCart);
        
        const itemToRemove = cartItems.find(x => x.id === id);
        if (itemToRemove) {
            const key = `${itemToRemove.name}-${itemToRemove.price}`;
            const newQuantities = new Map(quantities);
            newQuantities.delete(key);
            setQuantities(newQuantities);
        }
    };

    const handleQuantityChange = (item: CartItem, newQuantity: number) => {
        const newCartItems = cartItems.map(cartItem => {
            if (cartItem.id === item.id) {
                return { ...cartItem, quantity: newQuantity };
            }
            return cartItem;
        });
        setCartItems(newCartItems);
        
        const key = `${item.name}-${item.price}`;
        const newQuantities = new Map(quantities);
        newQuantities.set(key, newQuantity);
        setQuantities(newQuantities);
    };

    const checkoutHandler = () => {
        setIsModalOpen(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            // Here you would send the payment data to your backend
            notification.success({
                message: 'Đặt hàng thành công',
                description: 'Cảm ơn bạn đã mua hàng!'
            });
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error('Validation failed:', error);
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
                                cart={{ ...item }}
                                onRemove={removeHandler}
                                onQuantityChange={(qty) => handleQuantityChange(item, qty)}
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
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-4"
                >
                    <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item
                        name="note"
                        label="Ghi chú"
                    >
                        <Input.TextArea rows={2} />
                    </Form.Item>

                    <div className="mt-4 border-t pt-4">
                        <div className="flex justify-between">
                            <span>Tổng số lượng:</span>
                            <span>{calcTotalQuantity}</span>
                        </div>
                        <div className="mt-2 flex justify-between">
                            <span>Tổng tiền:</span>
                            <span className="text-lg font-bold text-red-500">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(calcTotalPrice)}
                            </span>
                        </div>
                    </div>
                </Form>
            </Modal>
        </div>
        </>
    );
};

export default CartPage;
