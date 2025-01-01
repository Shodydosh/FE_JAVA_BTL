import React from 'react';
import { Carousel, Card, Typography, Tag, Spin, message } from 'antd';
import { GiftOutlined, ClockCircleOutlined, ShoppingOutlined, TagOutlined, CopyOutlined } from '@ant-design/icons';
import { useDiscounts } from '@/hooks/useDiscounts';

const { Text, Title } = Typography;

const PromotionSlider = () => {
  const { discounts, loading, error } = useDiscounts();

  if (loading) return (
    <Card className="mb-8 overflow-hidden">
      <div className="flex justify-center py-8">
        <Spin size="large" />
      </div>
    </Card>
  );

  if (error || !discounts.length) return null;

  const responsiveSettings = [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ];

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      message.success('Đã sao chép mã giảm giá!');
    }).catch(() => {
      message.error('Không thể sao chép mã giảm giá!');
    });
  };

  return (
    <Card className="mb-8 overflow-hidden shadow-lg rounded-xl">
      <div className="px-4">
        <Carousel
          autoplay
          dots={true}
          infinite={true}
          speed={500}
          autoplaySpeed={3000}
          slidesToShow={3}
          slidesToScroll={1}
          className="promotion-slider -mx-2"
          responsive={responsiveSettings}
          swipeToSlide={true}
        >
          {discounts.map((promo) => (
            <div key={promo.id} className="px-2 py-2 h-full">
              <Card
                className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl h-[180px] flex flex-col"
                style={{
                  background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                  borderRadius: '16px',
                  border: '1px solid rgba(99, 102, 241, 0.1)',
                }}
                size="small"
                bodyStyle={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="flex flex-col h-full">
                  {/* Header section - flex-shrink-0 to maintain size */}
                  <div className="flex items-start justify-between flex-shrink-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <GiftOutlined className="text-indigo-600 text-xl" />
                        <Title level={5} className="!mb-0 text-indigo-700">
                          {promo.name}
                        </Title>
                      </div>
                      <Text className="text-lg font-semibold text-indigo-600 block">
                        {promo.type === 'PERCENTAGE' ? `Giảm ${promo.value}%` : `Giảm ${promo.value.toLocaleString()}đ`}
                      </Text>
                    </div>
                    <div className="flex items-center">
                      <Tag 
                        className="ml-2 !border-none"
                        style={{ 
                          background: 'rgba(99, 102, 241, 0.1)',
                          color: '#4F46E5',
                          borderRadius: '8px',
                          padding: '4px 8px'
                        }}
                      >
                        {promo.code}
                      </Tag>
                      <button
                        onClick={() => copyToClipboard(promo.code)}
                        className="ml-1 p-1 rounded-md hover:bg-indigo-100 transition-colors text-indigo-600"
                        title="Sao chép mã"
                      >
                        <CopyOutlined className="text-base" />
                      </button>
                    </div>
                  </div>

                  {/* Promotion details - flex-grow-1 to fill remaining space */}
                  <div className="space-y-2 pt-2 border-t border-indigo-100 flex-grow mt-3">
                    {promo.description && (
                      <Text className="text-sm text-gray-600 block line-clamp-2">
                        {promo.description}
                      </Text>
                    )}
                    
                    {/* Push details to bottom using margin-top-auto */}
                    <div className="space-y-1 mt-auto">
                      {promo.minOrderAmount != null && (
                        <div className="flex items-center text-xs text-gray-600">
                          <ShoppingOutlined className="mr-1" />
                          Đơn tối thiểu: {promo.minOrderAmount.toLocaleString()}đ
                        </div>
                      )}
                      <div className="flex items-center text-xs text-gray-600">
                        <ClockCircleOutlined className="mr-1" />
                        HSD: {new Date(promo.endDate).toLocaleDateString('vi-VN')}
                      </div>
                      {promo.maxUsage && (
                        <div className="flex items-center text-xs text-gray-600">
                          <TagOutlined className="mr-1" />
                          Còn {promo.maxUsage - promo.currentUsage}/{promo.maxUsage} lượt
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </Carousel>
      </div>
    </Card>
  );
};

export default PromotionSlider;
