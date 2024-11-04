import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CouponUse from '@/components/discount/common/coupon-use';
import styles from './index.module.scss';
import UserSection from '@/components/user/common/user-section';

export default function UserCoupon() {
    const router = useRouter();
    const { userId } = router.query; // 從路由中獲取 userId
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const brandImageMap = {
        1: '/discount/coupon/brands/bobbi.svg',
        2: '/discount/coupon/brands/estee.svg',
        3: '/discount/coupon/brands/lancome.svg',
        4: '/discount/coupon/brands/nars.svg',
        5: '/discount/coupon/brands/ysl.svg',
    };

    const fetchCoupons = async () => {
        if (!userId) return; // 確保 userId 存在
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3005/api/user-coupons/${userId}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            setCoupons(data);
        } catch (error) {
            console.error('Error fetching coupons:', error);
            setError(`獲取優惠券失敗：${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons(); // 確保每次 userId 改變時調用
    }, [userId]);

    return (
        <UserSection titleCN="優惠券" titleENG="Coupon">
            <aside className={styles.right}>
                <Link href="/user/coupon/history" className={`${styles.history} text-decoration-none p`}>
                    歷史紀錄
                </Link>
                {loading && <p>加載中...</p>}
                {error && <p className="text-danger">{error}</p>}
                <div className={`${styles["coupon-group"]} d-flex flex-wrap justify-content-around align-items-center pt-4`}>
                    {coupons
                        .filter(coupon => new Date(coupon.end_date) > new Date()) // 過濾過期的優惠券
                        .map((coupon, index) => (
                            <CouponUse
                                key={index}
                                img={brandImageMap[coupon.brand_id]}
                                name={coupon.name}
                                discount={coupon.discount_value > 1 ? `折 ${coupon.discount_value}元` : `${(1 - coupon.discount_value).toFixed(2) * 100}% OFF`} // 動態格式
                                condition={coupon.minimum_amount}
                                expiration={coupon.end_date}
                            />
                        ))}
                </div>
            </aside>
        </UserSection>
    );
}
