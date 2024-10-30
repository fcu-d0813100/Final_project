import React from 'react';
import styles from './index.module.scss';

const Coupon = ({
    img = "",
    title = "",
    discount = "",
    condition = 0,
    expiration = "無使用期限" }) => {
    return (
        <div className={`${styles['coupon-lg']} d-flex align-items-center justify-content-around px-2`}>
            <div className={styles.img}>
                <img className={styles['coupon-image']} src={img} alt="Coupon Image" />
            </div>
            <div className={styles.text}>
                <div className={`${styles.name} h3-L`}>{title}</div>
                <div className={`${styles.discount} h2-L`}>{discount}</div>
                <div className={`${styles.max} h6`}>{condition}</div>
            </div>
            <div className="align-self-end text-center pb-2 pe-1 d-flex flex-column align-items-end">
                <button className={`${styles.btn} ${styles['btn-outline-light']} h6`}>
                    領取
                </button>
                <div className={`${styles['right-ps']} ps`}>使用期限：{expiration}</div>
            </div>
        </div>
    );
};

export default Coupon;
