import React, { useState, useEffect } from 'react';
import UserCouponSection from '@/components/discount/common/user-coupon-history-section';
import { Tab, Nav } from 'react-bootstrap';
import styles from './index.module.scss';
import CouponEnd from '@/components/discount/common/coupon-end';
import { useAuth } from '@/hooks/use-auth';

export default function Index() {
    const { auth } = useAuth();
    // 保存優惠券資料、加載狀態和錯誤訊息
    const [coupons, setCoupons] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [invalidCoupons, setInvalidCoupons] = useState([]); // 保存已過期的優惠券
    const [usedCoupons, setUsedCoupons] = useState([]); // 保存已使用的優惠券

    // 從 AuthContext 獲取 userId
    const userId = auth.isAuth ? auth.userData.id : null;

    const brandImageMap = {
        1: '/discount/coupon/brands/bobbi.svg',
        2: '/discount/coupon/brands/estee.svg',
        3: '/discount/coupon/brands/lancome.svg',
        4: '/discount/coupon/brands/nars.svg',
        5: '/discount/coupon/brands/ysl.svg',
    };

    const fetchCoupons = async () => {
        if (!userId) {
            setError('未找到使用者資訊，請先登入');
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3005/api/user-coupons/history/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`錯誤: ${response.statusText}`);
            }
            const data = await response.json();
            const allCoupons = data.data; // 假設 data 是一個優惠券陣列

            // 獲取當前日期
            const currentDate = new Date();

            // 篩選出過期的優惠券
            const expiredCoupons = allCoupons
                .filter(coupon => coupon.order_id === null)
                .filter(coupon => new Date(coupon.end_date) < currentDate);
            setInvalidCoupons(expiredCoupons);

            // 篩選出已使用的優惠券（假設通過 coupon.status 字段表示）
            const usedCoupons = allCoupons.filter(coupon => coupon.order_id !== null);
            setUsedCoupons(usedCoupons);

            setCoupons(allCoupons); // 保存所有優惠券
        } catch (error) {
            setError(`獲取優惠券失敗：${error.message}`);
        } finally {
            setLoading(false); // 加載結束
        }
    };

    useEffect(() => {
        fetchCoupons(); // 在組件加載時調用
    }, []);


    return (
        <>
            <UserCouponSection titleCN="歷史紀錄">
                {loading ? (
                    <p>正在加載...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <Tab.Container defaultActiveKey="/invalid">
                        <div className={styles['post-navbar']}>
                            <Nav variant="underline" className={`${styles['nav-item']} h6`}>
                                <Nav.Item className={`${styles['nav-link']} text-center`}>
                                    <Nav.Link className={`${styles['link-style']}`} eventKey="/invalid">
                                        已無效
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item className={`${styles['nav-link']} text-center`}>
                                    <Nav.Link className={`${styles['link-style']}`} eventKey="/used">
                                        已使用
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </div>
                        <Tab.Content>
                            {/* 已無效的優惠券（過期） */}
                            <Tab.Pane eventKey="/invalid">
                                <div className={`${styles["coupon-group"]} d-flex flex-wrap justify-content-around align-items-center pt-4`}>
                                    {invalidCoupons.length === 0 ? (
                                        <p>沒有過期的優惠券</p>
                                    ) : (
                                        invalidCoupons.map(coupon => (
                                            <CouponEnd
                                                status="已無效"
                                                key={coupon.id}
                                                img={brandImageMap[coupon.brand_id]}
                                                name={coupon.name}
                                                discount={coupon.discount_value > 1 ? `$${coupon.discount_value}` : `${coupon.discount_value * 100}% OFF`}
                                                condition={coupon.minimum_amount}
                                                expiration={coupon.end_date}
                                            />
                                        ))
                                    )}
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="/used">
                                <div className={`${styles["coupon-group"]} d-flex flex-wrap justify-content-around align-items-center pt-4`}>
                                    {usedCoupons.length === 0 ? (
                                        <p>沒有已使用的優惠券</p>
                                    ) : (
                                        usedCoupons.map(coupon => (
                                            <CouponEnd
                                                status="已使用"
                                                key={coupon.id}
                                                img={brandImageMap[coupon.brand_id]}
                                                name={coupon.name}
                                                discount={coupon.discount_value > 1 ? `$${coupon.discount_value}` : `${coupon.discount_value * 100}% OFF`}
                                                condition={coupon.minimum_amount}
                                                expiration={coupon.end_date}
                                            />
                                        )
                                        ))}
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                )}
            </UserCouponSection>
        </>
    );
}
