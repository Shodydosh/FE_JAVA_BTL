import React from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  retailer: string;
  img_url: string;
  name: string;
  price: string;
  url: string;
  category: string;
}

const ProductList = (props: any) => {
  const { productData } = props;
  console.log("🚀 ~ file: ProductList.tsx:7 ~ ProductList ~ productData:", productData);
  return (
    <>
      <h1 className='my-8 text-3xl font-bold text-blue-500'>Product List</h1>
      <div className='flex flex-wrap -mx-4'>
        {productData && productData.slice(0, 20).map((product: Product) => (
          <div key={product.id} className='w-1/4 px-4 mb-4'>
            <ProductCard data={product} />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductList;
