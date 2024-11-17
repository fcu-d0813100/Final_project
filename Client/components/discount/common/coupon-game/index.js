import React from 'react';
import styles from './index.module.scss';

const CouponAll = ({
    name = 'GAME COUPON',
    discount = '20% OFF',
    code = "P5q6R7s8",
    expiration = "無使用期限" }) => {
    return (

        <div className={`${styles['coupon-lg']} d-flex align-items-center`}>
            
            <div className={styles.text}>
                <div className={`${styles.name} h3-L`}>{name}</div>
                <div className={`${styles.discount} h2-L`}>{discount}</div>
                <div className={`${styles.code} h1-L`}>{code}</div>
              
            </div>
            <div className="align-self-end text-center d-flex flex-column align-items-end">
                <div className={`${styles['right-ps']} ps`}>使用期限：{expiration}</div>
            </div>
        </div>

    );
};

export default CouponAll;
