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
  const [message, setMessage] = useState(''); //根據優惠券代碼是否有效來給用戶提供反饋
  const [couponCode, setCouponCode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [couponsPerPage] = useState(6);

  const brandImageMap = {
    1: '/discount/coupon/brands/bobbi.svg',
    2: '/discount/coupon/brands/estee.svg',
    3: '/discount/coupon/brands/lancome.svg',
    4: '/discount/coupon/brands/nars.svg',
    5: '/discount/coupon/brands/ysl.svg',
  };

  // 從 AuthContext 獲取 userId
  const userId = auth.isAuth ? auth.userData.id : null;

  // 獲取優惠券
  const fetchCoupons = async () => {
    if (!userId) {
      setError('未找到使用者資訊，請先登入');
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3005/api/user-coupons/${userId}?page=${currentPage}&limit=${couponsPerPage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error(`錯誤: ${response.statusText}`);
      }
      const data = await response.json();
      setCoupons(data.data);
    } catch (error) {
      console.error('獲取優惠券時發生錯誤:', error);
      setError(`尚未擁有優惠券：${error.message}`);

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

  // 獲取優惠券列表
  useEffect(() => {
    if (userId) {
      fetchCoupons();
    }
  }, [userId, currentPage]); // 更新 userId 和 currentPage 時重新獲取優惠券

  // 处理优惠券领取逻辑
  const handleClaimCoupon = async () => {
    if (!couponCode) {
      setError('請輸入優惠券代碼');
      return;
    }
    setLoading(true);
    try {
      // 请求后端检查优惠券是否存在
      const response = await fetch('http://localhost:3005/api/coupons', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('获取优惠券列表失败');
      }

      const data = await response.json();
      const matchedCoupon = data.find((coupon) => coupon.code === couponCode);

      if (!matchedCoupon) {
        // 如果未找到匹配的优惠券
        setError('优惠券代码错误，请重新输入');
        setMessage('');
        return;
      }

      // 如果找到了匹配的优惠券，接下来检查是否已领取
      const relationResponse = await fetch(`http://localhost:3005/api/user-coupons?userId=${userId}&couponId=${matchedCoupon.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!relationResponse.ok) {
        throw new Error('查询优惠券领取记录失败');
      }

      const relationData = await relationResponse.json();

      if (relationData.length > 0) {
        // 如果已经有该记录，说明用户已领取过此优惠券
        setError('您已领取过此优惠券');
        setMessage('');
        return;
      }

      // 如果没有领取过，插入新的领取记录
      const claimResponse = await fetch('http://localhost:3005/api/user-coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          coupon_id: matchedCoupon.id,
        }),
      });

      const claimData = await claimResponse.json();

      if (claimData.success) {
        setMessage('优惠券领取成功！');
        setError('');
        // 可选：重新获取优惠券数据
        fetchCoupons();
      } else {
        setError(claimData.error || '领取优惠券失败');
      }
    } catch (error) {
      console.error('发生错误:', error);
      setError('查询优惠券时发生错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserCouponSection titleCN="優惠券" titleENG="Coupon">
      <aside className={styles.right}>
        <div className={`${styles.search} mt-2 d-flex justify-content-center align-items-center`}>
          <div className="p me-4">新增優惠券</div>
          <input className="p-1 me-4"
            type="text"
            placeholder="請輸入優惠券代碼"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button className={styles.btn} onClick={handleClaimCoupon}>領取</button>
        </div>
        {loading && <p>加載中...</p>}
        {error && <p className="text-danger">{error}</p>}
        <div className={`${styles["coupon-group"]} d-flex flex-wrap justify-content-around align-items-center pt-4`}>
          {currentCoupons.map((coupon, index) => (
            <CouponUse
              key={index}
              img={brandImageMap[coupon.brand_id]}
              name={coupon.name}
              discount_value={coupon.discount_value > 1 ? `折 ${coupon.discount_value}元` : `${(1 - coupon.discount_value).toFixed(2) * 100}% OFF`}
              minimum_amount={coupon.minimum_amount}
              end_date={coupon.end_date}
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
