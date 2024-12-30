'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { EditOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    message,
    Drawer,
    Form,
    Input,
    Row,
    Select,
    Space,
} from 'antd';
const { Option } = Select;
import {
    UserManagerProps,
    UserProps,
} from '../../../interfaces/UserInterfaces';

interface UpdateUserDrawerProps {
    userData: UserProps;
    onUpdateSuccess: (updatedUser: UserProps) => void;
}

const UpdateUserDrawer: React.FC<UpdateUserDrawerProps> = ({ userData, onUpdateSuccess }) => {
    const [open, setOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        name: userData.name,
        password: userData.password,
        email: userData.email,
        role: userData.role,
    });

    const handleUpdate = async (values: any) => {
        try {
            const response = await axios.put(`/api/users/${userData.id}`, values);
            if (response.status === 200) {
                onUpdateSuccess(response.data);
                message.success('User update successfully');
                setTimeout(() => {
                    setOpen(false);
                }, 500);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmitForm = () => {
        if (
            formValues.name === '' ||
            formValues.password === '' ||
            formValues.email === ''
        ) {
            message.error('Please fill in all required fields.');
            return;
        }
        console.log(
            '🚀 ~ file: AddNewUser.tsx:22 ~ handleSubmitForm ~ formValues:',
            formValues,
        );

        handleUpdate(formValues);
    };

    const showDrawer = () => {
        console.log('EDITING THIS USER', userData);
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button
                className="mr-2"
                type="default"
                onClick={showDrawer}
                icon={<EditOutlined />}
            ></Button>
            <Drawer
                title={`Update user ${userData.id}`}
                width={600}
                onClose={onClose}
                open={open}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSubmitForm} type="default">
                            Update
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
                                        message: 'Please enter user name',
                                    },
                                ]}
                            >
                                <Input
                                    value={formValues.name}
                                    defaultValue={formValues.name}
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
                                name="password"
                                label="Password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter password',
                                    },
                                ]}
                            >
                                <Input
                                    value={formValues.password}
                                    defaultValue={formValues.password}
                                    onChange={(e) =>
                                        setFormValues({
                                            ...formValues,
                                            password: e.target.value,
                                        })
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={20}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter email',
                                    },
                                ]}
                            >
                                <Input
                                    disabled={true}
                                    value={formValues.email}
                                    defaultValue={formValues.email}
                                    onChange={(e) =>
                                        setFormValues({
                                            ...formValues,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={20}>
                            <Form.Item
                                name="role"
                                label="Role"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select an role',
                                    },
                                ]}
                            >
                                <Select
                                    value={formValues.role}
                                    defaultValue={formValues.role}
                                    onChange={(value) =>
                                        setFormValues({
                                            ...formValues,
                                            role: value,
                                        })
                                    }
                                >
                                    <Option value="client">Client</Option>
                                    <Option value="admin">Admin</Option>
                                    <Option value="shipper">Shipper</Option>
                                    <Option value="manager">Manager</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
};

export default UpdateUserDrawer;
