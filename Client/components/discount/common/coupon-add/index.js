import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/router';

const Coupon = ({
    img,
    name,
    discount_value,
    minimum_amount,
    end_date,
    coupon_id,
}) => {
    const { auth } = useAuth();
    const router = useRouter();
    const [isClaimed, setIsClaimed] = useState(false);  // 用于记录该优惠券是否已领取
    const [isLoading, setIsLoading] = useState(false);  // 用于显示加载状态
    const [error, setError] = useState(null);  // 错误状态

    const userId = auth.isAuth ? auth.userData.id : null;  // 获取用户ID

    useEffect(() => {
        // 如果用户已登录，检查该优惠券是否已被领取
        if (userId && coupon_id) {
            checkIfCouponClaimed();
        }
    }, [userId, coupon_id]);

    // 检查该用户是否已经领取过该优惠券
    const checkIfCouponClaimed = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3005/api/user-coupons?userId=${userId}&couponId=${coupon_id}`);

            if (!response.ok) {
                throw new Error('Failed to fetch coupon status');
            }

            const data = await response.json();
            console.log('API Response:', data);  // 打印返回的结果，检查是否正确

            // 如果数据库没有找到相关记录，表示用户没有领取此优惠券
            setIsClaimed(data.hasClaimed || false);

        } catch (err) {
            console.error(err);
            setError('检查优惠券领取状态失败: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 领取优惠券
    const handleClaimCoupon = async (coupon_id) => {
        console.log('Received coupon_id:', coupon_id);  // 打印 coupon_id
        console.log('UserId:', userId);  // 打印 userId，确认其是否有效
        console.log('Received coupon_id:', coupon_id);
        if (!userId) {
            // 用户未登录，跳转到登录页面
            alert("請先登入會員");
            router.push(`/user/login/user`);
            return;
        }

        setIsLoading(true);
        try {
            // 向后端提交领取优惠券的请求
            const response = await fetch('http://localhost:3005/api/user-coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, coupon_id })
            });

            const data = await response.json();
            console.log(data)

            if (data.success) {
                setIsClaimed(true);
                alert(data.message || '优惠券领取成功！');
            } else {
                setError(data.error || '领取优惠券失败，请稍后再试。');
            }
        } catch (err) {
            setError('领取优惠券时发生错误！');
        } finally {
            setIsLoading(false);
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
            <div className="align-self-end text-center pb-2 pe-1 d-flex flex-column align-items-end">
                <button
                    className={`btn ${styles['btn-outline-light']} d-flex justify-content-center align-items-center primary p`}
                    onClick={() => handleClaimCoupon(coupon_id)}
                    disabled={isClaimed || isLoading}  // 如果已经领取或正在加载，按钮会禁用
                >
                    {isClaimed ? '已領取' : isLoading ? '領取中...' : '領取'}
                </button>

                <div className={`${styles['right-ps']} ps`}>使用期限：{end_date}</div>
                {error && <div className={`${styles.error} p`}>{error}</div>}
            </div>
        </div>
    );
};

export default Coupon;
