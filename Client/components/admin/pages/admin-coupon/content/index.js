import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import AdminSection from '@/components/admin/common/admin-section';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; // 引入 toast

export default function Index() {
    const router = useRouter();

    // 狀態：表單數據
    const [coupon, setCoupon] = useState({
        name: '',
        code: '',
        start_date: '',
        end_date: '',
        discount_value: '',
        minimum_amount: '',
        brand_id: '0',
        type_id: 2,
    });

    // 錯誤信息
    const [errors, setErrors] = useState({});

    // 當前日期（用來控制日期選擇器）
    const [currentDate, setCurrentDate] = useState('');

    // 儲存開始日期，控制結束日期
    const [minEndDate, setMinEndDate] = useState('');

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]; // 取得今天的日期（yyyy-mm-dd）
        setCurrentDate(today);
    }, []);

    // 更新表單數據
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // 如果更新的是開始日期，則更新最小結束日期
        if (name === 'start_date') {
            setCoupon((prev) => ({ ...prev, start_date: value }));
            setMinEndDate(value);  // 更新最小結束日期
        } else {
            setCoupon((prev) => ({ ...prev, [name]: value }));
        }
    };

    // 隨機生成優惠碼
    const generateCouponCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setCoupon((prev) => ({ ...prev, code }));
        // 檢查是否滿足8為字母和數字要求
        if (!/^[A-Za-z0-9]{8}$/.test(code)) {
            toast.error('自行輸入的優惠代碼無效，請重新輸入',{style:{
                border: '1.2px solid #963827',
                padding: '12px 40px',
                color: '#963827',
              },iconTheme:{
                primary:'#963827',
                secondary:'#fff'
              }
            });
        }
    };

    // 驗證表單數據
    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        // 檢查優惠券名稱
        if (!coupon.name) {
            newErrors.name = '優惠券名稱是必填的';
            isValid = false;
        }

        // 檢查優惠代碼
        if (!coupon.code) {
            newErrors.code = '優惠代碼是必填的';
            isValid = false;
        }

        // 檢查日期
        if (!coupon.start_date || !coupon.end_date) {
            newErrors.start_date = '請選擇開始和結束日期';
            isValid = false;
        }

        // 驗證折扣金額或折扣比例
        if (!coupon.discount_value || isNaN(coupon.discount_value)) {
            newErrors.discount_value = '折扣額度是必填的';
            isValid = false;
        } else {
            if (coupon.type_id === 2 && parseInt(coupon.discount_value) < 0) {
                newErrors.discount_value = '折扣金額不能小於0';
                isValid = false;
            }
            if (coupon.type_id === 1 && (parseFloat(coupon.discount_value) <= 0 || parseFloat(coupon.discount_value) >= 1)) {
                newErrors.discount_value = '折扣折數必須在0到1之間';
                isValid = false;
            }
        }

        // 檢查最低消費額度
        if (!coupon.minimum_amount || isNaN(coupon.minimum_amount)) {
            newErrors.minimum_amount = '最低消費額度是必填的';
            isValid = false;
        }

        // 檢查品牌選擇
        if (coupon.brand_id === '0') {
            newErrors.brand_id = '品牌是必填的';
            isValid = false;
        }

        // 檢查折扣類型
        if (!coupon.type_id) {
            newErrors.type_id = '折扣類型是必填的';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // 表單提交
    const handleSubmit = (e) => {
        e.preventDefault();

        // 清除之前的錯誤
        setErrors({});

        if (validateForm()) {
            // 在發送之前確保數據是正確的數值類型
            const updatedCoupon = {
                ...coupon,
                discount_value: parseFloat(coupon.discount_value),  // 確保是浮動數值
                minimum_amount: parseInt(coupon.minimum_amount, 10),  // 確保是整數
            };

            axios.post('http://localhost:3005/api/coupons/create/content', updatedCoupon, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    console.log('成功返回:', response.data);  // 打印響應數據
                    if (response.data.status === 'success') {
                        toast.success('優惠券創建成功！', {
                            style: {
                              border: '1.2px solid #90957a',
                              padding: '12px 40px',
                              color: '#626553',
                            },
                            iconTheme: {
                              primary: '#626553',
                              secondary: '#fff',
                            },
                          });
                        setCoupon({
                            name: '',
                            code: '',
                            start_date: '',
                            end_date: '',
                            discount_value: '',
                            minimum_amount: '',
                            brand_id: '0',
                            type_id: 2,
                        }); // 清空表單
                        router.push('/admin/coupon');  // 提交後跳轉到優惠券列表頁
                    } else {
                        toast.error('創建優惠券失敗：' + response.data.message,{style:{
                            border: '1.2px solid #963827',
                            padding: '12px 40px',
                            color: '#963827',
                          },iconTheme:{
                            primary:'#963827',
                            secondary:'#fff'
                          }
                        });
                    }
                })
                .catch((error) => {
                    // console.error('發送請求時發生錯誤:', error);
                    toast.error(`發生錯誤，請稍後再試` ,{style:{
                        border: '1.2px solid #963827',
                        padding: '12px 40px',
                        color: '#963827',
                      },iconTheme:{
                        primary:'#963827',
                        secondary:'#fff'
                      }
                    });
                    // alert('發生錯誤，請稍後再試！');

                    // 檢查是否有返回的錯誤信息
                    if (error.response) {
                        console.error('錯誤詳細信息:', error.response.data,{style:{
                            border: '1.2px solid #963827',
                            padding: '12px 40px',
                            color: '#963827',
                          },iconTheme:{
                            primary:'#963827',
                            secondary:'#fff'
                          }
                        });
                        // alert('錯誤詳細信息: ' + (error.response.data.message || '未知錯誤'));
                    } else {
                        console.error('錯誤消息:', error.message,{style:{
                            border: '1.2px solid #963827',
                            padding: '12px 40px',
                            color: '#963827',
                          },iconTheme:{
                            primary:'#963827',
                            secondary:'#fff'
                          }
                        });
                    }
                });
        }
    };

    return (
        <AdminSection titleCN="建立優惠券">
            <div className={`${styles['msg-group']} d-flex flex-column align-items-center justify-content-center`}>
                <div className={`${styles['msg-title']} h5 my-4`}>基本資料</div>

                <form onSubmit={handleSubmit}>
                    <div className="d-flex flex-column align-items-end">
                        {/* 品牌選擇 */}
                        <div className={`${styles['input-gp']} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>品牌</div>
                            <div>
                                <select
                                    className={`form-select ${styles.select}`}
                                    aria-label="Default select example"
                                    name="brand_id"
                                    value={coupon.brand_id}
                                    onChange={handleInputChange}
                                >
                                    <option value='0'>選擇品牌</option>
                                    <option value='1'>BOBBI BROWN</option>
                                    <option value='2'>ESTEE LAUDER</option>
                                    <option value='3'>LANCOME</option>
                                    <option value='4'>NARS</option>
                                    <option value='5'>YSL</option>
                                    <option value='6'>全站</option>
                                </select>
                                {errors.brand_id && <div className={styles.error}>{errors.brand_id}</div>}
                            </div>
                        </div>

                        {/* 優惠券名稱 */}
                        <div className={`${styles['input-gp']} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>優惠券名稱</div>
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="請輸入"
                                    value={coupon.name}
                                    onChange={handleInputChange}
                                />
                                {errors.name && <div className={styles.error}>{errors.name}</div>}
                            </div>
                        </div>

                        {/* 優惠代碼 */}
                        <div className={`${styles['input-gp']} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>優惠代碼</div>
                            <div className="d-flex flex-column">
                                <div className={`d-flex ${styles.dscode}`}>
                                    <input
                                        type="text"
                                        name="code"
                                        placeholder="請輸入"
                                        value={coupon.code}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        type="button"
                                        className={`${styles.success} btn-success ms-2`}
                                        onClick={generateCouponCode}
                                    >
                                        隨機生成
                                    </button>
                                </div>
                                <div className={styles.ps}>請輸入A-Z、a-z、0-9，最多輸入8個字元。</div>
                                {errors.code && <div className={styles.error}>{errors.code}</div>}
                            </div>
                        </div>

                        {/* 可使用期限 */}
                        <div className={`${styles['input-gp']} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>可使用期限</div>
                            <div className={`${styles.exdate} d-flex align-items-center justify-content-between`}>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={coupon.start_date}
                                    onChange={handleInputChange}
                                    min={currentDate} // 禁用小於今天的日期
                                />
                                <div className={styles.line}></div>
                                <input
                                    type="date"
                                    name="end_date"
                                    value={coupon.end_date}
                                    onChange={handleInputChange}
                                    min={minEndDate} // 禁用小於開始日期的結束日期
                                />
                            </div>
                        </div>

                        {/* 活動類型 | 折扣額度限制 */}
                        <div className={`${styles['input-gp']} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>活動類型 | 折扣額度限制</div>
                            <div>
                                <div className={`input-group d-flex ${styles.discount}`}>
                                    {/* 使用select代替dropdown */}
                                    <select
                                        className={`form-select ${styles['btn-dp']}`}
                                        name="type_id"
                                        value={coupon.type_id}
                                        onChange={handleInputChange}
                                    >
                                        <option value={2}>折扣金額</option>
                                        <option value={1}>折扣折數</option>
                                    </select>

                                    {/* 折扣金額輸入框 */}
                                    <input
                                        type="number"
                                        name="discount_value"
                                        className={`form-control ${styles.number}`}
                                        value={coupon.discount_value}
                                        onChange={handleInputChange}
                                        placeholder={coupon.type_id === 1 ? "請輸入折扣比例 (0 - 1)" : "請輸入折扣金額"}
                                    />
                                </div>
                                {errors.discount_value && <div className={styles.error}>{errors.discount_value}</div>}
                            </div>
                        </div>

                        {/* 最低消費額度 */}
                        <div className={`${styles['input-gp']} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>最低消費額度</div>
                            <div>
                                <input
                                    type="text"
                                    name="minimum_amount"
                                    placeholder="NT$ ｜請輸入"
                                    value={coupon.minimum_amount}
                                    onChange={handleInputChange}
                                />
                                {errors.minimum_amount && <div className={styles.error}>{errors.minimum_amount}</div>}
                            </div>
                        </div>

                        <hr className="align-self-stretch" />
                    </div>

                    {/* 按鈕 */}
                    <div className={`${styles['btn-gp']} d-flex justify-content-center`}>
                        <button className={`h6 btn-secondary me-5 ${styles.btn}`} type="submit">
                            儲存
                        </button>
                        <Link href="/admin/coupon" passHref>
                            <button className={`h6 btn-primary ${styles.btn}`}>取消</button>
                        </Link>
                    </div>
                </form>
            </div>
        </AdminSection>
    );
}
