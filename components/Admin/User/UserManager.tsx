import React from 'react';
import axios from 'axios';
import { Table, Popconfirm, Button, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import DeleteUserButton from './DeleteUserButton';
import UpdateUserDrawer from './UpdateUserDrawer';
import { UserManagerProps, UserProps } from '../../../interfaces/UserInterfaces';

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
        { title: 'lastModifiedDate', dataIndex: 'lastModifiedDate', key: 'lastModifiedDate'},
        {
            title: 'Action',
            key: 'action',
            render: (user : UserProps) => (
                <div>
                    <UpdateUserDrawer userData = { user } />
                    <DeleteUserButton userData = { user } />
                </div>
            )
            ,
        },
    ];
    
    const handleDelete = (userId : string) => {
        console.log("DELETE USER W ID: ", userId)
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
