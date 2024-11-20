import React, { useState } from 'react';
import DiscountDetail from '@/components/discount/common/detail-page';
import ProductCarousel from '@/components/discount/common/product-carousels';

const SomePage = () => {
    const [imageSrc, setImageSrc] = useState('');

    const handleImageChange = (newImageSrc) => {
        setImageSrc(newImageSrc);
    };
    const coupons = [
        {
            img: '/discount/coupon/brands/ysl.svg',
            name: 'GIFT COUPON',
            discount_value: 150,
            minimum_amount: 2000,
            end_date: '2024/11/30',
            coupon_id: 45
        },
        {
            img: '/discount/coupon/brands/ysl.svg',
            name: 'SPECIAL DISCOUNT',
            discount_value: 0.8,
            minimum_amount: 2000,
            end_date: '2024/11/30',
            coupon_id: 44
        },
        // 可以添加更多優惠券
    ];

    return (
        <>
            <DiscountDetail
                title="【YSL】周年慶預購會，購買指定商品享95折"
                date="2024/10/01 00:00 - 2024/11/30 23:59 (GMT+08)"
                content="活動期間內購買YSL指定商品，即享有95折優惠無上限。"
                details="於商城內和指定品牌消費並使用指定優惠券，結帳滿$1000元即享有95折優惠，數量有限，用完為止。優惠券有效期限至2024-11-30。"
                largeImageSrc='/discount/ysl-discount.svg' // 傳遞大圖片
                smallImageSrc='/discount/phone-size/ysl.svg' // 傳遞小圖片
                coupons={coupons}
                onImageChange={handleImageChange}
            />
            <ProductCarousel />
        </>
    );
};

export default SomePage;
