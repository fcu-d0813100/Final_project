import React, { useState, useEffect } from 'react';
import CouponUse from '@/components/discount/common/coupon-use';
import styles from './index.module.scss';
import UserCouponSection from '@/components/discount/common/user-coupon-section';
import { useAuth } from '@/hooks/use-auth';

const UserCoupon = () => {
  const { auth } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [couponsPerPage] = useState(6);

  // 從 AuthContext 獲取 userId
  const userId = auth.isAuth ? auth.userData.id : null;

  // 品牌圖片映射
  const brandImageMap = {
    1: '/discount/coupon/brands/bobbi.svg',
    2: '/discount/coupon/brands/estee.svg',
    3: '/discount/coupon/brands/lancome.svg',
    4: '/discount/coupon/brands/nars.svg',
    5: '/discount/coupon/brands/ysl.svg',
  };

  // 獲取優惠券
  const fetchCoupons = async () => {
    if (!userId) {
      setError('未找到使用者資訊，請先登入');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3005/api/user-coupons/${userId}?page=${currentPage}&limit=${couponsPerPage}`);
      if (!response.ok) {
        throw new Error(`錯誤: ${response.statusText}`);
      }
      const data = await response.json();
      setCoupons(data.data);
    } catch (error) {
      console.error('獲取優惠券時發生錯誤:', error);
      setError(`獲取優惠券失敗：${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 處理分頁邏輯
  const validCoupons = coupons.filter(coupon => new Date(coupon.end_date) > new Date());
  const totalPages = Math.ceil(validCoupons.length / couponsPerPage);
  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = validCoupons.slice(indexOfFirstCoupon, indexOfLastCoupon);

  useEffect(() => {
    if (userId) {
      fetchCoupons();
    }
  }, [userId, currentPage]); // 更新 userId 和 currentPage 時重新獲取優惠券

  return (
    <UserCouponSection titleCN="優惠券" titleENG="Coupon">
      <aside className={styles.right}>
        <div className={`${styles.search} mt-2 d-flex justify-content-center align-items-center`}>
          <div className="p me-4">新增優惠券</div>
          <input className="p-1 me-4" type="text" placeholder="請輸入優惠券代碼" />
          <button className={styles.btn}>領取</button>
        </div>
        {loading && <p>加載中...</p>}
        {error && <p className="text-danger">{error}</p>}
        <div className={`${styles["coupon-group"]} d-flex flex-wrap justify-content-around align-items-center pt-4`}>
          {currentCoupons.map((coupon, index) => (
            <CouponUse
              key={index}
              img={brandImageMap[coupon.brand_id]}
              name={coupon.name}
              discount={coupon.discount_value > 1 ? `折 ${coupon.discount_value}元` : `${(1 - coupon.discount_value).toFixed(2) * 100}% OFF`}
              condition={coupon.minimum_amount}
              expiration={coupon.end_date}
            />
          ))}
        </div>
        <div className={styles.pagination}>
          {totalPages > 0 && Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`${styles.pageBtn} ${currentPage === index + 1 ? styles.active : ''}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </aside>
    </UserCouponSection>
  );
};

export default UserCoupon;
