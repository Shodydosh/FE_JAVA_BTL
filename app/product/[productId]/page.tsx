'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Divider, Descriptions, Button, message, Rate, Input, Form } from 'antd';
import { ShoppingCartOutlined, StarOutlined } from '@ant-design/icons';

import OtherInfo from '@/components/ProductPage/OtherInfo';
import OtherProducts from '@/components/ProductPage/OtherProducts';

interface RatingSubmission {
    score: number;  // Changed from rating to score to match backend
    comment: string;
    userId: string; // Add userId field
}

interface Rating {
    id: string;
    score: number;  // Changed from rating to score to match backend model
    comment: string;
    createdAt: string;
}

interface Product {
    id: string;
    retailer: string;
    img_url: string;
    name: string;
    price: number;
    url: string;
    category: string;
    averageRating: number;
    totalRatings: number;
}

const ProductPage = () => {
    const params = useParams();
    const [productData, setProductData] = useState<Product | null>(null);
    const [otherProducts, setOtherProducts] = useState<any>([]);
    const [fetchDone, setFetchDone] = useState<boolean>(false);
    const [cart, setCart] = useState<any[]>([]);
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (params) {
                    const productResponse = await axios.get(
                        `http://localhost:8080/api/product/${params.productId}`,
                    );
                    setProductData(productResponse.data);

                    if (productResponse.data.category) {
                        const categoryResponse = await axios.get(
                            `http://localhost:8080/api/product/${productResponse.data.category}`,
                        );

                        // Filter out the item with the same ID as productResponse.data.id
                        const filteredItems = categoryResponse.data.filter(
                            (item) => item.id !== productResponse.data.id,
                        );

                        // Select the first 5 items from the filtered data
                        const selectedItems = filteredItems.slice(0, 5);
                        setOtherProducts(selectedItems);
                        setFetchDone(true);
                    }

                    // Fetch ratings
                    const ratingsResponse = await axios.get(
                        `http://localhost:8080/api/ratings/product/${params.productId}`
                    );
                    setRatings(ratingsResponse.data);

                    const avgRatingResponse = await axios.get(
                        `http://localhost:8080/api/ratings/product/${params.productId}/average`
                    );
                    setAverageRating(avgRatingResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [params]);

    const addToCart = async (product) => {
        try {
            const response = await axios.post(
                `http://localhost:8080/api/cartitems/add/59cd9ce2-1b15-4fe9-a775-9169fc90c907`,
                {
                    product: {
                        id: product.id,
                        retailer: product.retailer,
                        img_url: product.img_url,
                        name: product.name,
                        price: product.price,
                        url: product.url,
                        category: product.category
                    },
                    quantity: 1
                }
            );

            if (response.data) {
                setCart([...cart, product]);
                message.success('Đã thêm sản phẩm vào giỏ hàng');
            }
        } catch (error: any) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
            message.error(error.response?.data?.message || 'Lỗi khi thêm sản phẩm vào giỏ hàng');
        }
    };

    const handleRatingSubmit = async (values: { rating: number; comment: string }) => {
        try {
            // Hardcoded userId for testing - replace with actual user authentication
            const userId = "59cd9ce2-1b15-4fe9-a775-9169fc90c907"; // Same as the cart user ID

            const ratingSubmission: RatingSubmission = {
                score: values.rating,
                comment: values.comment || '',
                userId: userId
            };

            const response = await axios.post(
                `http://localhost:8080/api/ratings/product/${params.productId}`,
                ratingSubmission,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.data) {
                message.success('Đánh giá của bạn đã được ghi nhận');
                form.resetFields();
                
                // Refresh ratings
                const ratingsRes = await axios.get(
                    `http://localhost:8080/api/ratings/product/${params.productId}`
                );
                setRatings(ratingsRes.data);
                
                // Refresh product data
                const productRes = await axios.get(
                    `http://localhost:8080/api/product/${params.productId}`
                );
                setProductData(productRes.data);
            }
        } catch (error: any) {
            console.error('Error submitting rating:', error.response?.data || error);
            
            // More specific error messages based on error type
            if (error.response?.status === 401) {
                message.error('Vui lòng đăng nhập để đánh giá sản phẩm');
            } else if (error.response?.status === 400) {
                message.error('Thông tin đánh giá không hợp lệ');
            } else {
                message.error('Không thể gửi đánh giá. Vui lòng thử lại sau.');
            }
        }
    };

    // Update the Descriptions items dynamically based on productData
    const productItems = [
        {
            key: 'name',
            label: 'Tên sản phẩm',
            children: productData?.name,
            span: 3,
        },
        {
            key: 'price',
            label: 'Giá tiền',
            children: productData?.price ? `${productData.price.toLocaleString('vi-VN')} ₫` : '',
            span: 3,
        },
        {
            key: 'description',
            label: 'Mô tả',
            children: (
                <p className="text-gray-600">
                    Laptop gaming cao cấp với CPU Intel Core i9 12900H (14 nhân, 20 luồng), 
                    GPU NVIDIA RTX 3070Ti 8GB, RAM 32GB DDR5 (nâng cấp tối đa 64GB), 
                    SSD 1TB PCIe. Mạnh mẽ cho gaming và đồ họa, trang bị công nghệ 
                    NVIDIA Optimus và MUX Switch tối ưu hiệu năng.
                </p>
            ),
        },
        {
            key: 'rating',
            label: 'Đánh giá',
            children: productData && (
                <div>
                    <Rate disabled value={productData.averageRating} />
                    <span className="ml-2">({productData.totalRatings} đánh giá)</span>
                </div>
            ),
            span: 3,
        },
    ];

    // Update the rating display section to use score instead of rating
    const ratingSection = (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Đánh giá từ khách hàng</h3>
            {ratings.map((rating, index) => (
                <div key={rating.id || index} className="border-b py-4">
                    <Rate disabled value={rating.score} />
                    <p className="mt-2">{rating.comment}</p>
                    <p className="text-gray-500 text-sm">
                        {new Date(rating.createdAt).toLocaleDateString()}
                    </p>
                </div>
            ))}
        </div>
    );

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col rounded-lg bg-white p-4 shadow-md md:flex-row">
                <div className="flex-shrink-0">
                    <Image
                        src={productData?.img_url}
                        alt="Hình ảnh sản phẩm"
                        className="rounded-lg object-cover"
                        width={400}
                        height={400}
                    />
                </div>
                <div className="flex-grow md:ml-4">
                    <Descriptions
                        title="Thông tin sản phẩm"
                        bordered
                        items={productItems}
                    />
                    <div className="mt-4 flex space-x-2">
                        <Button
                            className="bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-600"
                            type="default"
                            icon={<ShoppingCartOutlined />}
                            size="large"
                            onClick={() => addToCart(productData)}
                        >
                            Thêm vào giỏ hàng
                        </Button>
                        <Button type="link" className="text-blue-500">
                            Gọi đặt mua 1800.1060 (7:30 - 22:00)
                        </Button>
                    </div>
                </div>
            </div>
            
            <Divider className="my-6">Đánh giá sản phẩm</Divider>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <Form form={form} onFinish={handleRatingSubmit}>
                    <Form.Item name="rating" label="Đánh giá của bạn" rules={[{ required: true }]}>
                        <Rate />
                    </Form.Item>
                    <Form.Item name="comment" label="Nhận xét">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Gửi đánh giá
                    </Button>
                </Form>

                {ratingSection}
            </div>

            <Divider className="my-6" />
            <OtherInfo />
            <Divider className="my-6" />
            {fetchDone && <OtherProducts data={otherProducts} />}
        </div>
    );
};

export default ProductPage;
