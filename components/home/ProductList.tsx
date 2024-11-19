import React, { useState, useMemo } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortOrder, setSortOrder] = useState('none'); // Add this

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(productData?.map((p: Product) => p.category));
    return ['all', ...Array.from(cats)];
  }, [productData]);

  // Update filteredProducts to include sorting
  const filteredProducts = useMemo(() => {
    if (!productData) return [];
    
    let filtered = productData.filter((product: Product) => {
      const priceStr = String(product.price);
      const price = parseFloat(priceStr.replace(/[^0-9.-]+/g, '')) || 0;
      
      const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
      let matchPrice = true;

      switch (priceRange) {
        case 'under5m':
          matchPrice = price < 5000000;
          break;
        case '5m-10m':
          matchPrice = price >= 5000000 && price <= 10000000;
          break;
        case '10m-20m':
          matchPrice = price > 10000000 && price <= 20000000;
          break;
        case 'over20m':
          matchPrice = price > 20000000;
          break;
      }

      return matchCategory && matchPrice;
    });

    // Add sorting
    if (sortOrder !== 'none') {
      filtered.sort((a, b) => {
        const priceA = parseFloat(String(a.price).replace(/[^0-9.-]+/g, '')) || 0;
        const priceB = parseFloat(String(b.price).replace(/[^0-9.-]+/g, '')) || 0;
        return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }

    return filtered;
  }, [productData, selectedCategory, priceRange, sortOrder]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className='mb-12 text-3xl font-bold text-gray-800 text-center'>
        Danh Sách Sản Phẩm
      </h1>
      
      <div className='mb-10 p-6 bg-white rounded-lg shadow-sm'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>Danh mục:</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 transition-all'
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Tất cả' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>Khoảng giá:</label>
            <select 
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className='w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg
                focus:ring-blue-500 focus:border-blue-500 transition-all'
            >
              <option value="all">Tất cả</option>
              <option value="under5m">Dưới 5 triệu</option>
              <option value="5m-10m">5 - 10 triệu</option>
              <option value="10m-20m">10 - 20 triệu</option>
              <option value="over20m">Trên 20 triệu</option>
            </select>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>Sắp xếp theo giá:</label>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className='w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg
                focus:ring-blue-500 focus:border-blue-500 transition-all'
            >
              <option value="none">Mặc định</option>
              <option value="asc">Giá tăng dần</option>
              <option value="desc">Giá giảm dần</option>
            </select>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {filteredProducts.slice(0, 20).map((product: Product) => (
          <div key={product.id} className='transform hover:-translate-y-1 transition-transform duration-200'>
            <ProductCard data={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
