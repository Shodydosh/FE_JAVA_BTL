import React from 'react';
import { EllipsisOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Avatar, Card, Typography } from 'antd';
const { Text, Link, Title } = Typography;
const { Meta } = Card;

interface ProductCardProps {
    productName: string;
    productInfo: string;
    productOldPrice: string;
    productNewPrice: string;
}
const ProductCard: React.FC<ProductCardProps> = ({
    productName,
    productInfo,
    productOldPrice,
    productNewPrice,
}) => {
    const infoArray = productInfo.split('\n');

    const infoElements = infoArray.map((info, index) => (
        <div key={index}>{info}</div>
    ));
    return (
        <Card
            className="w-full rounded shadow-lg"
            cover={<div className="h-48 bg-purple-300"></div>}
            actions={[
                <ShoppingCartOutlined key="add to cart" />,
                <EllipsisOutlined key="ellipsis" />,
            ]}
        >
            <Meta
                //   avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
                title="Product"
                description={
                    // <>
                    //         <p className="text-sm text-gray-500">info</p>
                    //     <div>
                    //         <p className="opacity-0.5 line-through">old price</p>
                    //         <p className="text-sm text-gray-500">info</p>
                    //     </div>
                    //     <div>
                    //         <h3 className="text-2xl text-blue-400">NEW PRICE</h3>
                    //     </div>
                    // </>
                    <>
                        <p className="text-sm text-gray-500">{productName}</p>
                        <div>
                            <p className="text-sm text-gray-500">
                                Thông số sản phẩm:
                                <br />
                            </p>
                            <div className="opacity-0.5">{infoElements}</div>
                            <p className="text-sm text-gray-500">
                                {productOldPrice}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl text-blue-400">
                                {productNewPrice}
                            </h3>
                        </div>
                    </>
                }
            />
        </Card>
    );
};
export default ProductCard;
