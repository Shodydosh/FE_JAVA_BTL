'use client';

import { useEffect, useRef, useState } from 'react';

import { Button, InputNumber, Tooltip } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';

import Image from 'next/image';

import ghn from 'app/assets/images/ghn.png';
import { Product } from '@/types/product';
import { concurrencyFormat } from '@/utils/concurrency-format';

const MAX_QUANTITY = 999;
const MIN_QUANTITY = 1;

export interface CartProps extends Product {
    quantity: number;
}

type CartDetailItemProps = {
    cart: CartProps;
    onQuantityChange?: (value: number, id: number) => void;
    onRemove?: (id: number) => void;
};

const CartDetailItem = (props: CartDetailItemProps) => {
    const { cart, onQuantityChange, onRemove } = props;

    const { id, name, newPrice, quantity: defaultQuantity = 1, image } = cart;

    const [quantity, setQuantity] = useState<number>(defaultQuantity);

    useEffect(() => {
        onQuantityChange?.(quantity, id);
    }, [quantity]);

    const quantityIncreaseHandler = () => {
        if (quantity >= MAX_QUANTITY) return;

        setQuantity((prevValue) => prevValue + 1);
    };

    const quantityDecreaseHandler = () => {
        if (quantity <= MIN_QUANTITY) return;

        setQuantity((prevValue) => prevValue - 1);
    };

    return (
        <div className="flex items-start gap-6 p-4">
            <div>
                <Image src={image || ghn} alt={name} width={20} height={20} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div>
                    <span className="line-clamp-2 font-bold">{name}</span>
                </div>

                <div>
                    <span className="font-bold text-red-500">
                        {concurrencyFormat(Number(newPrice) * quantity)}
                    </span>
                </div>

                <div className="flex w-full items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div>
                            <span>Chọn số lượng:</span>
                        </div>

                        <div className="w-[100px]">
                            <InputNumber
                                addonBefore={
                                    <button
                                        className="h-full w-full"
                                        onClick={quantityDecreaseHandler}
                                    >
                                        -
                                    </button>
                                }
                                addonAfter={
                                    <button
                                        className="h-full w-full"
                                        onClick={quantityIncreaseHandler}
                                    >
                                        +
                                    </button>
                                }
                                controls={false}
                                min={1}
                                max={999}
                                value={quantity}
                                onChange={(value: number | null) => {
                                    if (!value) return;
                                    setQuantity(value);
                                }}
                            />
                        </div>
                    </div>

                    <div className="">
                        <Tooltip title="Xóa sản phẩm khỏi giỏ hàng">
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => onRemove?.(id)}
                            />
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CartDetailItem;
