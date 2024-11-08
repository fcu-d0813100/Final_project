import React, { useEffect, useState } from 'react';
import Coupon from '@/components/discount/common/coupon-add';
import styles from './index.module.scss';
import Link from 'next/link';

export default function DiscountDetail({
    title = "",
    date = "",
    content,
    details = "",
    largeImageSrc = '/discount/nars-1920.svg', // 大圖片默認值
    smallImageSrc = '/discount/phone-size/nars1.svg', // 小圖片默認值
    coupons = [],
    onImageChange

}) {

    const [currentImageSrc, setCurrentImageSrc] = useState(largeImageSrc);

    useEffect(() => {
        const handleResize = () => {
            const newImageSrc = window.innerWidth < 768 ? smallImageSrc : largeImageSrc;
            setCurrentImageSrc(newImageSrc);
            if (onImageChange) {
                onImageChange(newImageSrc);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // 初始設置

        return () => window.removeEventListener('resize', handleResize);
    }, [largeImageSrc, smallImageSrc, onImageChange]);

    return (
        <>
            <header className={styles.title}>
                <img className={styles.img} src={currentImageSrc} alt="NARS 優惠" />
            </header>

            <main className="container">
                <nav className={styles.nav}>
                    <Link href="/" className="text-decoration-none">首頁 /</Link>
                    <Link href="/discount" className="text-decoration-none">
                        <span> </span>優惠活動
                    </Link>
                    {' / 活動詳情'}
                </nav>
                <section className={styles.section}>
                    <h1 className={`${styles.title} text-center h1`}>{title}</h1>
                    <article className={styles.article}>
                        <div className={`${styles["sub-title"]} align-self-stretch h6`}>
                            <span className="h5">活動日期</span><br />
                            {date}
                        </div>
                        <hr className="align-self-stretch" />
                        <div className={`${styles["sub-title"]} align-self-stretch h6`}>
                            <span className="h5">優惠內容</span><br />
                            {content}
                        </div>
                        <hr className="align-self-stretch" />
                        <div className={`${styles["sub-title"]} align-self-stretch h6`}>
                            <span className="h5">活動詳情</span><br />
                            {details}
                        </div>
                        <hr className="align-self-stretch" />
                        <div className="coupon-group d-flex flex-wrap justify-content-around">
                            {coupons && coupons.length > 0 ? (
                                coupons.map((coupon) => (
                                    <Coupon
                                        key={coupon.coupon_id}  // coupon_id 必须对应实际字段
                                        img={coupon.img}  // 确保 img 字段存在
                                        name={coupon.name}
                                        discount_value={
                                            coupon.discount_value > 1
                                                ? `折 ${coupon.discount_value}元`  // 如果折扣值大于1，则为固定金额折扣
                                                : `${((1 - coupon.discount_value) * 100).toFixed(0)}% OFF`  // 如果折扣值小于等于1，则为百分比折扣
                                        }
                                        minimum_amount={coupon.minimum_amount}
                                        end_date={coupon.end_date}
                                        coupon_id={coupon.coupon_id}
                                    />
                                ))
                            ) : (
                                <p>没有可用的优惠券</p>
                            )}
                        </div>
                    </article>
                </section>
            </main>
        </>
    );
}
