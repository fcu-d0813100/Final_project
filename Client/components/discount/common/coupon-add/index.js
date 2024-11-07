import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import Link from 'next/link';

const Coupon = ({ coupon_id = 0,
    img = "",
    name = "",
    discount_value = "",
    minimum_amount = 0,
    end_date = "無使用期限"
}) => {

    return (
        <div className={`${styles['coupon-lg']} d-flex align-items-center justify-content-around px-2`}>
            <div className={styles.img}>
                <img className={styles['coupon-image']} src={img} alt="Coupon Image" />
            </div>
            <div className={styles.text}>
                <div className={`${styles.name} h3-L`}>{name}</div>
                <div className={`${styles.discount} h2-L`}>{discount_value}</div>
                <div className={`${styles.max} p`}>滿NT${minimum_amount}</div>
            </div>
            <div className="align-self-end text-center pb-2 pe-1 d-flex flex-column align-items-end ">
                <Link
                href="/cart?" 
                >
                    <button className={`${styles.btn} ${styles['btn-outline-light']} d-flex justify-content-center align-items-center primary p`}>
                        使用
                    </button>
                </Link>
                <div className={`${styles['right-ps']} ps`}>使用期限：{end_date}</div>
            </div>
        </div>
    );
};

export default Coupon;
