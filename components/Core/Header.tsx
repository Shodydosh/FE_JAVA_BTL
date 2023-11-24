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
        <>
            <HeaderComponent className="sticky left-0 right-0 top-0 z-[999] flex items-center justify-between bg-white shadow-md">
                {/* <div className="text-xl text-white">JAVA_BTL</div> */}
                <div className="flex h-full items-center">
                    <div className="mr-4">
                        <Image
                            src={branch1}
                            alt="My Image"
                            width={250}
                            height={50}
                            className="bg-center object-cover"
                        />
                    </div>
                    <div
                        ref={searchRef}
                        className="relative flex h-full w-[460px] items-center "
                    >
                        <Search
                            className="w-full"
                            placeholder="Search..."
                            onChange={(
                                e: React.ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >,
                            ) => searchHandler(e.target.value)}
                        />

                        {isOpenSearchResult && searchResults && (
                            <SearchResult
                                results={searchResults}
                                setIsOpenSearchResult={setIsOpenSearchResult}
                            />
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Badge count={3} overflowCount={99}>
                        <Button
                            className="relative border-0"
                            icon={
                                <span>
                                    <Image
                                        src={bluecart}
                                        width={15}
                                        height={15}
                                        alt="cart "
                                    />
                                </span>
                            }
                            onClick={handleNavigation}
                        />
                    </Badge>

                    <div>
                        {!isLoggedIn ? (
                            <Link href="/login" scroll={false}>
                                <Button className="title" type="primary">
                                    Log in / Sign up
                                </Button>
                            </Link>
                        ) : (
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            label: 'Đăng xuất',
                                            key: '0',
                                            danger: true,
                                            onClick: logoutHandler,
                                        },
                                    ],
                                }}
                                trigger={['click']}
                            >
                                <Avatar>U</Avatar>
                            </Dropdown>
                        )}
                    </div>
                </div>
            </HeaderComponent>
        </>
    );
};
export default Header;
