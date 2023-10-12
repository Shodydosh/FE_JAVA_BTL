import React from 'react';
import { EllipsisOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Avatar, Card, Typography } from 'antd';
const { Text, Link, Title } = Typography;
const { Meta } = Card;

const ProductCard: React.FC = () => (
  <Card
    className="w-full rounded shadow-lg"
    cover={
      <div className='h-48 bg-purple-300'></div>
    }
    actions={[
        <EllipsisOutlined key="ellipsis" />,
        <ShoppingCartOutlined key="add to cart" />,
    ]}
  >
    <Meta
    //   avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
      title="Product"
      description={
        <>
                <p className="text-sm text-gray-500">info</p>
            <div>
                <p className="opacity-0.5 line-through">old price</p>
                <p className="text-sm text-gray-500">info</p>
            </div>
            <div>
                <h3 className="text-2xl text-blue-400">NEW PRICE</h3>
            </div>
        </>
      }
    />
  </Card>
);

export default ProductCard;