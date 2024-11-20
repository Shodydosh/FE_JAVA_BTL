import React, { ChangeEventHandler, useState, useEffect, useRef } from 'react';

import Image from 'next/image';

import { useRouter } from 'next/navigation';

import { ShoppingCartOutlined } from '@ant-design/icons';

import {
    Breadcrumb,
    Layout,
    Menu,
    Button,
    Input,
    Typography,
    Badge,
    message,
    Form,
    Avatar,
    Dropdown,
} from 'antd';

import branch1 from '@/app/assets/images/branch1.png';

import bluecart from '@/app/assets/images/bluecart.png';
import { SearchResult } from '../search';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchProduct } from '@/hooks/useSearchProduct';
import Link from 'next/link';
import { useOnClickOutside } from '@/hooks/useClickOutside';
import { useAuth } from '@/hooks/useAuth';
import ptit from '@/app/assets/images/ptit.jpg';
const { Header: HeaderComponent } = Layout;

const { Search } = Input;

const Header = () => {
    const router = useRouter();
    const [isOpenSearchResult, setIsOpenSearchResult] =
        useState<boolean>(false);
    const { data: searchResults, trigger } = useSearchProduct();

    const { isLoggedIn, isValidating, mutate } = useAuth();

    const searchRef = useRef<HTMLDivElement | null>(null);

    useOnClickOutside(searchRef, () => setIsOpenSearchResult(false));

    const searchHandler = useDebouncedCallback(
        // function
        (value: string) => {
            setIsOpenSearchResult(true);

            trigger(value);
        },
        // delay in ms
        500,
        {
            // leading: true sẽ ko bị debouce ở lần nhập đầu tiên, kể từ lần bấm thứ 2 trở đi sẽ bị debounce
            leading: true,
        },
    );

    const handleNavigation = () => {
        router.push('/cart');
    };

    const logoutHandler = () => {
        localStorage.removeItem('token');
        mutate(null);
        message.success('Log out succesfully!');
    };

    return (
        <HeaderComponent className="sticky left-0 right-0 top-0 z-[999] bg-white shadow-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                {/* Left section - Logo */}
                <div className="flex-shrink-0">
                    <Link href="/" className="flex items-center">
                        <Image
                            src={ptit}
                            alt="PTIT Logo"
                            width={40}
                            height={40}
                            className="rounded object-contain"
                        />
                    </Link>
                </div>

                {/* Center section - Search */}
                <div className="mx-4 flex-1 justify-center lg:flex lg:max-w-2xl lg:px-4 mt-6">
                    <div ref={searchRef} className="relative w-full pt-[2px]">
                        <Search
                            className="w-full !h-[32px]"
                            placeholder="Search products..."
                            onChange={(e) => searchHandler(e.target.value)}
                        />
                        {isOpenSearchResult && searchResults && (
                            <SearchResult
                                results={searchResults}
                                setIsOpenSearchResult={setIsOpenSearchResult}
                            />
                        )}
                    </div>
                </div>

                {/* Right section - Cart & User */}
                <div className="flex items-center gap-4">
                    <Badge count={3} size="small">
                        <Button
                            className="flex items-center justify-center border-none shadow-none hover:bg-gray-50"
                            icon={
                                <Image
                                    src={bluecart}
                                    width={20}
                                    height={20}
                                    alt="Shopping Cart"
                                    className="object-contain"
                                />
                            }
                            onClick={handleNavigation}
                        />
                    </Badge>

                    <div className="ml-2">
                        {!isLoggedIn ? (
                            <Link href="/login" scroll={false}>
                                <Button type="primary">
                                    Login
                                </Button>
                            </Link>
                        ) : (
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            label: 'Lịch sử đặt hàng',
                                            key: 'order-history',
                                            onClick: () => router.push('/order-history'),
                                        },
                                        {
                                            label: 'Đăng xuất',
                                            key: 'logout',
                                            danger: true,
                                            onClick: logoutHandler,
                                        },
                                    ],
                                }}
                                trigger={['click']}
                            >
                                <Avatar className="cursor-pointer bg-primary">U</Avatar>
                            </Dropdown>
                        )}
                    </div>
                </div>
            </div>
        </HeaderComponent>
    );
};

export default Header;
