import React, { useState, useEffect } from 'react';
import CouponUse from '@/components/discount/common/coupon-use';
import CouponUseAll from '@/components/discount/common/coupon-use-all';
import CouponWait from '@/components/discount/common/coupon-wait';
import CouponWaitAll from '@/components/discount/common/coupon-wait-all';
import styles from './index.module.scss';
import UserCouponSection from '@/components/discount/common/user-coupon-section';
import { useAuth } from '@/hooks/use-auth';
import toast, { Toaster } from 'react-hot-toast';
import FilterModal from '@/components/discount/common/mymodal'; // 引入 FilterModal
import { IoFunnel } from "react-icons/io5";

const UserCoupon = () => {
    const { auth } = useAuth();
    const [modalShow, setModalShow] = useState(false);  // 控制篩選彈窗顯示與隱藏
    const [selectedTypes, setSelectedTypes] = useState([]); // 儲存選擇的優惠券類型
    const [selectedBrands, setSelectedBrands] = useState([]); // 儲存選擇的品牌
    const [couponCode, setCouponCode] = useState(''); // 優惠券代碼
    const [coupons, setCoupons] = useState([]);  // 儲存用戶的優惠券
    const [loading, setLoading] = useState(true);  // 載入狀態
    const [currentPage, setCurrentPage] = useState(1);  // 當前頁面
    const [couponsPerPage] = useState(6);  // 每頁顯示的優惠券數量
    const [filteredCoupons, setFilteredCoupons] = useState([]);  // 儲存篩選後的優惠券
    const userId = auth.isAuth ? auth.userData.id : null;  // 用戶ID
    const [totalPages, setTotalPages] = useState(1);  // 總頁數

    // 品牌圖片對應
    const brandImageMap = {
        1: '/discount/coupon/brands/bobbi.svg',
        2: '/discount/coupon/brands/estee.svg',
        3: '/discount/coupon/brands/lancome.svg',
        4: '/discount/coupon/brands/nars.svg',
        5: '/discount/coupon/brands/ysl.svg',
    };

    // 獲取用戶優惠券
    const fetchCoupons = async () => {
        if (!userId) {
            toast.error('未找到使用者資訊，請先登入',{style:{
                border: '1.2px solid #963827',
                padding: '12px 40px',
                color: '#963827',
              },iconTheme:{
                primary:'#963827',
                secondary:'#fff'
              }
            }); // 顯示通知
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3005/api/user-coupons/${userId}?page=${currentPage}&limit=${couponsPerPage}`);
            const data = await response.json();
            setCoupons(data.data);

            // 計算總頁數（假設API有返回總數量或總頁數）
            const totalCoupons = data.totalCount || data.data.length;  // 假設 totalCount 是從伺服器返回的總數量
            const totalPages = Math.ceil(totalCoupons / couponsPerPage);  // 總頁數
            setTotalPages(totalPages);
        } catch (error) {
            console.error('獲取優惠券時發生錯誤:', error);
            toast.error('獲取優惠券時發生錯誤',{style:{
                border: '1.2px solid #963827',
                padding: '12px 40px',
                color: '#963827',
              },iconTheme:{
                primary:'#963827',
                secondary:'#fff'
              }
            });
        } finally {
            setLoading(false);
        }
    };

    // 更新篩選後的優惠券
    useEffect(() => {
        const validCoupons = coupons.filter(coupon => new Date(coupon.end_date) > new Date());
        const filtered = validCoupons.filter(coupon => {
            const isBrandMatch = selectedBrands.length ? selectedBrands.includes(coupon.brand_id) : true;
            const isTypeMatch = selectedTypes.length ? selectedTypes.includes(coupon.type_id) : true;
            return isBrandMatch && isTypeMatch;
        });
        setFilteredCoupons(filtered);
    }, [coupons, selectedTypes, selectedBrands]);

    // 套用篩選條件
    const applyFilters = () => {
        setModalShow(false);  // 隱藏彈窗
    };

    // 取消所有篩選
    const resetFilters = () => {
        setSelectedTypes([]);
        setSelectedBrands([]);
    };

    // 頁面更新後重新加載優惠券
    useEffect(() => {
        if (userId) {
            fetchCoupons();
        }
    }, [userId, currentPage]);

    // 处理优惠券领取逻辑
    const handleClaimCoupon = async () => {
        if (!couponCode) {
            // setError('請輸入優惠券代碼');
            toast.error('請輸入優惠券代碼',{style:{
                border: '1.2px solid #963827',
                padding: '12px 40px',
                color: '#963827',
              },iconTheme:{
                primary:'#963827',
                secondary:'#fff'
              }
            }); // 顯示錯誤通知
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
                throw new Error('取得優惠券列表失敗');
            }

            const data = await response.json();
            const matchedCoupon = data.find((coupon) => coupon.code === couponCode);

            if (!matchedCoupon) {
                // 如果未找到匹配的優惠券
                // setError('優惠券代碼錯誤，請重新輸入');
                toast.error('優惠券代碼錯誤，請重新輸入',{style:{
                    border: '1.2px solid #963827',
                    padding: '12px 40px',
                    color: '#963827',
                  },iconTheme:{
                    primary:'#963827',
                    secondary:'#fff'
                  }
                }); // 顯示錯誤通知
                return;
            }

            // 如果找到了匹配的優惠券，接下來檢查是否已領取
            const relationResponse = await fetch(`http://localhost:3005/api/user-coupons?userId=${userId}&couponId=${matchedCoupon.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!relationResponse.ok) {
                throw new Error('查詢優惠券領取紀錄失敗');
            }

            const relationData = await relationResponse.json();

            if (relationData.length > 0) {
                // 如果已經有該記錄，說明用戶已領取過此優惠券
                // setError('您已領取過此優惠券');
                toast.error('您已領取過此優惠券',{style:{
                    border: '1.2px solid #963827',
                    padding: '12px 40px',
                    color: '#963827',
                  },iconTheme:{
                    primary:'#963827',
                    secondary:'#fff'
                  }
                }); // 顯示錯誤通知
                return;
            }

            // 如果沒有領取過，插入新的領取記錄
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
                // setMessage('優惠券領取成功！');
                toast.success('優惠券領取成功！' , {
                    style: {
                      border: '1.2px solid #90957a',
                      padding: '12px 40px',
                      color: '#626553',
                    },
                    iconTheme: {
                      primary: '#626553',
                      secondary: '#fff',
                    },
                  }); // 顯示成功通知
                // 可選：重新獲取優惠券數據
                fetchCoupons();
            } else {
                // setError(claimData.error || '領取優惠券失敗');
                toast.error(claimData.error || '領取優惠券失敗' ,{style:{
                    border: '1.2px solid #963827',
                    padding: '12px 40px',
                    color: '#963827',
                  },iconTheme:{
                    primary:'#963827',
                    secondary:'#fff'
                  }
                }); // 顯示錯誤通知
            }
        } catch (error) {
            console.error('發生錯誤:', error);
            // setError('查詢優惠券時發生錯誤');
            toast.error('查詢優惠券時發生錯誤' ,{style:{
                border: '1.2px solid #963827',
                padding: '12px 40px',
                color: '#963827',
              },iconTheme:{
                primary:'#963827',
                secondary:'#fff'
              }
            }); // 顯示錯誤通知
        } finally {
            setLoading(false);
        }
    };


    return (
        <UserCouponSection titleCN="優惠券" titleENG="Coupon">
            <aside className={styles.right}>
                <div className={`${styles.search} mt-2 d-flex justify-content-center align-items-center`}>
                    <div className={`p me-4 ${styles.add}`}>新增優惠券</div>
                    <input
                        className="p-1 me-4"
                        type="text"
                        placeholder="請輸入優惠券代碼"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button className={`btn-primary ${styles.btnReceive}`} onClick={handleClaimCoupon}>領取</button>
                    {/* 設置篩選按鈕 */}
                    <button onClick={() => setModalShow(true)} className={`btn ${styles.funnel}`}><IoFunnel size={25} color='#90957a' /></button>
                </div>

                {/* 篩選條件彈窗 */}
                <FilterModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    selectedTypes={selectedTypes}
                    setSelectedTypes={setSelectedTypes}
                    selectedBrands={selectedBrands}
                    setSelectedBrands={setSelectedBrands}
                    applyFilters={applyFilters}
                    resetFilters={resetFilters}
                />

                {/* 載入狀態 */}
                {/* {loading && <p>加載中...</p>} */}

                {/* 顯示優惠券 */}
                <div className={`${styles["coupon-group"]} d-flex flex-wrap justify-content-around  lign-content-stretch`}>
                    {filteredCoupons.map((coupon, index) => {
                        const isCouponActive = new Date(coupon.start_date) <= new Date();

                        // 判斷 brand_id 是否為 6
                        if (coupon.brand_id === 6) {
                            if (isCouponActive) {
                                // brand_id 是 6 且優惠券有效，顯示 CouponUseAll
                                return (
                                    <CouponUseAll
                                        key={index}
                                        name={coupon.name}
                                        discount_value={coupon.discount_value > 1 ? `折 ${coupon.discount_value}元` : `${(1 - coupon.discount_value).toFixed(2) * 100}% OFF`}
                                        minimum_amount={coupon.minimum_amount}
                                        end_date={coupon.end_date}
                                    />
                                );
                            } else {
                                // brand_id 是 6 且優惠券尚未啟用，顯示 CouponWaitAll
                                return (
                                    <CouponWaitAll
                                        key={index}
                                        name={coupon.name}
                                        discount_value={coupon.discount_value > 1 ? `折 ${coupon.discount_value}元` : `${(1 - coupon.discount_value).toFixed(2) * 100}% OFF`}
                                        minimum_amount={coupon.minimum_amount}
                                        start_date={Math.floor((new Date(coupon.start_date) - new Date()) / (1000 * 60 * 60 * 24))} // 計算距離開始時間的天數
                                    />
                                );
                            }
                        } else {
                            // 當 brand_id 不是 6 時，檢查優惠券是否有效
                            if (isCouponActive) {
                                return (
                                    <CouponUse
                                        key={index}
                                        img={brandImageMap[coupon.brand_id]}
                                        name={coupon.name}
                                        discount_value={coupon.discount_value > 1 ? `折 ${coupon.discount_value}元` : `${(1 - coupon.discount_value).toFixed(2) * 100}% OFF`}
                                        minimum_amount={coupon.minimum_amount}
                                        end_date={coupon.end_date}
                                    />
                                );
                            } else {
                                return (
                                    <CouponWait
                                        key={index}
                                        img={brandImageMap[coupon.brand_id]}
                                        name={coupon.name}
                                        discount_value={coupon.discount_value > 1 ? `折 ${coupon.discount_value}元` : `${(1 - coupon.discount_value).toFixed(2) * 100}% OFF`}
                                        minimum_amount={coupon.minimum_amount}
                                        start_date={Math.floor((new Date(coupon.start_date) - new Date()) / (1000 * 60 * 60 * 24))} // 計算距離開始時間的天數
                                    />
                                );
                            }
                        }
                    })}
                </div>

                {/* 分頁控制 */}
                <div className={styles.pagination}>
                    <button
                        className={` ${styles.btnnone} ${currentPage === 1 ? styles.disabled : ''}`}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}  // 上一頁
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>
                    {totalPages > 0 && Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`${styles.pageBtn} ${currentPage === index + 1 ? styles.active : ''}`}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        className={`${styles.btnnone} ${currentPage === totalPages ? styles.disabled : ''}`}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}  // 下一頁
                        disabled={currentPage === totalPages}
                    >
                        &gt;
                    </button>
                </div>
            </aside>
            <Toaster />
        </UserCouponSection>
    );
};

export default UserCoupon;
