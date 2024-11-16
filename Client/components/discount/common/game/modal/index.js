import React from 'react';
import styles from './index.module.scss';
import CouponAll from '@/components/discount/common/coupon-game';
import toast, { Toaster } from 'react-hot-toast';

const Modal = ({ coupon, onClose }) => {
  // 如果 coupon 是 null 或 undefined，直接返回 null，什麼都不渲染
  if (!coupon) {
    return null;
  }

  const copyCouponAndRedirect = () => {
    if (!coupon.code) {
      console.error('優惠券代碼缺失');
      return;
    }

    // 複製優惠券代碼並跳轉到領取頁面
    navigator.clipboard.writeText(coupon.code)
      .then(() => {
        window.location.href = '/user/coupon';
      })
      .catch((err) => {
        console.error('複製失敗', err);
      });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <div className="h2 pb-2">恭喜您中獎！</div>
        <div className="h6 pb-4">您獲得了優惠券</div>
        <CouponAll
          discount={coupon.discount_value > 1
            ? `折 $${coupon.discount_value}元`
            : `${((1 - coupon.discount_value) * 100).toFixed(0)}% OFF`}
          code={coupon.code}
        />
        <button onClick={copyCouponAndRedirect} className={`${styles.copyAndGoButton} h6`}>
          複製優惠券代碼並前往領取
        </button>
      </div>
    </div>
  );
};
<Toaster />

export default Modal;
