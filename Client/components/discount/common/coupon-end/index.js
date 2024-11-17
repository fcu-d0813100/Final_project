import React from 'react';
import styles from './index.module.scss';

const Coupon = ({
    status = "已過期",
    img = '/discount/coupon/brands/bobbi.svg',
    name = 'GIFT COUPON',
    discount = '20% OFF',
    condition = 0,
    expiration = "無使用期限" }) => {
    return (

        <div className={`${styles['coupon-lg']} d-flex align-items-center justify-content-around px-2`}>
            <div className={styles.overlay}><div className={`${styles.pass} h6`}>{status}</div></div>
            <div className={styles.img}>
                <img className={styles['coupon-image']} src={img} alt="Coupon Image" />
            </div>
            <div className={styles.text}>
                <div className={`${styles.name} h3-L`}>{name}</div>
                <div className={`${styles.discount} h2-L`}>{discount}</div>
                <div className={`${styles.max} p`}>滿NT${condition}</div>
            </div>
            <div className="align-self-end text-center pb-2 pe-1 d-flex flex-column align-items-end">
                <div className={`${styles['right-ps']} ps`}>使用期限：{expiration}</div>
            </div>
        </div>

    );
};

export default Coupon;
