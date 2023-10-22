import React from 'react';
import ProductCard from './ProductCard';

<<<<<<< HEAD
// const productArray = [1,1,1,1,1,1,1,1,1,1,1,1,1]
const productArray = [
    {
        id: 1,
        name: 'LAPTOP DELL VOSTRO 5620 (70282719) (I5 1240P 16GB/512GB SSD/16.0FHD+/WIN11/OFFICEHS21/XÁM)',
        info: 'CPU: Intel® Core™ i5-1240P (3.30 GHz up to 4.20 GHz, 12MB)\nRAM: 16GB (2x8GB) DDR4 3200MHz\nỔ cứng: 512GB M.2 PCIe NVMe SSD\nVGA: Intel® Iris® Xe Graphics\nMàn hình: 16.0-inch 16:10 FHD+ (1920 x 1200) Anti-Glare Non-Touch 250nits\nMàu sắc: Xám\nOS: Win 11 Home',
        oldPrice: '22.299.000₫',
        newPrice: '21.999.000đ',
    },
    {
        id: 2,
        name: 'LAPTOP DELL INSPIRON 5620 (N6I7110W1) (I7 1255U 8GB RAM/512GB SSD/16.0 INCH FHD+/WIN11/OFFICE HS21/BẠC)',
        info: 'CPU: Intel Core i7 1255U (Up to 4.7 Ghz, 18Mb)\nRAM: 8GB DDR4 3200Mhz (2 khe tối đa 32Gb)\nỔ cứng: 512Gb M.2 PCIe NVMe SSD\nVGA: Intel Iris XE graphic\nMàn hình: 16inch FHD (1920 x 1200) Anti-Glare 300 nits\nMàu sắc: Silver\nOS: Windows 11 Home SL + Office Home and Student',
        oldPrice: '22.349.000₫',
        newPrice: '21.999.000₫',
    },
    {
        id: 3,
        name: 'LAPTOP ASUS GAMING TUF FX507ZC4-HN074W (I5 12500H/8GB RAM/512GB SSD/15.6 FHD 144HZ/RTX 3050 4GB/WIN11/XÁM)',
        info: 'CPU: Intel Core i5-12500H (3.30 GHz upto 4.50 GHz, 18MB)\nRAM: 8GB (1x 8GB) DDR4-3200MHz (2 khe) (Tối đa 32GB)\nỔ cứng: 512GB SSD M.2 2280 PCIe 3.0x4 NVMe (Còn trống 1 khe)\nVGA: NVIDIA GeForce RTX 3050 4GB GDDR6\nMàn hình: 16inch FHD (1920 x 1200) Anti-Glare 300 nits\nMàu sắc: Silver\nOS: Windows 11 Home SL + Office Home and Student',
        oldPrice: '22.349.000₫',
        newPrice: '21.999.000₫',
    },
    {
        id: 4,
        name: 'LAPTOP ASUS VIVOBOOK K6502VU-MA090W (I9 13900H/16GB RAM/512GB SSD/15.6 2.8K OLED/RTX4050 6GB/WIN11/BẠC)',
        info: 'CPU: Intel Core i7-12500H (3.30 GHz upto 4.50 GHz, 18MB)\nRAM: 8GB (1x 8GB) DDR4-3200MHz (2 khe) (Tối đa 32GB)\nỔ cứng: 512GB SSD M.2 2280 PCIe 3.0x4 NVMe (Còn trống 1 khe)\nVGA: NVIDIA GeForce RTX 3050 4GB GDDR6\nMàn hình: 16inch FHD (1920 x 1200) Anti-Glare 300 nits\nMàu sắc: Silver\nOS: Windows 11 Home SL + Office Home and Student',
        oldPrice: '22.349.000₫',
        newPrice: '20.999.000₫',
    },
    {
        id: 5,
        name: 'LAPTOP MSI VIVOBOOK K6502VU-MA090W (I9 13900H/16GB RAM/512GB SSD/15.6 2.8K OLED/RTX4050 6GB/WIN11/BẠC)',
        info: 'CPU: Intel Core i7-12500H (3.30 GHz upto 4.50 GHz, 18MB)\nRAM: 8GB (1x 8GB) DDR4-3200MHz (2 khe) (Tối đa 32GB)\nỔ cứng: 512GB SSD M.2 2280 PCIe 3.0x4 NVMe (Còn trống 1 khe)\nVGA: NVIDIA GeForce RTX 3050 4GB GDDR6\nMàn hình: 16inch FHD (1920 x 1200) Anti-Glare 300 nits\nMàu sắc: Silver\nOS: Windows 11 Home SL + Office Home and Student',
        oldPrice: '22.349.000₫',
        newPrice: '20.999.000₫',
    },
    // ... Add more laptop items as needed
];
const ProductList = () => {
    return (
        <>
            <h1 className="my-8 text-3xl font-bold text-blue-500">
                Product List
            </h1>
            <div className="flex flex-wrap -mx-4">
                {productArray.map((productIndex) => (
                    // <div key={productIndex} className='w-1/4 px-4 mb-4'>
                    <div key={productIndex.id} className="w-1/4 px-4 mb-4">
                        <ProductCard
                            productName={productIndex.name}
                            productInfo={productIndex.info}
                            productOldPrice={productIndex.oldPrice}
                            productNewPrice={productIndex.newPrice}
                        />
                    </div>
                ))}
=======
interface Product {
  id: string;
  retailer: string;
  img_url: string;
  name: string;
  price: string;
  url: string;
  category: string;
}

const ProductList = (props : any) => {
  const {productData} = props; 
  console.log("🚀 ~ file: ProductList.tsx:7 ~ ProductList ~ productData:", productData)
  return (
    <>
        <h1 className='my-8 text-3xl font-bold text-blue-500'>Product List</h1>
        <div className='flex flex-wrap -mx-4'>
        {productData && productData.slice(0,20).map((product: Product) => (
            <div key={product.id} className='w-1/4 px-4 mb-4'>
                <ProductCard data={product}/>
>>>>>>> 2b5724ad726ee2c764e35c4a7602a8ff47bab676
            </div>
        </>
    );
};

export default ProductList;
