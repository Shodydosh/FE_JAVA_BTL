import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    message,
    Button,
    Col,
    Drawer,
    Form,
    Input,
    Row,
    Select,
    Space,
} from 'antd';
import axios from 'axios';

const { Option } = Select;

const AddProductButton: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        url: 'PTIT STORE',
        name: '',
        img_url: '',
        price: '',
        category: '',
    });

    const handleSubmitForm = () => {
        const addApiUrl = 'http://localhost:8080/api/admin/product/add';
        if (
            formValues.name === '' ||
            formValues.img_url === '' ||
            formValues.price === ''
        ) {
            message.error('Please fill in all required fields.');
            console.log(
                '🚀 ~ file: AddProductButton.tsx:22 ~ handleSubmitForm ~ formValues:',
            );
            return;
        }

        axios
            .post(addApiUrl, formValues)
            .then((response) => {
                console.log('Success:', response.data);
                setTimeout(() => {
                    setOpen(false);
                }, 500);
                message.success(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button type="default" onClick={showDrawer} icon={<PlusOutlined />}>
                New product
            </Button>
            <Drawer
                title={`Add new product`}
                width={600}
                onClose={onClose}
                open={open}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSubmitForm} type="default">
                            Create
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={20}>
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter product name',
                                    },
                                ]}
                            >
                                <Input
                                    value={formValues.name}
                                    onChange={(e) =>
                                        setFormValues({
                                            ...formValues,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={20}>
                            <Form.Item
                                name="img_url"
                                label="Image Url"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter image URL',
                                    },
                                ]}
                            >
                                <Input
                                    value={formValues.img_url}
                                    onChange={(e) =>
                                        setFormValues({
                                            ...formValues,
                                            img_url: e.target.value,
                                        })
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={20}>
                            <Form.Item
                                name="price"
                                label="Price"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter price',
                                    },
                                ]}
                            >
                                <Input
                                    value={formValues.price}
                                    onChange={(e) =>
                                        setFormValues({
                                            ...formValues,
                                            price: e.target.value,
                                        })
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={20}>
                            <Form.Item
                                name="category"
                                label="Category"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select an category',
                                    },
                                ]}
                            >
                                <Select
                                    value={formValues.category}
                                    onChange={(value) =>
                                        setFormValues({
                                            ...formValues,
                                            category: value,
                                        })
                                    }
                                >
                                    <Option value="laptop">Laptop</Option>
                                    <Option value="phone">Phone</Option>
                                    <Option value="tablet">Tablet</Option>
                                    <Option value="book">Book</Option>
                                    <Option value="clothing">Clothing</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
};

export default AddProductButton;
