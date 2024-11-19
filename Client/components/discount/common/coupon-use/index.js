import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

const Coupon = ({
    img = "",
    name = "",
    discount_value = "",
    minimum_amount = 0,
    end_date = "無使用期限",
}) => {

    const { auth } = useAuth();  // 获取用户认证信息
    const userId = auth.isAuth ? auth.userData.id : null;
    // 当点击“使用”按钮时，将 userId 存储到 sessionStorage
    const handleCouponUse = () => {
        if (userId) {
            sessionStorage.setItem('userId', userId);  // 存储 userId
        }
    };

    return (
        <div className={`${styles['coupon-lg']} d-flex align-items-center px-2`}>
            <div className={styles.img}>
                <img className={styles['coupon-image']} src={img} alt="Coupon Image" />
            </div>
            <div className={styles.text}>
                <div className={`${styles.name} h3-L`}>{name}</div>
                <div className={`${styles.discount} h2-L`}>{discount_value}</div>
                <div className={`${styles.max} p`}>滿NT${minimum_amount}</div>
            </div>
            <div className="align-self-end text-center pb-2 pe-1 d-flex flex-column align-items-end ">

                {/* 这里直接绑定 onClick 处理 edit 操作 */}
                <Link
                    href="/product/product-list"  // 不暴露 id
                    className={`btn ${styles['btn-outline-light']} d-flex justify-content-center align-items-center btn-primary p text-decoration-none`}
                    onClick={handleCouponUse} 
                >
                    使用
                </Link>
                <div className={`${styles['right-ps']} ps`}>使用期限：{end_date}</div>
            </div>
        </div>
    );
};

export default Coupon;
