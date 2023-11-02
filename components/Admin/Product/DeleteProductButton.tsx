import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { QuestionCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Popconfirm, Button, message } from 'antd';
import { ProductProps } from '@/interfaces/ProductInterfaces';
interface ThisProps {
    productData: ProductProps;
}

const DeleteProductButton: React.FC<ThisProps> = ({ productData }) => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showPopconfirm = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        const deleteApiUrl = `http://localhost:8080/api/admin/product/delete`;
        console.log(`${deleteApiUrl}/${productData.id}`);

        axios
            .delete(`${deleteApiUrl}/${productData.id}`)
            .then((response) => {
                console.log(response);
                message.success('product deleted');
            })
            .catch((err) => {
                message.error('Error while deleting product');
                console.error(err);
            })
            .finally(() => {
                setOpen(false);
                setConfirmLoading(false);
            });
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <Popconfirm
            placement="topRight"
            okType="danger"
            title={`Delete product ${productData.id}`}
            description="Open Popconfirm with async logic"
            open={open}
            okText="Delete"
            onConfirm={handleOk}
            okButtonProps={{ loading: confirmLoading }}
            onCancel={handleCancel}
        >
            <Button
                danger
                onClick={showPopconfirm}
                icon={<DeleteOutlined />}
            ></Button>
        </Popconfirm>
    );
};

export default DeleteProductButton;
