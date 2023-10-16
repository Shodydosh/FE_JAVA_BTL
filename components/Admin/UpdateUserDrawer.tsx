import React, { useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';

interface UserProps {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
}
interface ThisProps {
    userData: UserProps;
}
  
const UpdateUserDrawer: React.FC<ThisProps> = (props) => {
    const { userData } = props;
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        console.log("EDITING THIS USER", userData);
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button className='mr-2' type="default" onClick={showDrawer} icon={<EditOutlined />}>
                Update
            </Button>
            <Drawer
                title={`Update User`}
                width={600}
                onClose={onClose}
                open={open}
                extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={onClose} type="default">
                        Submit
                    </Button>
                </Space>
                }
            >
                <Form layout="vertical">
                    <h1 className='mb-4'>UserId: {userData.id}</h1>
                    <Row gutter={16}>
                        <Col span={20}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: 'Please enter user name' }]}
                        >
                            <Input defaultValue={userData.name} />
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
                            <Input defaultValue={userData.password} />
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
                            <Input defaultValue={userData.email} />
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
                            <Select defaultValue={userData.role}>
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

export default UpdateUserDrawer;