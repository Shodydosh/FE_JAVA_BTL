import React from 'react';
import { Table, Popconfirm, Button, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {QuestionCircleOutlined} from '@ant-design/icons';

import UpdateUserDrawer from './UpdateUserDrawer';

// Define the prop type for usersData
interface UserManagerProps {
    usersData: Array<{
        id: string;
        name: string;
        email: string;
        password: string | null;
        role: string | null;
    }>;
}
interface UserProps {
    id: string;
    name: string;
    email: string;
    password: string | null;
    role: string | null;
}

const UserManager: React.FC<UserManagerProps> = ({ usersData }) => {
    const columns = [
        { title: 'UserId', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Role', dataIndex: 'role', key: 'role',
            render: (role : string | null) => (
                role === "client" 
                ? <Tag color="blue">{role}</Tag>
                : <Tag color="red">{role}</Tag>
            )
        },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Password', dataIndex: 'password', key: 'password' },
        {
            title: 'Action',
            key: 'action',
            render: (user : UserProps) => (
                <div>
                    <UpdateUserDrawer userData = { user } />
                    <Popconfirm
                        okType='danger'
                        title="Delete the task"
                        description="Are you sure to delete this task?"
                        onConfirm={() => handleDelete(user.id)}
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </div>
            )
            ,
        },
    ];
    
    const handleDelete = (userId : string) => {
        console.log("DELETE USER W ID: ", userId)
    }
    const handleUpdate = (userId : string) => {
        console.log("UPDATE USER W ID: ", userId)
    }
    return (
        <div className='text-black'>
            <Table
                columns={columns}
                expandable={{
                rowExpandable: (record) => record.name !== 'Not Expandable',
                }}
                dataSource={usersData}
                bordered
            />
        </div>
    );
};

export default UserManager;
