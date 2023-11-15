import React from 'react';
import ProductCard from '../home/ProductCard';

//@ts-ignore
const OtherProducts = ({ data }) => {
    console.log(
        '🚀 ~ file: OtherProducts.tsx:6 ~ OtherProducts ~ otherProducts:',
        data,
    );
    return (
        <div className="flex w-full space-x-4 ">
            {data &&
                //@ts-ignore
                data.map((element) => (
                    <div className="h-full w-1/5" key={element.id}>
                        <ProductCard data={element}></ProductCard>
                    </div>
                ))}
        </div>
    );
};

export default OtherProducts;
