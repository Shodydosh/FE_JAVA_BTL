'use client';

import { useMemo } from 'react';
import CartDetailItem from './_components/CartDetailItem';
import { productArray } from './_data';
import useLocalStorageState from 'use-local-storage-state';
import { concurrencyFormat } from '@/utils/concurrency-format';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';

const CartPage: React.FC = () => {
    const [cartInfo, setCartInfo] = useLocalStorageState('cart-info');
    const router = useRouter();

    const calcTotalPrice = useMemo(() => {
        if (!cartInfo || !Array.isArray(cartInfo)) return 0;

        return cartInfo.reduce((prev, curr) => {
            return prev + Number(curr.newPrice) * curr.quantity;
        }, 0);
    }, [cartInfo]);

    const quantityChangeHandler = (value: number, id: number) => {
        if (!cartInfo || !Array.isArray(cartInfo)) return;
        // tìm index của product trong array cần update
        const getProductIndex = cartInfo.findIndex((x) => x.id === id);

        // nếu product được tìm không tồn tại thì sẽ return dừng thực thi tiếp
        if (getProductIndex === -1) {
            return;
        }

        cartInfo[getProductIndex].quantity = value;
        setCartInfo([...cartInfo]);
    };

    const removeHandler = (id: number) => {
        if (!cartInfo || !Array.isArray(cartInfo)) return;

        const filterCart = cartInfo.filter((x) => x.id !== id);
        setCartInfo([...filterCart]);
    };

    const checkoutHandler = () => {
        console.log('next step');
    };

    if (!cartInfo || !Array.isArray(cartInfo)) {
        return (
            <div className="p-10">
                Không tìm thấy sản phẩm nào trong giỏ hàng
            </div>
        );
    }

    return (
        <div className="mx-auto min-h-screen w-1/2">
            <div className="mt-4 flex justify-center border-b text-[18px]">
                <span
                    className="mb-2 font-semibold"
                    style={{ color: '#1890ff' }}
                >
                    Giỏ hàng của bạn
                </span>
            </div>

            <div className="h-auto min-h-[inherit] rounded-md border-2 border-blue-400 bg-white shadow">
                {cartInfo.map((cart) => (
                    <CartDetailItem
                        key={cart.id}
                        cart={cart}
                        onQuantityChange={quantityChangeHandler}
                        onRemove={removeHandler}
                    />
                ))}
            </div>

            <div className="mt-4 flex flex-row items-start justify-between">
                <div className="flex flex-col gap-2">
                    <div className="font-bold">Tổng số tiền thanh toán:</div>
                    <div className="text-sm">- Số lượng: {cartInfo.length}</div>
                    <div>
                        Thành tiền:{' '}
                        <span className="text-lg font-bold text-red-500">
                            {concurrencyFormat(calcTotalPrice)}
                        </span>
                    </div>
                </div>
                <div>
                    <Button
                        size="large"
                        type="primary"
                        onClick={checkoutHandler}
                    >
                        Thanh toán
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
