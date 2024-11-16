import React, { useState, useEffect } from 'react';
import { Tab, Nav } from 'react-bootstrap';
import UserCouponSection from '@/components/discount/common/user-coupon-history-section';
import CouponEnd from '@/components/discount/common/coupon-end';
import CouponEndAll from '@/components/discount/common/coupon-end-all'
import { useAuth } from '@/hooks/use-auth';
import styles from './index.module.scss';
import ModalConfirm from '@/components/shared/modal-confirm'

// 品牌圖片映射
const brandImageMap = {
    1: '/discount/coupon/brands/bobbi.svg',
    2: '/discount/coupon/brands/estee.svg',
    3: '/discount/coupon/brands/lancome.svg',
    4: '/discount/coupon/brands/nars.svg',
    5: '/discount/coupon/brands/ysl.svg',
};

export default function Index() {
    const { auth } = useAuth();
    const [coupons, setCoupons] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [invalidCoupons, setInvalidCoupons] = useState([]); // 已過期優惠券
    const [usedCoupons, setUsedCoupons] = useState([]); // 已使用優惠券
    const [showModal, setShowModal] = useState(false); // Define showModal state

    // 分頁狀態
    const [currentPageInvalid, setCurrentPageInvalid] = useState(1); // 已過期頁碼
    const [currentPageUsed, setCurrentPageUsed] = useState(1); // 已使用頁碼
    const couponsPerPage = 6; // 每頁顯示的優惠券數量

    // 取得使用者 ID
    const userId = auth.isAuth ? auth.userData.id : null;

    // 取得優惠券資料
    const fetchCoupons = async () => {
        if (!userId) {
            // setError('未找到使用者資訊，請先登入');
            setShowModal(true)
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

            // 取得當前日期
            const currentDate = new Date();

            // 篩選出過期的優惠券
            const expiredCoupons = allCoupons.filter(coupon => coupon.order_id === null && new Date(coupon.end_date) < currentDate);
            setInvalidCoupons(expiredCoupons);

            // 篩選出已使用的優惠券
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
        fetchCoupons(); // 组件加载时调用
    }, []);

    // 計算每頁的優惠券範圍
    const indexOfLastInvalidCoupon = currentPageInvalid * couponsPerPage;
    const indexOfFirstInvalidCoupon = indexOfLastInvalidCoupon - couponsPerPage;
    const currentInvalidCoupons = invalidCoupons.slice(indexOfFirstInvalidCoupon, indexOfLastInvalidCoupon);

    const indexOfLastUsedCoupon = currentPageUsed * couponsPerPage;
    const indexOfFirstUsedCoupon = indexOfLastUsedCoupon - couponsPerPage;
    const currentUsedCoupons = usedCoupons.slice(indexOfFirstUsedCoupon, indexOfLastUsedCoupon);

    // 處理上一頁
    const handlePrevPageInvalid = () => {
        setCurrentPageInvalid(prev => Math.max(prev - 1, 1));
    };

    const handlePrevPageUsed = () => {
        setCurrentPageUsed(prev => Math.max(prev - 1, 1));
    };

    // 處理下一頁
    const handleNextPageInvalid = () => {
        const totalPages = Math.ceil(invalidCoupons.length / couponsPerPage);
        setCurrentPageInvalid(prev => Math.min(prev + 1, totalPages));
    };

    const handleNextPageUsed = () => {
        const totalPages = Math.ceil(usedCoupons.length / couponsPerPage);
        setCurrentPageUsed(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <>
            <UserCouponSection titleCN="歷史紀錄">
                {loading ? (
                    <div className={styles.loading}>正在加載...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : (
                    <Tab.Container defaultActiveKey="/invalid">
                        <div className={styles['post-navbar']}>
                            <Nav variant="underline" className={`${styles['nav-item']} h6`}>
                                <Nav.Item className={`${styles['nav-link']} text-center`}>
                                    <Nav.Link className={`${styles['link-style']}`} eventKey="/invalid">已無效</Nav.Link>
                                </Nav.Item>
                                <Nav.Item className={`${styles['nav-link']} text-center`}>
                                    <Nav.Link className={`${styles['link-style']}`} eventKey="/used">已使用</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </div>
                        <Tab.Content>
                            {/* 已無效的優惠券 */}
                            <Tab.Pane eventKey="/invalid">
                                <div className={`${styles["coupon-group"]} d-flex flex-wrap justify-content-around align-items-center pt-4`}>
                                    {currentInvalidCoupons.length === 0 ? (
                                        <p>沒有過期的優惠券</p>
                                    ) : (
                                        currentInvalidCoupons.map(coupon => {
                                            if (coupon.brand_id === 6) {
                                                // 如果 coupon.brand 是 6，顯示 CouponEndAll
                                                return <CouponEndAll
                                                    key={coupon.id}
                                                    id={coupon.id}
                                                    name={coupon.name}
                                                    discount={coupon.discount_value > 1 ? `折 ${coupon.discount_value}元` : `${((1 - coupon.discount_value) * 100).toFixed(0)}% OFF`}
                                                    condition={coupon.minimum_amount}
                                                    expiration={coupon.end_date}
                                                />;
                                            } else {
                                                // 否則顯示普通的 CouponEnd
                                                return (
                                                    <CouponEnd
                                                        key={coupon.id}
                                                        status="已無效"
                                                        img={brandImageMap[coupon.brand_id]}
                                                        name={coupon.name}
                                                        discount={coupon.discount_value > 1 ? `折 ${coupon.discount_value}` : `${((1 - coupon.discount_value) * 100).toFixed(0)}% OFF`}
                                                        condition={coupon.minimum_amount}
                                                        expiration={coupon.end_date}
                                                    />
                                                );
                                            }
                                        })
                                    )}
                                </div>

                                {/* 分頁控制 */}
                                <div className={styles.pagination}>
                                    <button
                                        className={`${styles.pageBtn} ${currentPageInvalid === 1 ? styles.disabled : ''}`}
                                        onClick={handlePrevPageInvalid}
                                    >
                                        &lt;
                                    </button>
                                    {Math.ceil(invalidCoupons.length / couponsPerPage) > 0 && Array.from({ length: Math.ceil(invalidCoupons.length / couponsPerPage) }, (_, index) => (
                                        <button
                                            key={index + 1}
                                            className={`${styles.pageBtn} ${currentPageInvalid === index + 1 ? styles.active : ''}`}
                                            onClick={() => setCurrentPageInvalid(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        className={`${styles.pageBtn} ${currentPageInvalid === Math.ceil(invalidCoupons.length / couponsPerPage) ? styles.disabled : ''}`}
                                        onClick={handleNextPageInvalid}
                                    >
                                        &gt;
                                    </button>
                                </div>
                            </Tab.Pane>

                            {/* 已使用的優惠券 */}
                            <Tab.Pane eventKey="/used">
                                <div className={`${styles["coupon-group"]} d-flex flex-wrap justify-content-around align-items-center pt-4`}>
                                    {currentUsedCoupons.length === 0 ? (
                                        <p>沒有已使用的優惠券</p>
                                    ) : (
                                        currentUsedCoupons.map(coupon => {
                                            if (coupon.brand === 6) {
                                                // 如果 coupon.brand 是 6，顯示 CouponEndAll
                                                return <CouponEndAll
                                                    key={coupon.id}
                                                    id={coupon.id}
                                                    name={coupon.name}
                                                    discount={coupon.discount_value > 1 ? `折 ${coupon.discount_value}元` : `${((1 - coupon.discount_value) * 100).toFixed(0)}% OFF`}
                                                    condition={coupon.minimum_amount}
                                                    expiration={coupon.end_date}
                                                />;
                                            } else {
                                                // 否則顯示普通的 CouponEnd
                                                return (
                                                    <CouponEnd
                                                        key={coupon.id}
                                                        status="已使用"
                                                        img={brandImageMap[coupon.brand_id]}
                                                        name={coupon.name}
                                                        discount={coupon.discount_value > 1 ? `折 ${coupon.discount_value}元` : `${((1 - coupon.discount_value) * 100).toFixed(0)}% OFF`}
                                                        condition={coupon.minimum_amount}
                                                        expiration={coupon.end_date}
                                                    />
                                                );
                                            }
                                        })
                                    )}
                                </div>

                                {/* 分頁控制 */}
                                <div className={styles.pagination}>
                                    <button
                                        className={`${styles.pageBtn} ${currentPageUsed === 1 ? styles.disabled : ''}`}
                                        onClick={handlePrevPageUsed}
                                    >
                                        &lt;
                                    </button>
                                    {Math.ceil(usedCoupons.length / couponsPerPage) > 0 && Array.from({ length: Math.ceil(usedCoupons.length / couponsPerPage) }, (_, index) => (
                                        <button
                                            key={index + 1}
                                            className={`${styles.pageBtn} ${currentPageUsed === index + 1 ? styles.active : ''}`}
                                            onClick={() => setCurrentPageUsed(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        className={`${styles.pageBtn} ${currentPageUsed === Math.ceil(usedCoupons.length / couponsPerPage) ? styles.disabled : ''}`}
                                        onClick={handleNextPageUsed}
                                    >
                                        &gt;
                                    </button>
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                )}
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
            </UserCouponSection>
        </>
    );
}
