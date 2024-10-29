import React, { useEffect, useState } from 'react';
import Coupon from '@/components/discount/common/coupon';
import Header from '@/components/home/common/header';
import styles from './index.module.scss'; // 確保引入正確的樣式
import Footer from '@/components/home/common/footer'


export default function DiscountDetail({
    title = "",
    date = "",
    content,
    details = "",
    largeImageSrc = '/discount/nars-1920.svg', // 大圖片默認值
    smallImageSrc = '/discount/phone-size/nars1.svg', // 小圖片默認值
    coupons,
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
            <Header />
            <header className={styles.title}>
                <img className={styles.img} src={currentImageSrc} alt="NARS 優惠" />
            </header>

            <main className="container">
                <nav className={styles.nav}>
                    <a className="text-decoration-none" href="">首頁</a> / 優惠活動
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
                    </article>
                </section>
            </main>
            
            <Footer />
        </>
    );
}
