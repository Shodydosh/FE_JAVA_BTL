import React from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Table, Popconfirm, Button, Tag } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';

import DeleteProductButton from './DeleteProductButton';
import UpdateProductDrawer from './UpdateProductDrawer';
import { ProductManagerProps, ProductProps } from '../../../interfaces/ProductInterfaces';

const ProductManager: React.FC<ProductManagerProps> = ({ productsData }) => {
    const columns : ColumnsType<ProductProps> = [
        { title: 'Image', dataIndex: 'img_url', render:(img_url : string | null) => (
          <Image
            src={img_url}
            alt="Product"
            width={100}
            height={100}
            unoptimized={true}
          />
        )},
        { title: 'ProductId', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Category',
            dataIndex: 'category',
            filters: [
                {
                    text: 'tablet',
                    value: 'tablet',
                },
                {
                    text: 'laptop',
                    value: 'laptop',
                },
                {
                    text: 'phone',
                    value: 'phone',
                },
            ],
            onFilter: (value: React.Key | boolean, record : ProductProps) => record.category === value,
            filterSearch: true,
            render: (category : string | null) => (
                category === "tablet" 
                ? <Tag color="pink">{category}</Tag>
                : category === "phone" 
                ? <Tag color="purple">{category}</Tag>
                :
                <Tag color="orange">{category}</Tag>
            )
        },
        { title: 'Price', dataIndex: 'price', 
          sorter: (a: ProductProps, b: ProductProps) => {
            if(!a.price) return -1
            if(!b.price) return 1
            return a.price.localeCompare(b.price)
        }, },
        // {
        //     title: 'lastModifiedDate',
        //     dataIndex: 'lastModifiedDate',
            // sorter: (a: ProductProps, b: ProductProps) => {
            //     if(!a.modifiedDate) return -1
            //     if(!b.modifiedDate) return 1
            //     return a.modifiedDate.localeCompare(b.modifiedDate)
            // },
        // },
        {
            title: 'Action',
            key: 'action',
            render: (Product : ProductProps) => (
                <div>
                    <UpdateProductDrawer ProductData = { Product } />
                    <DeleteProductButton ProductData = { Product } />
                </div>
            )
            ,
        },
    ];
    
    const handleDelete = (ProductId : string) => {
        console.log("DELETE Product W ID: ", ProductId)
    }

    const onChange: TableProps<ProductProps>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
      };

    return (
        <div className='text-black'>
            <Table
                columns={columns}
                onChange={onChange}
                dataSource={productsData}
                bordered
            />
        </div>
    );
};

export default ProductManager;
