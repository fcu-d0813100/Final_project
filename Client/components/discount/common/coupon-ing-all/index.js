import React from 'react';
import styles from './index.module.scss';
import Link from 'next/link';

const Coupon = ({
  id = 1,
  name = "",
  discount = "",
  condition = 0,
  expiration = "無使用期限"
}) => {
  // 當點擊編輯按鈕時，將優惠券的 id 存儲到 localStorage
  const handleEditClick = () => {
    const couponId = id || 'default-id'; // 如果 id 為 undefined，使用 'default-id' 作為預設值
    localStorage.setItem('couponId', couponId);
  };

  return (
    <div className={`${styles['coupon-lg']} d-flex align-items-center justify-content-between`}>
      
      {/* 優惠券文本信息 */}
      <div className={styles.text}>
        <div className={`${styles.name} h3-L`}>{name}</div>
        <div className={`${styles.discount} h2-L`}>{discount}</div>
        <div className={`${styles.max} p`}>滿NT${condition}</div>
      </div>

      {/* 編輯按鈕和到期時間 */}
      <div className="align-self-end text-center pb-2 pe-1 d-flex flex-column align-items-end">
        {/* 這裡直接綁定 onClick 處理 edit 操作 */}
        <div className={`${styles['right-ps']} ps`}>使用期限：{expiration}</div>
      </div>
    </div>
  );
};

export default Coupon;
