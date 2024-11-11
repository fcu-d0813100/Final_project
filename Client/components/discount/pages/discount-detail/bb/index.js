import React, { useState, useEffect } from 'react';
import DiscountDetail from '@/components/discount/common/detail-page';  // 假设你已经有这个组件

const SomePage = () => {
    const coupons = [
        {
            img: '/discount/coupon/brands/bobbi.svg',
            name: 'GIFT COUPON',
            discount_value: 0.2,
            minimum_amount: 2000,
            end_date: '2025/01/11',
            coupon_id:50
        },
        {
            img: '/discount/coupon/brands/bobbi.svg',
            name: 'SPECIAL DISCOUNT',
            discount_value: 0.15,
            minimum_amount: 1500,
            end_date: '2025/01/31',
            coupon_id:51
        },
        // 可以添加更多優惠券
    ];
    return (
        <DiscountDetail 
            title="【Bobbi】九月購物狂歡，購買指定商品享85折"
            date="2024/9/01 00:00 - 2024/9/30 23:59 (GMT+08)"
            content="活動期間內購買NARS指定商品，滿2000即享有85折優惠。"
            details="於商城內和指定品牌消費並使用指定優惠券，結帳滿$2000元即享有85折優惠，數量有限，用完為止。優惠券有效期限至2024-9-30。"
            largeImageSrc='/discount/bb-discount.svg' // 传递大图片
            smallImageSrc='/discount/phone-size/bb.svg' // 传递小图片
            coupons={coupons}  // 传递优惠券数据
        />
    );
};

export default SomePage;
