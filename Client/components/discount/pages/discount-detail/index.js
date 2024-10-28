import React, { useEffect, useState }  from 'react';
import Coupon from '@/components/discount/common/coupon';
import Header from '@/components/home/common/header';
import styles from './index.module.scss'; // 確保引入正確的樣式

export default function DiscountDetail() {
    const [imageSrc, setImageSrc] = useState('/discount/nars2-1920.svg');
    useEffect(() => {
        const handleResize = () => {
            setImageSrc(window.innerWidth < 768 ? '/discount/phone-size/nars1.svg' : '/discount/nars-1920.svg');
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // 初始設置

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <>
            <Header />
            <header className={styles.title}>
                <img className={styles.img} src={imageSrc} alt="NARS 優惠" ></img>
            </header>

            <main className="container">
                <nav className={styles.nav}>
                    <a className="text-decoration-none" href="">首頁</a> / 優惠活動
                </nav>
                <section className={styles.section}>
                    <h1 className={`${styles.title} text-center h1`}>【NARS】九月購物狂歡，購買指定商品享85折</h1>
                    <article className={styles.article}>
                        <div className={`${styles["sub-title"]} align-self-stretch h6`}>
                            <span className="h5">活動日期</span><br />
                            2024/9/01 00:00 - 2024/9/30 23:59 (GMT+08)
                        </div>
                        <hr className="align-self-stretch" />
                        <div className={`${styles["sub-title"]} align-self-stretch h6`}>
                            <span className="h5">優惠內容</span><br />
                            活動期間內購買NARS指定商品，滿2000即享有85折優惠。
                        </div>
                        <hr className="align-self-stretch" />
                        <div className={`${styles["sub-title"]} align-self-stretch h6`}>
                            <span className="h5">活動詳情</span><br />
                            於商城內和指定品牌消費並使用指定優惠券，結帳滿$2000元即享有85折優惠，數量有限，用完為止。優惠券有效期限至2024-9-30。（此優惠代碼為Beatique提供，請在購物車/結帳頁內全站優惠券入口輸入或選用，同一帳號/同一人限使用一次。
                        </div>
                        <hr className="align-self-stretch" />
                        <div className="coupon-group d-flex flex-wrap justify-content-around">
                            <Coupon />
                            <Coupon />
                        </div>
                    </article>
                </section>
            </main>
        </>
    );
}

