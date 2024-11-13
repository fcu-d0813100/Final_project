import React from 'react';
import styles from './index.module.scss'; // 確保引入正確的樣式
import Link from 'next/link';

export default function Brands() {
    return (
        <>
            <div className={`${styles['brands']} container-sm d-flex align-items-center`}>
                <div className="header text-center ">
                    <div className={`${styles['title']} h3-L border-bottom border-dark border-2`}>Featured Brands</div>
                    <div className={`h5 p-3 ${styles["sub-title"]}`}>精選品牌｜從經典到新潮，盡在掌握</div>
                </div>
                <div className={`${styles['img-group']} d-flex flex-wrap justify-content-center`}>
                    <Link className={styles.bb} href="/product/product-list?brand=Bobbi%20Brown" passHref></Link>
                    <Link className={styles.estee} href="/product/product-list?brand=Estee%20Lauder" passHref></Link>
                    <Link className={styles.lancome} href="/product/product-list?brand=LANCOME" passHref></Link>
                    <Link className={styles.nars} href="/product/product-list?brand=NARS" passHref></Link>
                    <Link className={styles.ysl} href="/product/product-list?brand=YSL" passHref></Link>
                </div>
            </div>

        </>
    );
}
