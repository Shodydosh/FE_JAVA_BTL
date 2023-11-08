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
} from 'antd';

import branch1 from '@/app/assets/images/branch1.png';

import bluecart from '@/app/assets/images/bluecart.png';
import { SearchResult } from '../search';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchProduct } from '@/hooks/useSearchProduct';

const { Header: HeaderComponent } = Layout;

const { Search } = Input;

const { Text } = Typography;

const Header = () => {
    const router = useRouter();
    const [isOpenSearchResult, setIsOpenSearchResult] =
        useState<boolean>(false);
    const { data: searchResults, trigger } = useSearchProduct();

    const searchInputRef = useRef<HTMLDivElement | null>(null);

    const handleOutsideClick = (e: MouseEvent) => {
        if (
            searchInputRef.current &&
            e.target instanceof Node &&
            !searchInputRef.current.contains(e.target)
        ) {
            closeSearchResultHandler();
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

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

    const closeSearchResultHandler = () => {
        console.log('closeSearchResultHandler');
        setIsOpenSearchResult(false);
    };

    const handleNavigation = () => {
        router.push('/cart');
    };

    return (
        <HeaderComponent
            ref={searchInputRef}
            className="sticky left-0 right-0 top-0 z-[9999] flex items-center justify-between bg-white shadow-md"
        >
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
                <div className="relative flex h-full w-[460px] items-center ">
                    <Search
                        className="w-full"
                        placeholder="Search..."
                        onChange={(
                            e: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                            >,
                        ) => searchHandler(e.target.value)}
                        // onBlur={closeSearchResultHandler}
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

                <Button type="primary" className="font-bold">
                    Login / Sign up
                </Button>
            </div>
        </HeaderComponent>
    );
};
export default Header;
