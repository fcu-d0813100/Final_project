import React, { useState, useEffect } from 'react';
import { Tab, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './index.module.scss';
import AdminSection from '@/components/admin/common/coupon/admin-section-coupon';
import CouponEdit from '@/components/discount/common/coupon-edit';
import CouponEnd from '@/components/discount/common/coupon-end';

export default function Index(props) {
  const [ongoingCoupons, setOngoingCoupons] = useState([]); // 进行中的优惠券
  const [endedCoupons, setEndedCoupons] = useState([]); // 已结束的优惠券
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();

      const currentDate = new Date(); // 获取当前日期
      const ongoing = [];
      const ended = [];

      data.forEach(coupon => {
        // 将优惠券根据结束日期分类
        if (new Date(coupon.end_date) > currentDate) {
          ongoing.push(coupon);
        } else {
          ended.push(coupon);
        }
      });

      setOngoingCoupons(ongoing);
      setEndedCoupons(ended);

    } catch (error) {
      console.error('Error fetching coupons:', error);
      setError(`獲取優惠券失敗：${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons(); // 在组件加载时调用
  }, []);

  return (
    <>
      <AdminSection titleCN="優惠券管理">
        <Tab.Container defaultActiveKey="/ing">
          <div className={styles['post-navbar']}>
            <Nav variant="underline" className={`${styles['nav-item']} h6`}>
              <Nav.Item className={`${styles['nav-link']} text-center`}>
                <Nav.Link className={`${styles['link-style']}`} eventKey="/ing">進行中與即將開始</Nav.Link>
              </Nav.Item>
              <Nav.Item className={`${styles['nav-link']} text-center`}>
                <Nav.Link className={`${styles['link-style']}`} eventKey="/end">已結束</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <Tab.Content>
            <Tab.Pane eventKey="/ing">
              <div className={`${styles["coupon-group"]} d-flex flex-wrap justify-content-around align-items-center pt-4`}>
                {ongoingCoupons.map((coupon, index) => (
                  <CouponEdit
                    key={coupon.id}
                    img={brandImageMap[coupon.brand_id]}
                    name={coupon.name}
                    discount={coupon.discount_value > 1 ? `$${coupon.discount_value}` : `${coupon.discount_value * 100}% OFF`} // 动态格式
                    condition={'NT$' + coupon.minimum_amount}
                    expiration={coupon.end_date}
                  />
                ))}
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="/end">
              <div className={`${styles["coupon-group"]} d-flex flex-wrap justify-content-around align-items-center pt-4`}>
                {endedCoupons.map((coupon, index) => (
                  <CouponEnd
                    key={coupon.id}
                    img={brandImageMap[coupon.brand_id]}
                    name={coupon.name}
                    discount={coupon.discount_value > 1 ? `$${coupon.discount_value}` : `${coupon.discount_value * 100}% OFF`} // 动态格式
                    condition={'NT$' + coupon.minimum_amount}
                    expiration={coupon.end_date}
                  />
                ))}
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </AdminSection>
    </>
  );
}

