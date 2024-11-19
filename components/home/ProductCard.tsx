'use client';
import React from 'react';
import { EllipsisOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const { Text, Link, Title } = Typography;
const { Meta } = Card;

const formatPrice = (price: string | number): string => {
    if (!price) return '0 ₫';
    
    // Convert price to string if it's a number
    const priceString = typeof price === 'number' ? price.toString() : price;
    
    // Remove all non-numeric characters except dots and commas
    const cleanPrice = priceString.replace(/[^\d.,]/g, '');
    // Convert to number, handling different number formats
    const numericPrice = parseFloat(cleanPrice.replace(/,/g, ''));
    
    // Format the price with Vietnamese locale
    return numericPrice.toLocaleString('vi-VN') + ' ₫';
};

interface ProductCardProps {
    data: {
        id: string;
        retailer: string;
        img_url: string;
        name: string;
        price: string;
        url: string;
        category: string;
    };
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
    const router = useRouter();
    const isValidImage =
        data.img_url &&
        (data.img_url.startsWith('/') || data.img_url.startsWith('http'));
    const handleClick = () => {
        const productId = data.id; // Assuming data.id is a string
        router.push(`/product/${productId}`);
    };

    return (
        <div
            className="min-h-96 w-full rounded shadow-lg hover:cursor-pointer"
            onClick={handleClick}
        >
            <div className="w-full bg-white p-2">
                <div className="h-48 w-full">
                    <Image
                        src={data.img_url}
                        alt="Product"
                        width={200}
                        height={200}
                        unoptimized={true}
                        className="object-contain"
                    />
                </div>
                <div className="mt-2 h-full flex-row">
                    <h1 className="h-16 text-base font-semibold text-black line-clamp-2">
                        {data.name}
                    </h1>
                    <div className="mt-1">
                        <p className="text-xs text-gray-500 line-through">
                            Old Price
                        </p>
                        <p className="text-xs text-gray-500">info</p>
                    </div>
                    <div className="mt-1">
                        <h3 className="text-xl text-blue-400">{formatPrice(data.price)}</h3>
                    </div>
                </div>
                <div className="mt-2 flex">
                    <ShoppingCartOutlined
                        className="text-xl text-gray-600"
                        key="add to cart"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
