import React, { useState, useEffect } from 'react';
import CouponUse from '@/components/discount/common/coupon-use';
import CouponWait from '@/components/discount/common/coupon-wait';
import styles from './index.module.scss';
import UserCouponSection from '@/components/discount/common/user-coupon-section';
import { useAuth } from '@/hooks/use-auth';
import toast, { Toaster } from 'react-hot-toast';
import FilterModal from '@/components/discount/common/mymodal'; // 引入 FilterModal
import { IoFunnel } from "react-icons/io5";

const UserCoupon = () => {
<<<<<<< HEAD
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
=======
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
            toast.error('未找到使用者資訊，請先登入'); // 顯示通知
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3005/api/user-coupons/${userId}?page=${currentPage}&limit=${couponsPerPage}`);
            const data = await response.json();
            setCoupons(data.data);
>>>>>>> aefcf016f9a9a755025bcf59f95c47e8f19975e2

            // 計算總頁數（假設API有返回總數量或總頁數）
            const totalCoupons = data.totalCount || data.data.length;  // 假設 totalCount 是從伺服器返回的總數量
            const totalPages = Math.ceil(totalCoupons / couponsPerPage);  // 總頁數
            setTotalPages(totalPages);
        } catch (error) {
            console.error('獲取優惠券時發生錯誤:', error);
            toast.error('獲取優惠券時發生錯誤');
        } finally {
            setLoading(false);
        }
    };

<<<<<<< HEAD
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
=======
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
            toast.error('請輸入優惠券代碼'); // 顯示錯誤通知
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
                toast.error('優惠券代碼錯誤，請重新輸入'); // 顯示錯誤通知
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
                toast.error('您已領取過此優惠券'); // 顯示錯誤通知
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
                toast.success('優惠券領取成功！'); // 顯示成功通知
                // 可選：重新獲取優惠券數據
                fetchCoupons();
            } else {
                // setError(claimData.error || '領取優惠券失敗');
                toast.error(claimData.error || '領取優惠券失敗'); // 顯示錯誤通知
            }
        } catch (error) {
            console.error('發生錯誤:', error);
            // setError('查詢優惠券時發生錯誤');
            toast.error('查詢優惠券時發生錯誤'); // 顯示錯誤通知
        } finally {
            setLoading(false);
        }
    };


    return (
        <UserCouponSection titleCN="優惠券" titleENG="Coupon">
            <aside className={styles.right}>
                <div className={`${styles.search} mt-2 d-flex justify-content-center align-items-center`}>
                    <div className="p me-4">新增優惠券</div>
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
                <div className={`${styles["coupon-group"]} d-flex flex-wrap justify-content-around align-items-center pt-4`}>
                    {filteredCoupons.map((coupon, index) => {
                        const isCouponActive = new Date(coupon.start_date) <= new Date();
                        return isCouponActive ? (
                            <CouponUse
                                key={index}
                                img={brandImageMap[coupon.brand_id]}
                                name={coupon.name}
                                discount_value={coupon.discount_value > 1 ? `折 ${coupon.discount_value}元` : `${(1 - coupon.discount_value).toFixed(2) * 100}% OFF`}
                                minimum_amount={coupon.minimum_amount}
                                end_date={coupon.end_date}
                            />
                        ) : (
                            <CouponWait
                                key={index}
                                img={brandImageMap[coupon.brand_id]}
                                name={coupon.name}
                                discount_value={coupon.discount_value > 1 ? `折 ${coupon.discount_value}元` : `${(1 - coupon.discount_value).toFixed(2) * 100}% OFF`}
                                minimum_amount={coupon.minimum_amount}
                                start_date={Math.floor((new Date(coupon.start_date) - new Date()) / (1000 * 60 * 60 * 24))}
                            />
                        );
                    })}
                </div>

                {/* 分頁控制 */}
                <div className={styles.pagination}>
                    <button
                        className={`${styles.pageBtn} ${currentPage === 1 ? styles.disabled : ''}`}
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
                        className={`${styles.pageBtn} ${currentPage === totalPages ? styles.disabled : ''}`}
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
>>>>>>> aefcf016f9a9a755025bcf59f95c47e8f19975e2
};

export default UserCoupon;
