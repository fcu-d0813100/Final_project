import React, { useEffect, useState } from 'react';
import styles from './index.module.scss'; // 頁面樣式
import Item from '@/components/order-list/common/item-discount/comment-btn';
import Workshop from '@/components/order-list/common/workshop';
import OrderSection from '@/components/user/common/user-section';

const OrderDetail = () => {
    const [orderData, setOrderData] = useState(null); // 用來存儲訂單資料
    const [loading, setLoading] = useState(true); // 載入狀態


    useEffect(() => {
        const orderId = localStorage.getItem('orderId'); // 從 localStorage 取得 orderId
        if (!orderId) return;

        // 獲取訂單詳細資料
        const fetchOrderDetail = async () => {
            try {
                const response = await fetch(`http://localhost:3005/api/order/detail/${orderId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`錯誤: ${response.statusText}`);
                }
                const data = await response.json();
                const Data = data[0];
                // 檢查 items 是否存在且為有效的 JSON 字串
                let parsedItems = [];
                if (Data.items && typeof Data.items === 'string') {
                    try {
                        parsedItems = JSON.parse(Data.items); // 解析 items 字串
                    } catch (error) {
                        console.error("解析 items 發生錯誤：", error);
                    }
                }

                const processedData = {
                    ...Data,
                    items: Array.isArray(parsedItems) ? parsedItems : [], // 確保 items 是有效的陣列
                };

                setOrderData(processedData);
                // console.log(processedData);
            } catch (error) {
                console.error("獲取訂單詳細資料時發生錯誤：", error);
            } finally {
                setLoading(false); // 請求完成後關閉載入狀態
            }
        };

        fetchOrderDetail(); // 發送請求
    }, []); // 只在元件首次渲染時執行

    if (loading) {
        return <div>載入中...</div>; // 載入狀態
    }

    if (!orderData) {
        return <div>無法取得訂單詳細資料</div>; // 如果無法取得資料，顯示錯誤訊息
    }

    const { items, order_number, payment, shipping, shipping_address, name, phone, total_amount, discount_value, status } = orderData;

    return (
        <OrderSection titleCN="訂單詳情">
            <div className={`${styles["order-det-header"]} mt-3 justify-content-between align-items-center mb-2`}>
                <div className={`header-left d-flex align-items-center`}>
                    <div className={`${styles.squ} me-3`}></div>
                    <div className={`${styles["order-num"]}`}>訂單編號 {order_number}</div>
                </div>
                <div className={`${styles["header-right"]} p`}>
                    {status === "已付款" ? "已完成" : "未付款"}
                </div>
            </div>

            <div className={`${styles["order-det-content"]} d-flex flex-column border rounded-top`}>
                <div className={`h5 ${styles.topTitle}`}>
                    訂單{status === "已付款" ? "已完成" : "未付款"}
                </div>
                {/* 訂單信息和收件信息 */}
                <div className={`${styles.msg} d-flex justify-content-around`}>
                    <div className={styles["msg-left"]}>
                        <div className={`${styles["left-title"]} h4 `}>訂單資訊</div>
                        <div className={`${styles.detail} h6 ms-3`}>
                            <div>訂單編號：{order_number}</div>
                            <div>付款方式：{payment}</div>
                            <div>運送方式：{shipping}</div>
                        </div>
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles["msg-right"]}>
                        <div className={`${styles["right-title"]} h4 `}>收件資訊</div>
                        <div className={`${styles.detail} h6 ms-3`}>
                            <div className="name">{name}</div>
                            <div className="phone">{phone}</div>
                            <div className="address">{shipping_address}</div>
                        </div>
                    </div>
                </div>

                {/* 渲染商品列表 */}
                <div className={`${styles.content} `}>
                    <div className={`${styles.header} h4 border-bottom p-2 mb-2`}>購買商品</div>
                    {items.length > 0 ? (
                        items.map((item, index) => (
                            <div key={item.id || index}>
                                {/* 顯示商品資料 */}
                                {item.product_id && (
                                    <Item
                                        imageSrc={`/product/mainimage/${item.mainimage}`}
                                        brand={item.name}
                                        productName={item.product_name}
                                        color={item.color}
                                        color_name={item.color_name}
                                        quantity={item.quantity}
                                        originalPrice={item.originalprice}
                                        discountedPrice={new Intl.NumberFormat().format(item.price)}
                                        productId={item.product_id}
                                        colorId={item.color_id}
                                    />
                                )}
                                {/* 顯示工作坊資料 */}
                                {item.wid && (
                                    <Workshop
                                        key={item.wid}
                                        imageSrc={`http://localhost:3005/workshop/${item.img_cover}`}
                                        title={item.type}
                                        instructor={item.teachers_name}
                                        date={`${item.ws_date}`}
                                        time={`${item.start_time} - ${item.end_time}`}
                                        price={new Intl.NumberFormat().format(item.workshop_price)}
                                        dsPrice={new Intl.NumberFormat().format(item.workshop_price * 0.95)}
                                        quantity={item.quantity}
                                    />
                                )}
                            </div>
                        ))
                    ) : (
                        <div>無商品資料</div> // 如果 items 為空，顯示提示訊息
                    )}
                </div>

                <div className={`${styles.footer} d-flex flex-column justify-content-end align-items-end border-top p-2`}>
                    <div className={styles["total-text-group"]}>
                        <div className={`total h6 p-1`}>
                            商品小計<span>$  {new Intl.NumberFormat().format(
                                items.reduce((total, item) => {
                                    const originalprice = item.originalprice || 0;
                                    const quantity = item.quantity || 0;
                                    const workshopPrice = item.workshop_price || 0;

                                    if (item.product_id) {
                                        return total + (originalprice * quantity);
                                    }

                                    if (item.wt_id) {
                                        return total + (workshopPrice * quantity);
                                    }
                                    console.log(total)
                                    return total;
                                }, 0)
                            )}</span>
                        </div>
                        <div className={`total h6 p-1`}>
                            商品折扣<span>-$  {new Intl.NumberFormat().format(
                                items.reduce((total, item) => {
                                    // 確認 price, originalprice, quantity 是否為有效的數字
                                    const originalPrice = item.originalprice || 0;  // 如果原價無效，視為0
                                    const price = item.price || 0;  // 如果價格無效，視為0
                                    const quantity = item.quantity || 0;  // 如果數量無效，視為0
                                    const workshopPrice = item.workshop_price || 0;

                                    // 如果有 product_id，計算小計
                                    if (item.product_id != null) {
                                        const subtotal = (originalPrice - price) * quantity; // 計算每個商品的小計
                                        return total + subtotal; // 累加到總金額
                                    }
                                    // 如果有 wt_id，計算小計
                                    if (item.wt_id != null) {
                                        const subtotal = (workshopPrice - (workshopPrice * 0.95)) * quantity; // 計算每個商品的小計
                                        return total + subtotal; // 累加到總金額
                                    }
                                    return total;
                                }, 0) // 初始值為 0
                            )}</span>
                        </div>
                        {discount_value !== null && (
                            <div className="total h6 p-1">
                                {discount_value > 1 ? (
                                    // 當 discount_value 大於 1 時顯示優惠券金額
                                    <>
                                        優惠券<span>-${discount_value}</span>
                                    </>
                                ) : (
                                    // 當 discount_value 小於等於 1 時顯示計算後的金額
                                    <>
                                        優惠券
                                        <span>-$
                                            {new Intl.NumberFormat().format(
                                                items.reduce((total, item) => {
                                                    // 防呆處理，確保 price, quantity 和 workshop_price 為有效的數字
                                                    const price = item.price || 0;  // 如果 price 是無效的，視為 0
                                                    const quantity = item.quantity || 0;  // 如果 quantity 是無效的，視為 0
                                                    const workshopPrice = item.workshop_price || 0;  // 如果 workshop_price 是無效的，視為 0

                                                    // 計算商品小計
                                                    if (item.product_id) {
                                                        return total + (price * quantity);  // 計算商品小計
                                                    }

                                                    // 計算工作坊價格
                                                    if (item.wt_id) {
                                                        return total + (workshopPrice * quantity * 0.95);  // 計算工作坊小計
                                                    }

                                                    return total;
                                                }, 0) - total_amount // 計算總金額後減去 total_amount
                                            )}
                                        </span>
                                    </>
                                )}
                            </div>
                        )}
                        <div className={`${styles.total} h6 p-1 border-top border-black`}>
                            訂單金額<span className="h4">NT$ {new Intl.NumberFormat().format(total_amount)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </OrderSection>
    );
};

export default OrderDetail
