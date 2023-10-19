import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { message, Button, Col, Drawer, Form, Input, Row, Select, Space } from 'antd';

const { Option } = Select;

const AddNewUser: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    password: '',
    email: '',
    role: 'client',
  });

    const handleSubmitForm = () => {
        // Check form values for validation
        if (formValues.name === "" || formValues.password === "" || formValues.email === "") {
            message.error('Please fill in all required fields.')
            console.log("🚀 ~ file: AddNewUser.tsx:22 ~ handleSubmitForm ~ formValues:", formValues)
            return;
        }
        console.log("💕💕💕 ~ file: AddNewUser.tsx:22 ~ handleSubmitForm ~ formValues:", formValues)

        // If the form is valid, you can proceed to perform your desired action
        // For example, you can make an API request to create a new user with the formValues
        // Example: callCreateUserAPI(formValues);

        // After a successful action, you can close the drawer
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
                New user
            </Button>
            <Drawer
                title={`Add new user`}
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
                            rules={[{ required: true, message: 'Please enter user name' }]}
                        >
                            <Input 
                                value={formValues.name} 
                                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                            />
                        </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                    <Col span={20}>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true, message: 'Please enter password' }]}
                        >
                            <Input 
                                value={formValues.password} 
                                onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
                            />
                        </Form.Item>
                        </Col>
                    </Row>
                    
                    <Row gutter={16}>
                        <Col span={20}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Please enter email' }]}
                        >
                            <Input 
                                value={formValues.email} 
                                onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                            />
                        </Form.Item>
                        </Col>
                    </Row>    
                    <Row gutter={16}>
                        <Col span={20}>
                            <Form.Item
                            name="role"
                            label="Role"
                            rules={[{ required: true, message: 'Please select an role' }]}
                            >
                                <Select
                                    value={formValues.role}
                                    onChange={(value) => setFormValues({ ...formValues, role: value })}
                                >
                                    <Option value="client">Client</Option>
                                    <Option value="admin">Admin</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
};

export default AddNewUser;