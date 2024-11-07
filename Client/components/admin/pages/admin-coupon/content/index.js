import React, { useState } from 'react';
import styles from './index.module.scss';
import AdminSection from '@/components/admin/common/admin-section';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

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

    // 更新表單數據
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCoupon((prev) => ({ ...prev, [name]: value }));
    };

    // 隨機生成優惠碼
    const generateCouponCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setCoupon((prev) => ({ ...prev, code }));
        // 檢查是否曼族8為字母和數字要求
        if (!/^[A-Za-z0-9]{8}$/.test(code)) {
            alert('自行輸入的優惠代碼無效，請重新輸入');
        }
    };

    // 驗證表單數據
    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!coupon.name) {
            newErrors.name = '優惠券名稱是必填的';
            isValid = false;
        }

        if (!coupon.code) {
            newErrors.code = '優惠代碼是必填的';
            isValid = false;
        }

        if (!coupon.start_date || !coupon.end_date) {
            newErrors.start_date = '請選擇開始和結束日期';
            isValid = false;
        }

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

        if (!coupon.minimum_amount || isNaN(coupon.minimum_amount)) {
            newErrors.minimum_amount = '最低消費額度是必填的';
            isValid = false;
        }

        if (!coupon.brand_id) {
            newErrors.brand_id = '品牌是必填的';
            isValid = false;
        }

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
            // 在发送之前确保数据是正确的数值类型
            const updatedCoupon = {
                ...coupon,
                discount_value: parseFloat(coupon.discount_value),  // 确保是浮动数值
                minimum_amount: parseInt(coupon.minimum_amount, 10),  // 确保是整数
            };

            axios.post('http://localhost:3005/api/coupons/create/content', updatedCoupon, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    console.log('成功返回:', response.data);  // 打印响应数据
                    if (response.data.status === 'success') {
                        alert('優惠券創建成功！');
                        setCoupon({
                            name: '',
                            code: '',
                            start_date: '',
                            end_date: '',
                            discount_value: '',
                            minimum_amount: '',
                            brand_id: '0',
                            type_id: 2,
                        }); // 清空表单
                        router.push('/admin/coupon');  // 提交後跳轉到優惠券列表頁
                    } else {
                        alert('創建優惠券失敗：' + response.data.message);
                    }
                })
                .catch((error) => {
                    console.error('发送请求时发生错误:', error);
                    alert('发生错误，请稍后再试！');

                    // 检查是否有返回的错误信息
                    if (error.response) {
                        console.error('错误详细信息:', error.response.data);
                        alert('错误详细信息: ' + (error.response.data.message || '未知错误'));
                    } else {
                        console.error('错误消息:', error.message);
                    }
                });
        }
    };




    return (
        <>
            <AdminSection titleCN="建立優惠券">
                <div className={`${styles['msg-group']} d-flex flex-column align-items-center justify-content-center`}>
                    <div className={`${styles['msg-title']} h5 my-4`}>基本資料</div>

                    <form onSubmit={handleSubmit}>
                        <div className="d-flex flex-column align-items-end">
                            {/* 品牌选择 */}
                            <div className={`${styles['input-gp']} d-flex justify-content-between align-self-stretch align-items-center`}>
                                <div className={styles.name}>品牌</div>
                                <select
                                    className={`form-select ${styles.select}`}
                                    aria-label="Default select example"
                                    name="brand_id"
                                    value={coupon.brand_id} // 设置value为品牌状态
                                    onChange={handleInputChange}
                                >
                                    <option value='0'>選擇品牌</option>
                                    <option value='1'>BOBBI BROWN</option>
                                    <option value='2'>ESTEE LAUDER</option>
                                    <option value='3'>LANCOME</option>
                                    <option value='4'>NARS</option>
                                    <option value='5'>YSL</option>
                                </select>
                                {errors.brand_id && <div className={styles.error}>{errors.brand_id}</div>}
                            </div>

                            {/* 優惠券名稱 */}
                            <div className={`${styles['input-gp']} d-flex justify-content-between align-self-stretch align-items-center`}>
                                <div className={styles.name}>優惠券名稱</div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="請輸入"
                                    value={coupon.name}
                                    onChange={handleInputChange}
                                />
                                {errors.name && <div className={styles.error}>{errors.name}</div>}
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
                                    {errors.code && <div className={styles.error}>{errors.code}</div>}
                                    <div className={styles.ps}>請輸入A-Z、a-z、0-9，最多輸入8個字元。</div>
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
                                    />
                                    <div className={styles.line}></div>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={coupon.end_date}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {errors.start_date && <div className={styles.error}>{errors.start_date}</div>}
                            </div>

                            {/* 活動類型 | 折扣額度限制 */}
                            <div className={`${styles['input-gp']} d-flex justify-content-between align-self-stretch align-items-center`}>
                                <div className={styles.name}>活動類型 | 折扣額度限制</div>
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

                                    {/* 折扣金额输入框 */}
                                    <input
                                        type="number"
                                        name="discount_value"
                                        className={`form-control ${styles.number}`}
                                        value={coupon.discount_value}
                                        onChange={handleInputChange}
                                        placeholder={coupon.type_id === 1 ? "請輸入折扣比例 (0 - 1)" : "請輸入折扣金額"}
                                    />
                                </div>
                                {errors.type_id && <div className={styles.error}>{errors.type_id}</div>}
                            </div>

                            {/* 最低消費額度 */}
                            <div className={`${styles['input-gp']} d-flex justify-content-between align-self-stretch align-items-center`}>
                                <div className={styles.name}>最低消費額度</div>
                                <input
                                    type="text"
                                    name="minimum_amount"
                                    placeholder="NT$ ｜請輸入"
                                    value={coupon.minimum_amount}
                                    onChange={handleInputChange}
                                />
                                {errors.minimum_amount && <div className={styles.error}>{errors.minimum_amount}</div>}
                            </div>

                            <hr className="align-self-stretch" />
                        </div>

                        {/* 按钮 */}
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
        </>
    );
}
