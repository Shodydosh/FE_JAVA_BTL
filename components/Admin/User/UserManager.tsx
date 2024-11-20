import React from 'react';
import axios from 'axios';
import { Table, Popconfirm, Button, Tag } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';

import DeleteUserButton from './DeleteUserButton';
import UpdateUserDrawer from './UpdateUserDrawer';
import { UserManagerProps, UserProps } from '../../../interfaces/UserInterfaces';

const UserManager: React.FC<UserManagerProps> = ({ usersData }) => {
    const columns : ColumnsType<UserProps> = [
        { title: 'UserId', dataIndex: 'id', key: 'id' },
        { 
            title: 'Name', 
            dataIndex: 'name', 
            key: 'name',
            sorter: (a: UserProps, b: UserProps) => (a.name || '').localeCompare(b.name || ''),
            filterSearch: true,
            filters: usersData.map(user => ({
                text: user.name,
                value: user.name,
            })),
            onFilter: (value: React.Key | boolean, record: UserProps) => 
                record.name?.includes(String(value)) || false
        },
        { title: 'Role',
            dataIndex: 'role',
            filters: [
                {
                    text: 'admin',
                    value: 'admin',
                },
                {
                    text: 'client',
                    value: 'client',
                },
            ],
            onFilter: (value: React.Key | boolean, record : UserProps) => record.role === value,
            filterSearch: true,
            render: (role : string | null) => (
                role === "client" 
                ? <Tag color="blue">{role}</Tag>
                : <Tag color="red">{role}</Tag>
                )
        },
        { 
            title: 'Email', 
            dataIndex: 'email', 
            key: 'email',
            sorter: (a: UserProps, b: UserProps) => (a.email || '').localeCompare(b.email || ''),
            filterSearch: true,
            filters: usersData.map(user => ({
                text: user.email,
                value: user.email,
            })),
            onFilter: (value: React.Key | boolean, record: UserProps) => 
                record.email?.includes(String(value)) || false
        },
        { title: 'Password', dataIndex: 'password', key: 'password' },
        {
            title: 'lastModifiedDate',
            dataIndex: 'lastModifiedDate',
            sorter: {
                compare: (a: UserProps, b: UserProps) => {
                    const dateA = a.modifiedDate ? new Date(a.modifiedDate).getTime() : 0;
                    const dateB = b.modifiedDate ? new Date(b.modifiedDate).getTime() : 0;
                    return dateA - dateB;
                },
                multiple: 1
            }
        },
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

    const onChange: TableProps<UserProps>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
      };

    return (
        <div className='text-black'>
            <Table
                columns={columns}
                onChange={onChange}
                dataSource={usersData}
                bordered
            />
        </div>
    );
};

export default UserManager;
