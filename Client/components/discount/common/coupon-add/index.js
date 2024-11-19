import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/router';
import ModalConfirm from '@/components/shared/modal-confirm'
import toast, { Toaster } from 'react-hot-toast';

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
    const [isClaimed, setIsClaimed] = useState(false);  // 用於記錄該優惠券是否已領取
    const [isLoading, setIsLoading] = useState(false);  // 用於顯示加載狀態
    const [error, setError] = useState(null);  // 錯誤狀態
    const [showModal, setShowModal] = useState(false)

    const userId = auth.isAuth ? auth.userData.id : null;  // 獲取用戶ID

    useEffect(() => {
        // 如果用戶已登錄，檢查該優惠券是否已被領取
        if (userId && coupon_id) {
            checkIfCouponClaimed();
        }
    }, [userId, coupon_id]);

    // 檢查該用戶是否已經領取過該優惠券
    const checkIfCouponClaimed = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3005/api/user-coupons?userId=${userId}&couponId=${coupon_id}`);

            if (!response.ok) {
                throw new Error('獲取優惠券狀態失敗');
            }

            const data = await response.json();
            console.log('API 回應:', data);  // 打印返回的結果，檢查是否正確

            // 如果數據庫沒有找到相關記錄，表示用戶沒有領取此優惠券
            setIsClaimed(data.hasClaimed || false);

        } catch (err) {
            console.error(err);
            setError('檢查優惠券領取狀態失敗: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 領取優惠券
    const handleClaimCoupon = async (coupon_id) => {
        if (!userId) {
            // 用戶未登錄，跳轉到登錄頁面
            // alert("請先登入會員");
            // router.push(`/user/login/user`);
            setShowModal(true)
            return;
        }

        setIsLoading(true);
        try {
            // 向後端提交領取優惠券的請求
            const response = await fetch('http://localhost:3005/api/user-coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, coupon_id })
            });

            const data = await response.json();
            if (data.success) {
                setIsClaimed(true);
                // alert(data.message || '優惠券領取成功！');
                toast.success('優惠券領取成功！', {
                    style: {
                        border: '1.2px solid #90957a',
                        padding: '12px 40px',
                        color: '#626553',
                    },
                    iconTheme: {
                        primary: '#626553',
                        secondary: '#fff',
                    },
                });
            } else {
                setError(data.error || '領取優惠券失敗，請稍後再試。');
            }
        } catch (err) {
            setError('領取優惠券時發生錯誤！');
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
                    disabled={isClaimed || isLoading}  // 如果已經領取或正在加載，按鈕會禁用
                >
                    {isClaimed ? '已領取' : isLoading ? '領取中...' : '領取'}
                </button>

                <div className={`${styles['right-ps']} ps`}>使用期限：{end_date}</div>
                {error && <div className={`${styles.error} p`}>{error}</div>}
            </div>

            {showModal && (
                <ModalConfirm
                    title="尚未登入會員"
                    content={`是否前往登入?`}
                    btnConfirm="前往登入"
                    ConfirmFn={() => {
                        router.push('/user/login/user')
                    }}
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};
<Toaster />

export default Coupon;
