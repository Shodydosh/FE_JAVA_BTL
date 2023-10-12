import React from 'react'
import ProductCard from './ProductCard'

const productArray = [1,1,1,1,1,1,1,1,1,1,1,1,1]
const ProductList = () => {
  return (
    <>
        <h1 className='my-8 text-3xl font-bold text-blue-500'>Product List</h1>
        <div className='flex flex-wrap -mx-4'>
        {productArray.map((productIndex) => (
            <div key={productIndex} className='w-1/4 px-4 mb-4'>
                <ProductCard />
            </div>
        ))}
        </div>
    </>
  )
}

export default ProductList