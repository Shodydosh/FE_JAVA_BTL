'use client';
import React, { useState } from 'react';

import {
    Breadcrumb,
    Layout,
    Menu,
    Button,
    Input,
    Typography,
    Checkbox,
} from 'antd';

import {
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    DeleteOutlined,
} from '@ant-design/icons';

import Image from 'next/image';

import HeaderView from '../../components/Core/Header';

import FooterView from '../../components/Core/Footer';

import ghn from 'app/assets/images/ghn.png';

import ghtk from 'app/assets/images/ghtk.png';

const CartPage: React.FC = () => {
    const [current, setCurrent] = useState('1');

    const [selected, setSelected] = useState<boolean>(false);

    const [isHovered, setIsHovered] = useState(false);

    const onChange = (e: any) => {
        setSelected(e.target.checked);
    };

    return (
        //  <div style={appStyles}>
        <Layout>
            <div className=" min-h-screen overflow-auto w-[40%] mx-auto ">
                <div className="flex justify-center text-[18px] mt-4 border-b">
                    <span
                        className="font-semibold mb-2"
                        style={{ color: '#1890ff' }}
                    >
                        Giỏ hàng của bạn
                    </span>
                </div>
                {/* <div style={{marginTop: 4}}>
                    <Checkbox onChange={onChange} checked={selected} defaultChecked={false} >
                        Chọn tất cả
                    </Checkbox>        
                </div> */}
                <div
                    style={{
                        height: 670,
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        border: '2px solid #1890ff',
                        boxShadow: '0 0 10px rgba(0, 0, 255, 0.5)',
                    }}
                >
                    <div className="flex justify-between mt-4 ml-4">
                        <Image src={ghn} alt="My Image" className="w-20 h-20" />
                        <div className="flex-row mr-4 ">
                            <div className="mb-1">
                                <span className="font-bold">
                                    Chuột không dây S88 Office Pro1 Mới
                                </span>
                            </div>
                            <div className="mb-1">
                                <span
                                    style={{ color: 'red' }}
                                    className="font-bold"
                                >
                                    159.000 &#8363;
                                </span>
                            </div>
                            <div>
                                <span>Chọn số lượng:</span>
                                <div
                                    className="ml-2"
                                    style={{
                                        border: '0.01px solid black',
                                        display: 'inline-block',
                                        borderRadius: 2,
                                    }}
                                >
                                    <button id="decrease" className="ml-2">
                                        -
                                    </button>
                                    <input
                                        type="text"
                                        id="quantity"
                                        value="1"
                                        style={{
                                            width: 40,
                                            textAlign: 'center',
                                        }}
                                    />
                                    <button id="increase" className="mr-2">
                                        +
                                    </button>
                                </div>
                                <DeleteOutlined
                                    style={{ marginLeft: 8 }}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                />
                                <div
                                    className={`dropdown ${
                                        isHovered ? 'visible' : ''
                                    }`}
                                    style={{
                                        display: 'none',
                                        position: 'absolute',
                                        backgroundColor: '#ffffff',
                                        padding: '8px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        marginTop: '4px',
                                        marginLeft: '-8px',
                                    }}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                >
                                    Xóa khỏi giỏ hàng
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-72 h-fit group">
                        <div className="relative overflow-hidden">
                            <DeleteOutlined style={{ marginLeft: 8 }} />
                            <div className="absolute  flex flex-col items-center justify-center -bottom-10 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <span
                                    className="bg-black text-white "
                                    style={{ borderRadius: 2 }}
                                >
                                    Xóa khỏi giỏ hàng
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FooterView />
        </Layout>
    );
};

export default CartPage;
