import React, { useState } from 'react';
import Link from 'next/link';
import Coupon from '@/components/discount/common/coupon';
import styles from './index.module.scss';
import UserSection from '@/components/user/common/user-section';
import Modal from '@/components/discount/common/mymodal';

export default function UserCoupon() {
    const [modalShow, setModalShow] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    


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

    const handleClaimCoupon = () => {
        // 在這裡添加優惠券代碼的處理邏輯
        console.log(`Claiming coupon: ${couponCode}`);
    };

    return (
        <>
            <UserSection titleCN="優惠券" titleENG='Coupon'>
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
                        title="Modal heading"
                        body={{ title: "Centered Modal", content: "這是模態框的內容。" }}
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
