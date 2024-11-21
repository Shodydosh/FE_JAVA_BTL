import React, { useState, useMemo } from 'react';
import { Card, Select, Layout, Typography, Pagination, Row, Col, Space } from 'antd';
import ProductCard from './ProductCard';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

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
  const [sortOrder, setSortOrder] = useState('none');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); // Changed from const to state

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

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSizeChange = (current: number, size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1); // Reset to first page when changing size
  };

  return (
    <Content className="site-layout-content" style={{ padding: '0 50px', marginTop: 24 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
        Danh Sách Sản Phẩm
      </Title>

      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Typography.Text strong>Danh mục:</Typography.Text>
              <Select
                style={{ width: '100%' }}
                value={selectedCategory}
                onChange={setSelectedCategory}
              >
                {categories.map(cat => (
                  <Option key={cat} value={cat}>
                    {cat === 'all' ? 'Tất cả' : cat}
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>

          <Col span={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Typography.Text strong>Khoảng giá:</Typography.Text>
              <Select
                style={{ width: '100%' }}
                value={priceRange}
                onChange={setPriceRange}
              >
                <Option value="all">Tất cả</Option>
                <Option value="under5m">Dưới 5 triệu</Option>
                <Option value="5m-10m">5 - 10 triệu</Option>
                <Option value="10m-20m">10 - 20 triệu</Option>
                <Option value="over20m">Trên 20 triệu</Option>
              </Select>
            </Space>
          </Col>

          <Col span={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Typography.Text strong>Sắp xếp theo giá:</Typography.Text>
              <Select
                style={{ width: '100%' }}
                value={sortOrder}
                onChange={setSortOrder}
              >
                <Option value="none">Mặc định</Option>
                <Option value="asc">Giá tăng dần</Option>
                <Option value="desc">Giá giảm dần</Option>
              </Select>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {paginatedProducts.map((product: Product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={8} xl={6}>
            <ProductCard data={product} />
          </Col>
        ))}
      </Row>

      {totalPages > 1 && (
        <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
          <Pagination
            current={currentPage}
            total={filteredProducts.length}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
            onShowSizeChange={handleSizeChange}
            showSizeChanger={true}
            pageSizeOptions={['8', '16', '24', '32']}
          />
        </Row>
      )}
    </Content>
  );
};

export default ProductList;
