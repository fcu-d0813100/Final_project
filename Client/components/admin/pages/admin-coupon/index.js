import React, { useState, useEffect } from 'react';
import { Tab, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './index.module.scss';
import AdminSection from '@/components/admin/common/coupon/admin-section-coupon';
import CouponEdit from '@/components/discount/common/coupon-edit';
import CouponEnd from '@/components/discount/common/coupon-end';
import toast, { Toaster } from 'react-hot-toast'; // 引入 toast

export default function Index(props) {
  const [upcomingCoupons, setUpcomingCoupons] = useState([]); // 即将开始的优惠券
  const [ongoingCoupons, setOngoingCoupons] = useState([]); // 进行中的优惠券
  const [endedCoupons, setEndedCoupons] = useState([]); // 已结束的优惠券
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentPageUpcoming, setCurrentPageUpcoming] = useState(1); // 即将开始优惠券页码
  const [currentPageOngoing, setCurrentPageOngoing] = useState(1); // 当前进行中优惠券页码
  const [currentPageEnded, setCurrentPageEnded] = useState(1); // 当前已结束优惠券页码
  const couponsPerPage = 6; // 每页显示的优惠券数量

  const brandImageMap = {
    1: '/discount/coupon/brands/bobbi.svg',
    2: '/discount/coupon/brands/estee.svg',
    3: '/discount/coupon/brands/lancome.svg',
    4: '/discount/coupon/brands/nars.svg',
    5: '/discount/coupon/brands/ysl.svg',
  };

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3005/api/coupons');
      if (!response.ok) {
        throw new Error(`錯誤：${response.statusText}`);
      }
      const data = await response.json();

      const currentDate = new Date(); // 获取当前日期
      const ongoing = [];  // 进行中的优惠券
      const ended = [];    // 已结束的优惠券
      const upcoming = []; // 即将开始的优惠券

      // 分类优惠券
      data.forEach(coupon => {
        const startDate = new Date(coupon.start_date);
        const endDate = new Date(coupon.end_date);

        if (startDate > currentDate) {
          upcoming.push(coupon); // 如果开始时间在当前时间之后，分类为即将开始
        } else if (startDate <= currentDate && endDate >= currentDate) {
          ongoing.push(coupon); // 如果当前时间在开始和结束时间之间，分类为进行中
        } else if (endDate < currentDate) {
          ended.push(coupon);   // 如果结束时间在当前时间之前，分类为已结束
        }
      });

      setOngoingCoupons(ongoing);
      setEndedCoupons(ended);
      setUpcomingCoupons(upcoming); // 新增设置即将开始的优惠券

      // 成功提示
      toast.success("優惠券已成功加載！");

    } catch (error) {
      console.error('Error fetching coupons:', error);
      setError(`獲取優惠券失敗：${error.message}`);
      toast.error(`獲取優惠券失敗：${error.message}`); // 顯示錯誤提示
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons(); // 在组件加载时调用
  }, []);

  // 计算当前即将开始优惠券的分页
  const indexOfLastUpcomingCoupon = currentPageUpcoming * couponsPerPage;
  const indexOfFirstUpcomingCoupon = indexOfLastUpcomingCoupon - couponsPerPage;
  const currentUpcomingCoupons = upcomingCoupons.slice(indexOfFirstUpcomingCoupon, indexOfLastUpcomingCoupon);

  // 计算当前进行中优惠券的分页
  const indexOfLastOngoingCoupon = currentPageOngoing * couponsPerPage;
  const indexOfFirstOngoingCoupon = indexOfLastOngoingCoupon - couponsPerPage;
  const currentOngoingCoupons = ongoingCoupons.slice(indexOfFirstOngoingCoupon, indexOfLastOngoingCoupon);

  // 计算当前已结束优惠券的分页
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
  
  // 处理分页左右按钮
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
                {currentOngoingCoupons.map((coupon) => (
                  <CouponEdit
                    key={coupon.id}
                    id={coupon.id}
                    img={brandImageMap[coupon.brand_id]}
                    name={coupon.name}
                    discount={coupon.discount_value > 1 ? `$${coupon.discount_value}` : `${coupon.discount_value * 100}% OFF`}
                    condition={coupon.minimum_amount}
                    expiration={coupon.end_date}
                  />
                ))}
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
                {currentUpcomingCoupons.map((coupon) => (
                  <CouponEdit
                    key={coupon.id}
                    id={coupon.id}
                    img={brandImageMap[coupon.brand_id]}
                    name={coupon.name}
                    discount={coupon.discount_value > 1 ? `$${coupon.discount_value}` : `${coupon.discount_value * 100}% OFF`}
                    condition={coupon.minimum_amount}
                    expiration={coupon.end_date}
                  />
                ))}
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="/end">
              <div className={`${styles["coupon-group"]} d-flex flex-wrap justify-content-around align-items-center pt-4`}>
                {currentEndedCoupons.map((coupon) => (
                  <CouponEnd
                    key={coupon.id}
                    id={coupon.id}
                    img={brandImageMap[coupon.brand_id]}
                    name={coupon.name}
                    discount={coupon.discount_value > 1 ? `$${coupon.discount_value}` : `${coupon.discount_value * 100}% OFF`}
                    condition={coupon.minimum_amount}
                    expiration={coupon.end_date}
                  />
                ))}
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </AdminSection>
      <Toaster position="top-center" /> {/* 顯示 Toast 提示 */}
    </>
  );
}
