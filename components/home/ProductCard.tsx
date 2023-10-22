'use client'
import React from 'react';
import { EllipsisOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const { Text, Link, Title } = Typography;
const { Meta } = Card;

interface ProductCardProps {
<<<<<<< HEAD
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
=======
  data: {
    id: string;
    retailer: string;
    img_url: string;
    name: string;
    price: string;
    url: string;
    category: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const router = useRouter()
  const isValidImage = data.img_url && (data.img_url.startsWith("/") || data.img_url.startsWith("http"));
  const handleClick = () => {
    const productId = data.id; // Assuming data.id is a string
    router.push(`/product/${productId}`);
  };
  

  return (
    <div className="w-full h-full rounded shadow-lg hover:cursor-pointer" onClick={handleClick}>
      <div className="bg-white p-4">
        <Image
          src={data.img_url}
          alt="Product"
          width={400}
          height={400}
          unoptimized={true}
        />
        <div className="mt-4 flex-row">
          <h1 className="font-semibold text-black text-lg h-24">{data.name}</h1>
          <div className="mt-2">
            <p className="text-sm line-through text-gray-500">Old Price</p>
            <p className="text-sm text-gray-500">info</p>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl text-blue-400">{data.price}</h3>
          </div>
        </div>
        <div className="mt-4 flex">
            <ShoppingCartOutlined className="text-gray-600 text-2xl" key="add to cart" />
        </div>
      </div>
    </div>
  );
};

>>>>>>> 2b5724ad726ee2c764e35c4a7602a8ff47bab676
export default ProductCard;
