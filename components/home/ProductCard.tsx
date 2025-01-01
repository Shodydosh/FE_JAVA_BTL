'use client';
import React from 'react';
import { EllipsisOutlined, ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { Card, Typography, Badge, Tag, Space } from 'antd';
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
        discountValue?: number;
        discountType?: 'FIXED_AMOUNT' | 'PERCENTAGE';
        discountCode?: string;
    };
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
    const router = useRouter();
    const SALE_BADGE = "SALE 10%";
    
    // Update price calculation to handle both string and number types
    const actualPrice = typeof data.price === 'string' 
        ? parseFloat(data.price.replace(/[^\d.,]/g, ''))
        : parseFloat(data.price);
    const originalPrice = actualPrice * 1.1;

    const calculateDiscountedPrice = () => {
        const originalPrice = parseFloat(data.price.replace(/[^0-9.-]+/g, '')) || 0;
        if (!data.discountValue) return originalPrice;
        
        if (data.discountType === 'FIXED_AMOUNT') {
            return originalPrice - data.discountValue;
        } else if (data.discountType === 'PERCENTAGE') {
            return originalPrice * (1 - data.discountValue / 100);
        }
        return originalPrice;
    };

    return (
        <Badge.Ribbon text={SALE_BADGE} color="red">
            <Card
                hoverable
                style={{
                    height: '100%',
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease'
                }}
                onClick={() => router.push(`/product/${data.id}`)}  // Add this line
                cover={
                    <div style={{
                        height: 200,
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',         // Add this
                        justifyContent: 'center', // Add this
                        alignItems: 'center'      // Add this
                    }}>
                        <img
                            alt={data.name}
                            src={data.img_url}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',  // Change from 'cover' to 'contain'
                                transition: 'transform 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        />
                    </div>
                }
                actions={[
                    <HeartOutlined key="heart" />,
                    <ShoppingCartOutlined key="cart" onClick={() => router.push(`/product/${data.id}`)} />
                ]}
            >
                <Meta
                    title={
                        <Text
                            style={{ fontSize: 16, fontWeight: 600 }}
                            ellipsis={{ rows: 2 }}
                        >
                            {data.name}
                        </Text>
                    }
                    description={
                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                            {data.discountValue && data.discountCode && (
                                <Tag color="red" className="mb-2">
                                    Giảm {data.discountType === 'PERCENTAGE' ? `${data.discountValue}%` : `${data.discountValue.toLocaleString()}đ`}
                                </Tag>
                            )}
                            <div>
                                {data.discountValue ? (
                                    <div>
                                        <Text delete type="secondary" style={{ fontSize: 14 }}>
                                            {formatPrice(originalPrice)}
                                        </Text>
                                        <Title level={4} className='!text-blue-400'>
                                            {formatPrice(calculateDiscountedPrice())}
                                        </Title>
                                    </div>
                                ) : (
                                    <Title level={4} className='!text-blue-400'>
                                        {formatPrice(data.price)}
                                    </Title>
                                )}
                            </div>
                        </Space>
                    }
                />
            </Card>
        </Badge.Ribbon>
    );
};

export default ProductCard;
