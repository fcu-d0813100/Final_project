// import React, { useEffect, useState } from 'react';
// import styles from './index.module.scss';
// import AdminSection from '@/components/admin/common/admin-section';
// import Link from 'next/link';

// export default function Index() {
//     const [coupon, setCoupon] = useState(null);

//     // 當組件加載後，從 localStorage 獲取 couponId 並根據它獲取優惠券數據
//     useEffect(() => {
//         const couponId = localStorage.getItem('couponId'); // 從 localStorage 獲取 couponId
//         if (couponId) {
//           fetch(`http://localhost:3005/api/coupons/${couponId}`)
//             .then(response => response.json())
//             .then(data => setCoupon(data))
//             .catch(err => console.error('獲取優惠券數據失敗:', err));
//         }
//       }, []);

//     // 處理輸入框的變更
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setCoupon((prevCoupon) => ({
//             ...prevCoupon,
//             [name]: value, // 更新 coupon 對象中的對應字段
//         }));
//     };

//     // 處理表單提交
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // 提交表單數據到後端
//         console.log('更新後的優惠券:', coupon);
//         // 這裡你可以執行 API 請求，將數據提交給後端：
//         // fetch(`http://localhost:3005/api/coupons/${coupon.id}`, {
//         //   method: 'PUT',
//         //   body: JSON.stringify(coupon),
//         //   headers: { 'Content-Type': 'application/json' },
//         // })
//         //   .then(response => response.json())
//         //   .then(updatedCoupon => {
//         //     setCoupon(updatedCoupon); // 用後端返回的數據更新狀態
//         //     alert('優惠券更新成功！');
//         //   })
//         //   .catch(err => console.error('更新優惠券失敗:', err));
//     };

//     if (!coupon) {
//         return <div>加載中...</div>;
//     }

//     return (
//         <>
//             <AdminSection titleCN="修改優惠券">
//                 <form onSubmit={handleSubmit}>
//                     <div className={`${styles["msg-group"]} d-flex flex-column align-items-center`}>
//                         <div className={`${styles["msg-title"]} h5 my-4`}>基本資料</div>

//                         <div className="d-flex flex-column align-items-end">
//                             <div className={`${styles["input-gp"]} d-flex justify-content-between align-self-stretch align-items-center`}>
//                                 <div className={styles.name}>品牌</div>
//                                 <select
//                                     className={`form-select ${styles.select}`}
//                                     aria-label="品牌選擇"
//                                     name="brand_id"
//                                     value={coupon.brand_id || ''}
//                                     onChange={handleInputChange}
//                                 >
//                                     <option value="1">BOBBI BROWN</option>
//                                     <option value="2">ESTEE LAUDER</option>
//                                     <option value="3">LANCOME</option>
//                                     <option value="4">NARS</option>
//                                     <option value="5">YSL</option>
//                                 </select>
//                             </div>

//                             <div className={`${styles["input-gp"]} d-flex justify-content-between align-self-stretch align-items-center`}>
//                                 <div className={styles.name}>優惠券名稱</div>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={coupon.name}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>

//                             <div className={`${styles["input-gp"]} d-flex justify-content-between align-self-stretch align-items-center`}>
//                                 <div className={styles.name}>優惠代碼</div>
//                                 <div className="d-flex flex-column">
//                                     <div className={`d-flex ${styles.dscode}`}>
//                                         <input
//                                             type="text"
//                                             name="code"
//                                             value={coupon.code}
//                                             onChange={handleInputChange}
//                                         />
//                                     </div>
//                                     <div className={styles.ps}>請輸入A-Z、a-z、0-9，最多輸入8個字元。</div>
//                                 </div>
//                             </div>

//                             <div className={`${styles["input-gp"]} d-flex justify-content-between align-self-stretch align-items-center`}>
//                                 <div className={styles.name}>可使用期限</div>
//                                 <div className={`${styles.exdate} d-flex align-items-center justify-content-between`}>
//                                     <input
//                                         type="date"
//                                         name="start_date"
//                                         value={coupon.start_date || ''}
//                                         onChange={handleInputChange}
//                                     />
//                                     <div className={styles.line}></div>
//                                     <input
//                                         type="date"
//                                         name="end_date"
//                                         value={coupon.end_date || ''}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>
//                             </div>

//                             <div className={`${styles['input-gp']} d-flex justify-content-between align-self-stretch align-items-center`}>
//                                 <div className={styles.name}>活動類型 | 折扣額度限制</div>
//                                 <div className={`input-group d-flex ${styles.discount}`}>
//                                     <select
//                                         className={`form-select ${styles['btn-dp']}`}
//                                         name="type_id"
//                                         value={coupon.type_id}
//                                         onChange={handleInputChange}
//                                     >
//                                         <option value={2}>折扣金額</option>
//                                         <option value={1}>折扣折數</option>
//                                     </select>
//                                     <input
//                                         type="number"
//                                         name="discount_value"
//                                         className={`form-control ${styles.number}`}
//                                         value={coupon.discount_value}
//                                         onChange={handleInputChange}
//                                         placeholder={coupon.type_id === 1 ? "請輸入折扣比例 (0 - 1)" : "請輸入折扣金額"}
//                                     />
//                                 </div>
//                             </div>

//                             <div className={`${styles["input-gp"]} d-flex justify-content-between align-self-stretch align-items-center`}>
//                                 <div className={styles.name}>最低消費額度</div>
//                                 <input
//                                     type="text"
//                                     name="min_purchase"
//                                     value={coupon.min_purchase || ''}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>

//                             <div className={`${styles["input-gp"]} d-flex justify-content-between align-self-stretch align-items-center`}>
//                                 <div className={styles.name}>可使用數量</div>
//                                 <input
//                                     type="text"
//                                     name="quantity"
//                                     value={coupon.quantity || ''}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>

//                             <hr className="align-self-stretch" />
//                         </div>

//                         <div className={`${styles["btn-gp"]} d-flex`}>
//                             <button className={`h6 btn-secondary me-5 ${styles.btn}`} type="submit">
//                                 儲存編輯
//                             </button>
//                             <Link href="/admin/coupon/delete" passHref>
//                                 <button className={`h6 btn-danger ${styles.danger}`}>
//                                     刪除
//                                 </button>
//                             </Link>
//                         </div>
//                     </div>
//                 </form>
//             </AdminSection>
//         </>
//     );
// }


import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import AdminSection from '@/components/admin/common/admin-section';
import Link from 'next/link';

export default function Index() {
    const [coupon, setCoupon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 當組件加載後，從 localStorage 獲取 couponId 並根據它獲取優惠券數據
    useEffect(() => {
        const couponId = localStorage.getItem('couponId'); // 從 localStorage 獲取 couponId
        if (couponId) {
            fetch(`http://localhost:3005/api/coupons/${couponId}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Fetched coupon data:", data); // 打印返回的数据
                    setCoupon(data[0]);
                    setLoading(false); // 加載完成
                })
                .catch(err => {
                    console.error('獲取優惠券數據失敗:', err);
                    setError('無法獲取優惠券數據');
                    setLoading(false); // 即使有錯誤也要停止加載
                });
        } else {
            setError('找不到優惠券ID');
            setLoading(false);
        }
    }, []);

    // 處理輸入框的變更
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCoupon((prevCoupon) => ({
            ...prevCoupon,
            [name]: value, // 更新 coupon 對象中的對應字段
        }));
    };

    // 處理表單提交
    const handleSubmit = (e) => {
        e.preventDefault();
        // 提交表單數據到後端
        fetch(`http://localhost:3005/api/coupons/${coupon.id}`, {
            method: 'PUT',
            body: JSON.stringify(coupon),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json(),)
            .then(updatedCoupon => {
                setCoupon(updatedCoupon); // 更新为后端返回的数据
                alert('優惠券更新成功！');

                router.push('/admin/coupon');  // 提交後跳轉到優惠券列表頁
            })
            .catch(err => {
                console.error('更新優惠券失敗:', err);
                alert('更新優惠券時發生錯誤');
            });
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
                        <div className={`${styles["input-gp"]} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>可使用數量</div>
                            <input
                                type="text"
                                name="maximum"
                                value={coupon.maximum}
                                onChange={handleInputChange}
                            />
                        </div>

                        <hr className="align-self-stretch" />
                    </div>

                    <div className={`${styles["btn-gp"]} d-flex`}>
                        <Link href="/admin/coupon/delete" passHref>
                            <button className={`h6 btn-danger me-5  ${styles.danger}`}>
                                刪除
                            </button>
                        </Link>
                        
                        <button className={`h6 btn-secondary ${styles.btn}`} type="submit">
                            儲存編輯
                        </button>
                    </div>
                </div>
            </form>
        </AdminSection>
    );
}