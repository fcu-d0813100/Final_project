import React, { useState } from 'react';
import Link from 'next/link';
import Coupon from '@/components/discount/common/coupon';
import styles from './index.module.scss'; // 確保引入正確的樣式
import UserSection from '@/components/user/common/user-section';
import Modal from '@/components/discount/common/mymodal'; // 引入自定義模態框


export default function UserCoupon() {
    const [modalShow, setModalShow] = useState(false); // 使用狀態來控制模態框顯示

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
        // 可以添加更多優惠券
    ];

    return (
        <>
            <UserSection titleCN="優惠券" titleENG='Coupon'>
                <aside className={styles.right}>
                    <Link href="/user/coupon/history" className={`${styles.history} text-decoration-none p`}>
                        歷史紀錄
                    </Link>

                    <button onClick={() => setModalShow(true)} className={`${styles.btn}`}></button>

                    <Modal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        title="Modal heading"
                        body={{ title: "Centered Modal", content: "這是模態框的內容。" }}
                    />

                    <div className={styles.content}>
                        <div className={`${styles.search} d-flex justify-content-center align-items-center`}>
                            <div className={`p me-4`}>新增優惠券</div>
                            <input className="p-1 me-4" type="text" placeholder="請輸入優惠券代碼" />
                            <div className={`${styles.btn}`}>領取</div>
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
