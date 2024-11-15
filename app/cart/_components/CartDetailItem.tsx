'use client';

import { useEffect, useRef, useState } from 'react';

import { Button, InputNumber, Tooltip } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';

import Image from 'next/image';

import axios from 'axios';

import ghn from '../../assets/images/ghn.png';
import { Product } from '@/types/product';
import { concurrencyFormat } from '@/utils/concurrency-format';

const MAX_QUANTITY = 999;
const MIN_QUANTITY = 1;

export interface CartProps extends Product {
    quantity: number;
}

interface CartDetailItemProps {
    cart: {
        id: string;
        retailer: string;
        img_url: string;
        name: string;
        price: number;
        url: string;
        category: string;
        quantity: number;
    };
    onRemove: (id: string) => Promise<void>;
    onQuantityChange: (qty: number) => void;
}

const CartDetailItem: React.FC<CartDetailItemProps> = ({
    cart,
    onRemove,
    onQuantityChange,
}) => {
    const { id, name, newPrice, quantity: defaultQuantity = 1, image } = cart;

    const [quantity, setQuantity] = useState<number>(defaultQuantity);

    useEffect(() => {
        onQuantityChange?.(quantity, id);
    }, [quantity]);

    const quantityIncreaseHandler = () => {
        if (quantity >= MAX_QUANTITY) return;

        setQuantity((prevValue) => prevValue + 1);
    };

    const quantityDecreaseHandler = () => {
        if (quantity <= MIN_QUANTITY) return;

        setQuantity((prevValue) => prevValue - 1);
    };

    const handleRemove = async () => {
        const apiUrl = `http://localhost:8080/api/cartitems/delete/59cd9ce2-1b15-4fe9-a775-9169fc90c907/${cart.id}`;

        try {
            const response = await axios.delete(apiUrl, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                await onRemove(cart.id);
                console.log('Cart item successfully deleted:', cart.id);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            // Add error handling UI feedback here if needed
        }
    };

    const handleQuantityChange = (value: number | null) => {
        if (value !== null) {
            onQuantityChange(value);
        }
    };

    return (
        <div className="flex items-center border-b p-3">
            <div className="h-16 w-16 flex-shrink-0">
                <img
                    src={cart.img_url}
                    alt={cart.name}
                    className="h-full w-full object-contain"
                />
            </div>
            <div className="ml-3 flex flex-1 flex-col gap-1">
                <div className="line-clamp-2 text-sm font-medium">
                    {cart.name}
                </div>
                <div className="text-sm text-red-500">
                    {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    }).format(cart.price)}
                </div>
                <div className="flex items-center gap-2">
                    <InputNumber
                        min={1}
                        max={10}
                        value={cart.quantity}
                        onChange={handleQuantityChange}
                        size="small"
                        className="w-20"
                    />
                    <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleRemove}
                    />
                </div>
            </div>
        </div>
    );
};

export default CartDetailItem;
