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
            img: '/discount/coupon/brands/nars.svg',
            name: 'SHOPPING GO',
            discount_value: 100,
            minimum_amount: 1500,
            end_date: '2024/12/12',
            coupon_id: 47
        },
        {
            img: '/discount/coupon/brands/nars.svg',
            name: 'SHOPPING GO',
            discount_value: 100,
            minimum_amount: 1500,
            end_date: '2024/12/12',
            coupon_id: 46
        },
        // 可以添加更多優惠券
    ];

    return (
        <>
            <DiscountDetail
                title="【NARS】雙十二月購物狂歡優惠，購買指定商品折100元"
                date="2024/12/01 00:00 - 2024/12/12 23:59 (GMT+08)"
                content="活動期間內購買NARS指定商品，滿1500即享有100元現金折扣優惠。"
                details="於商城內和指定品牌消費並使用指定優惠券，結帳滿$1500元即享有100元現金折扣，數量有限，用完為止。優惠券有效期限至2024-12-12。"
                largeImageSrc='/discount/nars-discount2.svg' // 傳遞大圖片
                smallImageSrc='/discount/phone-size/nars.svg' // 傳遞小圖片
                coupons={coupons}
                onImageChange={handleImageChange}
            />
            <ProductCarousel />
        </>
    );
};

export default SomePage;
