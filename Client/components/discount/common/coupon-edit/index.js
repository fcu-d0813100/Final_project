import React from 'react';
import styles from './index.module.scss';
import Link from 'next/link';

const Coupon = ({
  id,
  img = "",
  name = "",
  discount = "",
  condition = 0,
  expiration = "無使用期限"
}) => {
  // 当点击编辑按钮时，将优惠券的 id 存储到 localStorage
  const handleEditClick = () => {
    const couponId = id || 'default-id'; // 如果 id 為 undefined，使用 'default-id' 作為預設值
    localStorage.setItem('couponId', couponId);
  };

  return (
    <div className={`${styles['coupon-lg']} d-flex align-items-center justify-content-around px-2`}>
      {/* 优惠券图片 */}
      <div className={styles.img}>
        <img className={styles['coupon-image']} src={img} alt={name || "Coupon Image"} />
      </div>

      {/* 优惠券文本信息 */}
      <div className={styles.text}>
        <div className={`${styles.name} h3-L`}>{name}</div>
        <div className={`${styles.discount} h2-L`}>{discount}</div>
        <div className={`${styles.max} p`}>滿NT${condition}</div>
      </div>

      {/* 编辑按钮和到期时间 */}
      <div className="align-self-end text-center pb-2 pe-1 d-flex flex-column align-items-end">
        {/* 这里直接绑定 onClick 处理 edit 操作 */}
        <Link
          href="/admin/coupon/edit"  // 不暴露 id
          className={`${styles.btn} ${styles['btn-outline-light']} d-flex justify-content-center align-items-center btn-primary p text-decoration-none`}
          onClick={handleEditClick}
        >
          編輯
        </Link>
        <div className={`${styles['right-ps']} ps`}>使用期限：{expiration}</div>
      </div>
    </div>
  );
};

export default Coupon;
