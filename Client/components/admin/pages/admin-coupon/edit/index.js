import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import AdminSection from '@/components/admin/common/admin-section';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast'; // 引入 toast

export default function Index() {
    const [coupon, setCoupon] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    // 當組件加載後，從 localStorage 獲取 couponId 並根據它獲取優惠券數據
    useEffect(() => {
        const couponId = localStorage.getItem('couponId');
        if (couponId) {
            fetch(`http://localhost:3005/api/coupons/${couponId}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Fetched coupon data:", data);
                    setCoupon(data[0]);
                    setLoading(false); // 加載完成
                })
                .catch(err => {
                    console.error('獲取優惠券數據失敗:', err);
                    // setError('無法獲取優惠券數據');
                    toast.error('無法獲取優惠券數據',{style:{
                        border: '1.2px solid #f44336',
                        padding: '12px 40px',
                        color: '#f44336',
                      },iconTheme:{
                        primary:'#f44336',
                        secondary:'#fff'
                      }
                    })
                    setLoading(false); // 即使有錯誤也要停止加載
                });
        } else {
            // setError('找不到優惠券ID');
            toast.error('找不到優惠券ID',{style:{
                border: '1.2px solid #f44336',
                padding: '12px 40px',
                color: '#f44336',
              },iconTheme:{
                primary:'#f44336',
                secondary:'#fff'
              }
            })
            setLoading(false);
        }
    }, []);

    // 處理輸入框的變更
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCoupon((prevCoupon) => ({
            ...prevCoupon,
            [name]: value, // 更新 coupon 物件中的對應欄位
        }));
    };

    // 處理表單提交
    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("提交的優惠券資料：", coupon);  // 打印 coupon 內容，確認資料是否正確

        // 提交表單數據到後端
        fetch(`http://localhost:3005/api/coupons/${coupon.id}`, {
            method: 'PUT',
            body: JSON.stringify(coupon),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(updatedCoupon => {
                setCoupon(updatedCoupon); // 更新為後端返回的資料
                toast.success('優惠券更新成功！', {
                    style: {
                      border: '1.2px solid #90957a',
                      padding: '12px 40px',
                      color: '#626553',
                    },
                    iconTheme: {
                      primary: '#626553',
                      secondary: '#fff',
                    },
                  }); // 使用 toast 顯示成功訊息
                router.push('/admin/coupon');  // 提交後跳轉到優惠券列表頁
            })
            .catch(err => {
                // console.error('更新優惠券失敗:', err);
                toast.error('更新優惠券時發生錯誤' ,{style:{
                    border: '1.2px solid #963827',
                    padding: '12px 40px',
                    color: '#963827',
                  },iconTheme:{
                    primary:'#963827',
                    secondary:'#fff'
                  }
                }); // 使用 toast 顯示錯誤訊息
            });
    };

    // 處理禁用優惠券
    const handleDeleteCoupon = async () => {
        const couponId = localStorage.getItem('couponId');
        if (!couponId) {
            // setError('無法找到優惠券ID');
            toast.error('無法找到優惠券ID' ,{style:{
                border: '1.2px solid #963827',
                padding: '12px 40px',
                color: '#963827',
              },iconTheme:{
                primary:'#963827',
                secondary:'#fff'
              }
            });
            return;
        }

        // 確認 couponId 是否正確
        // console.log("Coupon ID:", couponId);
        // console.log("Coupon valid:", coupon.valid);  // 確認 valid 欄位

        try {
            // 發送 PUT 請求將 valid 設為 0，表示禁用優惠券
            const response = await fetch(`http://localhost:3005/api/coupons/${couponId}`, {
                method: 'PUT',
                body: JSON.stringify({ valid: 0 }), // 設置 valid 為 0
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('更新優惠券狀態失敗');
            }

            toast.success('優惠券已被禁用', {
                style: {
                  border: '1.2px solid #90957a',
                  padding: '12px 40px',
                  color: '#626553',
                },
                iconTheme: {
                  primary: '#626553',
                  secondary: '#fff',
                },
              }); // 使用 toast 顯示禁用成功訊息
            router.push('/admin/coupon');  // 禁用後跳轉到優惠券列表頁
        } catch (err) {
            // console.error('禁用優惠券時發生錯誤:', err);
            toast.error('禁用優惠券時發生錯誤',{style:{
                border: '1.2px solid #963827',
                padding: '12px 40px',
                color: '#963827',
              },iconTheme:{
                primary:'#963827',
                secondary:'#fff'
              }
            }); // 使用 toast 顯示錯誤訊息
        }
    };

    // 如果還在加載或者有錯誤，顯示提示
    if (loading) {
        return <div>加載中...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <AdminSection titleCN="修改優惠券">
            <form onSubmit={handleSubmit}>
                <div className={`${styles["msg-group"]} d-flex flex-column align-items-center`}>
                    <div className={`${styles["msg-title"]} h5 my-4`}>基本資料</div>

                    <div className="d-flex flex-column align-items-end">
                        {/* 品牌選擇 */}
                        <div className={`${styles["input-gp"]} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>品牌</div>
                            <select
                                className={`form-select ${styles.select}`}
                                aria-label="品牌選擇"
                                name="brand_id"
                                value={coupon.brand_id}
                                onChange={handleInputChange}
                            >
                                <option value="1">BOBBI BROWN</option>
                                <option value="2">ESTEE LAUDER</option>
                                <option value="3">LANCOME</option>
                                <option value="4">NARS</option>
                                <option value="5">YSL</option>
                                <option value="6">全站</option>
                            </select>
                        </div>

                        {/* 優惠券名稱 */}
                        <div className={`${styles["input-gp"]} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>優惠券名稱</div>
                            <input
                                type="text"
                                name="name"
                                value={coupon.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* 優惠代碼 */}
                        <div className={`${styles["input-gp"]} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>優惠代碼</div>
                            <div className="d-flex flex-column">
                                <div className={`d-flex ${styles.dscode}`}>
                                    <input
                                        type="text"
                                        name="code"
                                        value={coupon.code}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={styles.ps}>請輸入A-Z、a-z、0-9，最多輸入8個字元。</div>
                            </div>
                        </div>

                        {/* 可使用期限 */}
                        <div className={`${styles["input-gp"]} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>可使用期限</div>
                            <div className={`${styles.exdate} d-flex align-items-center justify-content-between`}>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={coupon.start_date}
                                    onChange={handleInputChange}
                                />
                                <div className={styles.line}></div>
                                <input
                                    type="date"
                                    name="end_date"
                                    value={coupon.end_date}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* 折扣額度限制 */}
                        <div className={`${styles['input-gp']} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>活動類型 | 折扣額度限制</div>
                            <div className={`input-group d-flex ${styles.discount}`}>
                                <select
                                    className={`form-select ${styles['btn-dp']}`}
                                    name="type_id"
                                    value={coupon.type_id}
                                    onChange={handleInputChange}
                                >
                                    <option value={2}>折扣金額</option>
                                    <option value={1}>折扣折數</option>
                                </select>
                                <input
                                    type="number"
                                    name="discount_value"
                                    className={`form-control ${styles.number}`}
                                    value={coupon.discount_value}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* 最低消費額度 */}
                        <div className={`${styles["input-gp"]} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>最低消費額度</div>
                            <input
                                type="text"
                                name="minimum_amount"
                                value={coupon.minimum_amount}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* 可使用數量 */}
                        {/* <div className={`${styles["input-gp"]} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>可使用數量</div>
                            <input
                                type="text"
                                name="maximum"
                                value={coupon.maximum}
                                onChange={handleInputChange}
                            />
                        </div> */}

                        <hr className="align-self-stretch" />
                    </div>

                    <div className={`${styles["btn-gp"]} d-flex`}>
                        <button
                            className={`h6 btn-danger me-5 ${styles.danger}`}
                            type="button"
                            onClick={handleDeleteCoupon}  // 調用禁用操作
                        >
                            刪除
                        </button>

                        <button className={`h6 btn-secondary ${styles.btn}`} type="submit">
                            儲存編輯
                        </button>
                    </div>
                </div>
            </form>

            {/* Toaster 用於顯示 Toast 訊息 */}
            <Toaster />
        </AdminSection>
    );
}
