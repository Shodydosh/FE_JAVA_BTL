import React from 'react';
import { ProductProps } from '@/interfaces/ProductInterfaces';
interface ThisProps {
    productData: ProductProps;
}

const DeleteProductButton: React.FC<ThisProps> = ({ productData }) => {
    return <div>DeleteProductButton</div>;
};

export default DeleteProductButton;
