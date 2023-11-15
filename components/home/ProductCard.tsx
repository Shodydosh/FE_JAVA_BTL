'use client';
import React from 'react';
import { EllipsisOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const { Text, Link, Title } = Typography;
const { Meta } = Card;

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
            className="min-h-128 w-full rounded shadow-lg hover:cursor-pointer"
            onClick={handleClick}
        >
            <div className="w-full bg-white p-4">
                <div className="h-72 w-full">
                    <Image
                        src={data.img_url}
                        alt="Product"
                        width={400}
                        height={400}
                        unoptimized={true}
                    />
                </div>
                <div className="mt-4 h-full flex-row">
                    <h1 className="h-24 text-lg font-semibold text-black">
                        {data.name}
                    </h1>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500 line-through">
                            Old Price
                        </p>
                        <p className="text-sm text-gray-500">info</p>
                    </div>
                    <div className="mt-2">
                        <h3 className="text-2xl text-blue-400">{data.price}</h3>
                    </div>
                </div>
                <div className="mt-4 flex">
                    <ShoppingCartOutlined
                        className="text-2xl text-gray-600"
                        key="add to cart"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
