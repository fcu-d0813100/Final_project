import React, { useState } from 'react';
import DiscountDetail from '@/components/discount/common/detail-page';

const SomePage = () => {
    const [imageSrc, setImageSrc] = useState('');

    const handleImageChange = (newImageSrc) => {
        setImageSrc(newImageSrc);
    };
    const coupons = [
        {
            img: '/discount/coupon/brands/nars.svg',
            name: 'GIFT COUPON',
            discount_value: 120,
            minimum_amount: 2000,
            end_date: '2024/12/31',
            coupon_id:49
        },
        {
            img: '/discount/coupon/brands/nars.svg',
            name: 'SPECIAL DISCOUNT',
            discount_value: 100,
            minimum_amount: 1500,
            end_date: '2024/12/25',
            coupon_id:48
        },
        // 可以添加更多優惠券
    ];

    return (
        <DiscountDetail 
            title="【NARS】九月購物狂歡，購買指定商品享85折"
            date="2024/9/01 00:00 - 2024/9/30 23:59 (GMT+08)"
            content="活動期間內購買NARS指定商品，滿2000即享有85折優惠。"
            details="於商城內和指定品牌消費並使用指定優惠券，結帳滿$2000元即享有85折優惠，數量有限，用完為止。優惠券有效期限至2024-9-30。"
            largeImageSrc='/discount/nars-discount.svg' // 傳遞大圖片
            smallImageSrc='/discount/phone-size/nars1.svg' // 傳遞小圖片
            coupons={coupons}
            onImageChange={handleImageChange}
        />
    );
};

export default SomePage;
