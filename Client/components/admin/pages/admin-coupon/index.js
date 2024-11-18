import React, { useState, useEffect } from 'react';
import { Tab, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './index.module.scss';
import AdminSection from '@/components/admin/common/coupon/admin-section-coupon';
import CouponGing from '@/components/discount/common/coupon-ing';
import CouponEdit from '@/components/discount/common/coupon-edit';
import CouponEnd from '@/components/discount/common/coupon-end';
import CouponGingAll from '@/components/discount/common/coupon-ing-all';
import CouponEditAll from '@/components/discount/common/coupon-edit-all'
import CouponEndAll from '@/components/discount/common/coupon-end-all'
import toast, { Toaster } from 'react-hot-toast'; // 引入 toast

export default function Index(props) {
  const [ongoingCoupons, setOngoingCoupons] = useState([]); // 進行中的優惠券
  const [upcomingCoupons, setUpcomingCoupons] = useState([]); // 即將開始的優惠券
  const [endedCoupons, setEndedCoupons] = useState([]); // 已結束的優惠券
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentPageOngoing, setCurrentPageOngoing] = useState(1); // 當前進行中優惠券頁碼
  const [currentPageUpcoming, setCurrentPageUpcoming] = useState(1); // 即將開始優惠券頁碼
  const [currentPageEnded, setCurrentPageEnded] = useState(1); // 當前已結束優惠券頁碼
  const couponsPerPage = 6; // 每頁顯示的優惠券數量

  const brandImageMap = {
    1: '/discount/coupon/brands/bobbi.svg',
    2: '/discount/coupon/brands/estee.svg',
    3: '/discount/coupon/brands/lancome.svg',
    4: '/discount/coupon/brands/nars.svg',
    5: '/discount/coupon/brands/ysl.svg',
  };

  // 獲取優惠券數據
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3005/api/coupons');
      if (!response.ok) {
        throw new Error(`錯誤：${response.statusText}`);
      }
      const data = await response.json();

      const currentDate = new Date(); // 獲取當前日期
      const ongoing = [];  // 進行中的優惠券
      const ended = [];    // 已結束的優惠券
      const upcoming = []; // 即將開始的優惠券

      // 根據時間範圍分類優惠券
      data.forEach(coupon => {
        const startDate = new Date(coupon.start_date);
        const endDate = new Date(coupon.end_date);

        if (startDate > currentDate) {
          upcoming.push(coupon); // 如果開始時間在當前時間之後，分類為即將開始
        } else if (startDate <= currentDate && endDate >= currentDate) {
          ongoing.push(coupon); // 如果當前時間在開始和結束時間之間，分類為進行中
        } else if (endDate < currentDate) {
          ended.push(coupon);   // 如果結束時間在當前時間之前，分類為已結束
        }
      });

      // 設置分類後的優惠券數據
      setOngoingCoupons(ongoing);
      setEndedCoupons(ended);
      setUpcomingCoupons(upcoming); // 設置即將開始的優惠券

      // toast.success("優惠券已成功加載！");

    } catch (error) {
      toast.error(`獲取優惠券失敗：${error.message}`
        ,{style:{
          border: '1.2px solid #963827',
          padding: '12px 40px',
          color: '#963827',
        },iconTheme:{
          primary:'#963827',
          secondary:'#fff'
        }
      }); // 顯示錯誤提示
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons(); // 在組件加載時呼叫
  }, []);

  // 計算當前進行中優惠券的分頁
  const indexOfLastOngoingCoupon = currentPageOngoing * couponsPerPage;
  const indexOfFirstOngoingCoupon = indexOfLastOngoingCoupon - couponsPerPage;
  const currentOngoingCoupons = ongoingCoupons.slice(indexOfFirstOngoingCoupon, indexOfLastOngoingCoupon);

  // 計算當前即將開始優惠券的分頁
  const indexOfLastUpcomingCoupon = currentPageUpcoming * couponsPerPage;
  const indexOfFirstUpcomingCoupon = indexOfLastUpcomingCoupon - couponsPerPage;
  const currentUpcomingCoupons = upcomingCoupons.slice(indexOfFirstUpcomingCoupon, indexOfLastUpcomingCoupon);

  // 計算當前已結束優惠券的分頁
  const indexOfLastEndedCoupon = currentPageEnded * couponsPerPage;
  const indexOfFirstEndedCoupon = indexOfLastEndedCoupon - couponsPerPage;
  const currentEndedCoupons = endedCoupons.slice(indexOfFirstEndedCoupon, indexOfLastEndedCoupon);

  const handleTabSelect = (key) => {
    if (key === '/ing') {
      setCurrentPageOngoing(1); // 切換到進行中時重置頁碼
    } else if (key === '/fet') {
      setCurrentPageUpcoming(1); // 切換到即將開始時重置頁碼
    } else {
      setCurrentPageEnded(1); // 切換到已結束時重置頁碼
    }
  };

  // 處理分頁左右按鈕
  const handlePrevPage = (isOngoing) => {
    if (isOngoing) {
      setCurrentPageOngoing(prev => Math.max(prev - 1, 1));
    } else {
      setCurrentPageEnded(prev => Math.max(prev - 1, 1));
    }
  };

  const handleNextPage = (isOngoing) => {
    const totalPages = isOngoing ? Math.ceil(ongoingCoupons.length / couponsPerPage) : Math.ceil(endedCoupons.length / couponsPerPage);
    if (isOngoing) {
      setCurrentPageOngoing(prev => Math.min(prev + 1, totalPages));
    } else {
      setCurrentPageEnded(prev => Math.min(prev + 1, totalPages));
    }
  };

  return (
    <>
      <AdminSection titleCN="優惠券管理">
        <Tab.Container defaultActiveKey="/ing" onSelect={handleTabSelect}>
          <div className={styles['coupon-navbar']}>
            <Nav variant="underline" className={`${styles['nav-item']} h6`}>
              <Nav.Item className={`${styles['nav-link']} text-center`}>
                <Nav.Link className={`${styles['link-style']}`} eventKey="/ing">進行中</Nav.Link>
              </Nav.Item>
              <Nav.Item className={`${styles['nav-link']} text-center`}>
                <Nav.Link className={`${styles['link-style']}`} eventKey="/fet">即將開始</Nav.Link>
              </Nav.Item>
              <Nav.Item className={`${styles['nav-link']} text-center`}>
                <Nav.Link className={`${styles['link-style']}`} eventKey="/end">已結束</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <Tab.Content>
            <Tab.Pane eventKey="/ing">
              <div className={`${styles["coupon-group"]} d-flex flex-wrap justify-content-around align-items-center pt-4`}>
                {currentOngoingCoupons.map((coupon) => {
                  if (coupon.brand_id === 6) {
                    return <CouponGingAll
                      key={coupon.id}
                      id={coupon.id}
                      name={coupon.name}
                      discount={coupon.discount_value > 1 ? `折 ${coupon.discount_value}元` : `${((1 - coupon.discount_value) * 100).toFixed(0)}% OFF`}
                      condition={coupon.minimum_amount}
                      expiration={coupon.end_date}
                    />;
                  }
                  return (
                    <CouponGing
                      key={coupon.id}
                      id={coupon.id}
                      img={brandImageMap[coupon.brand_id]}
                      name={coupon.name}
                      discount={coupon.discount_value > 1 ? `折 ${coupon.discount_value}元` : `${((1 - coupon.discount_value) * 100).toFixed(0)}% OFF`}
                      condition={coupon.minimum_amount}
                      expiration={coupon.end_date}
                    />
                  );
                })}
              </div>
              <div className={styles.pagination}>
                <button
                  className={`${styles.pageBtn} ${currentPageOngoing === 1 ? styles.disabled : ''}`}
                  onClick={() => handlePrevPage(true)}
                >
                  &lt;
                </button>
                {Math.ceil(ongoingCoupons.length / couponsPerPage) > 0 && Array.from({ length: Math.ceil(ongoingCoupons.length / couponsPerPage) }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`${styles.pageBtn} ${currentPageOngoing === index + 1 ? styles.active : ''}`}
                    onClick={() => setCurrentPageOngoing(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className={`${styles.pageBtn} ${currentPageOngoing === Math.ceil(ongoingCoupons.length / couponsPerPage) ? styles.disabled : ''}`}
                  onClick={() => handleNextPage(true)}
                >
                  &gt;
                </button>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="/fet">
              <div className={`${styles["coupon-group"]} d-flex flex-wrap justify-content-around align-items-center pt-4`}>
                {currentUpcomingCoupons.map((coupon) => {
                  if (coupon.brand_id === 6) {
                    return <CouponEditAll
                      key={coupon.id}
                      id={coupon.id}
                      name={coupon.name}
                      discount={coupon.discount_value > 1 ? `折 ${coupon.discount_value}元` : `${((1 - coupon.discount_value) * 100).toFixed(0)}% OFF`}
                      condition={coupon.minimum_amount}
                      expiration={coupon.end_date}
                    />;
                  }
                  return (
                    <CouponEdit
                      key={coupon.id}
                      id={coupon.id}
                      img={brandImageMap[coupon.brand_id]}
                      name={coupon.name}
                      discount={coupon.discount_value > 1 ? `折 ${coupon.discount_value}元` : `${((1 - coupon.discount_value) * 100).toFixed(0)}% OFF`}
                      condition={coupon.minimum_amount}
                      expiration={coupon.end_date}
                    />
                  );
                })}
              </div>
              <div className={styles.pagination}>
                <button
                  className={`${styles.pageBtn} ${currentPageUpcoming === 1 ? styles.disabled : ''}`}
                  onClick={() => handlePrevPage(true)}
                >
                  &lt;
                </button>
                {Math.ceil(upcomingCoupons.length / couponsPerPage) > 0 && Array.from({ length: Math.ceil(upcomingCoupons.length / couponsPerPage) }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`${styles.pageBtn} ${currentPageUpcoming === index + 1 ? styles.active : ''}`}
                    onClick={() => setCurrentPageUpcoming(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className={`${styles.pageBtn} ${currentPageUpcoming === Math.ceil(upcomingCoupons.length / couponsPerPage) ? styles.disabled : ''}`}
                  onClick={() => handleNextPage(true)}
                >
                  &gt;
                </button>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="/end">
              <div className={`${styles["coupon-group"]} d-flex flex-wrap justify-content-around align-items-center pt-4`}>
                {currentEndedCoupons.map((coupon) => {
                  if (coupon.brand_id === 6) {
                    return <CouponEndAll
                      key={coupon.id}
                      id={coupon.id}
                      status='已結束'
                      name={coupon.name}
                      discount={coupon.discount_value > 1 ? `折 ${coupon.discount_value}元` : `${((1 - coupon.discount_value) * 100).toFixed(0)}% OFF`}
                      condition={coupon.minimum_amount}
                      expiration={coupon.end_date}
                    />;
                  }

                  return (
                    <CouponEnd
                      key={coupon.id}
                      id={coupon.id}
                      status='已結束'
                      img={brandImageMap[coupon.brand_id]}
                      name={coupon.name}
                      discount={coupon.discount_value > 1 ? `折 ${coupon.discount_value}元` : `${((1 - coupon.discount_value) * 100).toFixed(0)}% OFF`}
                      condition={coupon.minimum_amount}
                      expiration={coupon.end_date}
                    />
                  );
                })}
              </div>
              <div className={styles.pagination}>
                <button
                  className={`${styles.pageBtn} ${currentPageEnded === 1 ? styles.disabled : ''}`}
                  onClick={() => handlePrevPage(false)}
                >
                  &lt;
                </button>
                {Math.ceil(endedCoupons.length / couponsPerPage) > 0 && Array.from({ length: Math.ceil(endedCoupons.length / couponsPerPage) }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`${styles.pageBtn} ${currentPageEnded === index + 1 ? styles.active : ''}`}
                    onClick={() => setCurrentPageEnded(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className={`${styles.pageBtn} ${currentPageEnded === Math.ceil(endedCoupons.length / couponsPerPage) ? styles.disabled : ''}`}
                  onClick={() => handleNextPage(false)}
                >
                  &gt;
                </button>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </AdminSection>
      <Toaster position="top-center" />
    </>
  );
}
