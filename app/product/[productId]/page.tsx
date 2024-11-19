'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Divider, Descriptions, Button, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

import OtherInfo from '@/components/ProductPage/OtherInfo';
import OtherProducts from '@/components/ProductPage/OtherProducts';

const ProductPage = () => {
    const params = useParams();
    const [productData, setProductData] = useState<any>({});
    const [otherProducts, setOtherProducts] = useState<any>([]);
    const [fetchDone, setFetchDone] = useState<boolean>(false);
    const [cart, setCart] = useState<any[]>([]);

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
                message.success('Product added to cart');
            }
        } catch (error: any) {
            console.error('Error adding product to cart:', error);
            message.error(error.response?.data?.message || 'Error adding product to cart');
        }
    };

    // Update the Descriptions items dynamically based on productData
    const productItems = [
        {
            key: 'name',
            label: 'Tên sản phẩm',
            children: productData.name,
            span: 3,
        },
        {
            key: 'price',
            label: 'Giá tiền',
            children: `$${productData.price}`,
            span: 3,
        },
        {
            key: 'description',
            label: 'Ghi chú',
            children: (
                <p className="text-gray-600">
                    Laptop gaming cao cấp với CPU Intel Core i9 12900H (14 nhân, 20 luồng), 
                    GPU NVIDIA RTX 3070Ti 8GB, RAM 32GB DDR5 (nâng cấp tối đa 64GB), 
                    SSD 1TB PCIe. Mạnh mẽ cho gaming và đồ họa, trang bị công nghệ 
                    NVIDIA Optimus và MUX Switch tối ưu hiệu năng.
                </p>
            ),
        },
    ];

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col rounded-lg bg-white p-4 shadow-md md:flex-row">
                <div className="flex-shrink-0">
                    <Image
                        src={productData.img_url}
                        alt="Product Image"
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
                            Thêm vào giỏ
                        </Button>
                        <Button type="link" className="text-blue-500">
                            Gọi đặt mua 1800.1060 (7:30 - 22:00)
                        </Button>
                    </div>
                </div>
            </div>
            <Divider className="my-6" />
            <OtherInfo />
            <Divider className="my-6" />
            {fetchDone && <OtherProducts data={otherProducts} />}
        </div>
    );
};

export default ProductPage;
