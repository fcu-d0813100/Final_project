import React, { useState } from 'react';
import Link from 'next/link';
import Coupon from '@/components/discount/common/coupon';
import styles from './index.module.scss';
import UserSection from '@/components/user/common/user-section';
import Modal from '@/components/discount/common/mymodal';

export default function UserCoupon() {
    const [modalShow, setModalShow] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', content: '' });
    const [couponCode, setCouponCode] = useState('');
    const [error, setError] = useState('');

    const coupons = [
        {
            img: '/discount/coupon/brands/bobbi.svg',
            title: 'GIFT COUPON',
            discount: '20% OFF',
            condition: '滿$2000',
            expiration: '2024/10/5',
        },
        {
            img: '/discount/coupon/brands/bobbi.svg',
            title: 'SPECIAL DISCOUNT',
            discount: '15% OFF',
            condition: '滿$1500',
            expiration: '2024/11/10',
        },
    ];

    const handleClaimCoupon = async () => {
        setError('');
        if (!couponCode) {
            setError('請輸入優惠券代碼');
            return;
        }

        try {
            // 假設這裡是後端驗證優惠券代碼的 API 呼叫
            const response = await fetch('/api/claim-coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode })
            });
            const data = await response.json();

            if (response.ok) {
                setModalContent({ title: '兌換成功', content: `優惠券 ${couponCode} 已成功兌換！` });
            } else {
                setModalContent({ title: '兌換失敗', content: data.message || '無效的優惠券代碼' });
            }
        } catch (error) {
            setModalContent({ title: '錯誤', content: '無法兌換優惠券，請稍後再試。' });
        } finally {
            setModalShow(true);
            setCouponCode('');
        }
    };

    return (
        <>
            <UserSection titleCN="優惠券" titleENG="Coupon">
                <aside className={styles.right}>
                    <Link href="/user/coupon/history" className={`${styles.history} text-decoration-none p`}>
                        歷史紀錄
                    </Link>

                    <button onClick={() => setModalShow(true)} className={`${styles.btn}`}>
                        新增優惠券
                    </button>

                    <Modal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        title={modalContent.title}
                        body={{ title: modalContent.title, content: modalContent.content }}
                    />

                    <div className={styles.content}>
                        <div className={`${styles.search} d-flex justify-content-center align-items-center`}>
                            <div className={`p me-4`}>新增優惠券</div>
                            <input
                                className="p-1 me-4"
                                type="text"
                                placeholder="請輸入優惠券代碼"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                            />
                            <div className={`${styles.btn}`} onClick={handleClaimCoupon}>領取</div>
                        </div>
                        {error && <div className="text-danger mt-2">{error}</div>}
                        <div className={`${styles["coupon-group"]} d-flex flex-wrap justify-content-around align-items-center pt-4`}>
                            {coupons.map((coupon, index) => (
                                <Coupon 
                                    key={index}
                                    img={coupon.img} 
                                    title={coupon.title} 
                                    discount={coupon.discount} 
                                    condition={coupon.condition} 
                                    expiration={coupon.expiration} 
                                />
                            ))}
                        </div>
                    </div>
                </aside>
            </UserSection>
        </>
    );
}
