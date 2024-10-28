import React from 'react';
import styles from './index.module.scss';

export default function Coupon() {
    return (
        <div className={`${styles['coupon-lg']} d-flex align-items-center justify-content-around px-2`}>
            <div className={styles.img}></div>
            <div className={styles.text}>
                <div className={styles['h3-L']}>GIFT COUPON</div>
                <div className={styles['h2-L']}>20% OFF</div>
                <div className={styles.h6}>滿$2000</div>
            </div>
            <div className="align-self-end text-center pb-2 d-flex flex-column align-items-end">
                <button className={`${styles['btn']} ${styles['btn-outline-light']} h6 align-content-center`}>領取</button>
                <div className={styles.p}>使用期限2024/10/5</div>
            </div>
        </div>
    );
}