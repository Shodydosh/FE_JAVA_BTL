import React from 'react';
import { Carousel, Card, Typography, Tag, Spin } from 'antd';
import { GiftOutlined } from '@ant-design/icons';
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
        slidesToScroll: 3,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
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

  return (
    <Card className="mb-8 overflow-hidden">
      <div className="px-4">
        <Carousel
          autoplay
          dots={true}
          infinite={true}
          speed={500}
          autoplaySpeed={3000}
          slidesToShow={3}
          slidesToScroll={3}
          className="promotion-slider -mx-2"
          responsive={responsiveSettings}
          swipeToSlide={true}
        >
          {discounts.map((promo) => (
            <div key={promo.id} className="px-2">
              <Card
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100"
                size="small"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <GiftOutlined className="text-2xl text-blue-500" />
                    <div>
                      <Title level={5} className="!mb-0">
                        {promo.name}
                      </Title>
                      <Text className="text-sm text-gray-600">
                        Giảm {promo.type === 'PERCENTAGE' ? `${promo.value}%` : `${promo.value.toLocaleString()}đ`}
                        {promo.type === 'PERCENTAGE' && promo.maxDiscountAmount && 
                          ` (tối đa ${promo.maxDiscountAmount.toLocaleString()}đ)`}
                      </Text>
                    </div>
                  </div>

                  {promo.description && (
                    <Text className="text-sm text-gray-600 block">
                      {promo.description}
                    </Text>
                  )}

                  <div className="text-xs text-gray-500">
                    {promo.minOrderAmount !=null && (
                      <div>Đơn tối thiểu: {promo.minOrderAmount.toLocaleString()}đ</div>
                    )}
                    <div>
                      HSD: {new Date(promo.endDate).toLocaleDateString('vi-VN')}
                    </div>
                    {promo.maxUsage && (
                      <div>
                        Còn lại: {promo.maxUsage - promo.currentUsage}/{promo.maxUsage} lượt
                      </div>
                    )}
                  </div>

                  <Tag color="blue" className="mt-1">
                    Mã: {promo.code}
                  </Tag>
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
