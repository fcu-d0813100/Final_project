import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import Item from '@/components/order-list/common/item-discount';
import Workshop from '@/components/order-list/common/workshop';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GoChevronDown, GoChevronUp } from "react-icons/go";

export default function Order({ orderId, order_number, totalAmount, status = "已完成", items = [] }) {
    const router = useRouter(); // 初始化 router

    const handleClick = () => {
    // 存儲 orderId 到 localStorage
    localStorage.setItem('orderId', orderId);
    };

    const [showAllItems, setShowAllItems] = useState(false);

    const toggleShowItems = () => {
        setShowAllItems(!showAllItems);
    };

    const handleBuyAgain = () => {
        // 初始化兩個空陣列來分別存放商品與工作坊
        const productCartItems = [];
        const WorkshopCartItems = [];

        // 遍歷所有商品（來自 order 頁面）
        items.forEach(item => {
            if (item.product_id) {
                // 普通商品，加入 productCartItems 陣列
                productCartItems.push({
                    brand: item.name,
                    color: item.color,
                    color_name: item.color_name,
                    mainimage: `${item.mainimage}`,
                    originalprice: item.originalprice,
                    price: item.price,
                    product_name: item.product_name,
                    qty: item.quantity,
                    type: 'product', // 設定商品類型
                    prodect_id: item.product_id // 普通商品的 product_id
                });
            } else if (item.wid) {
                // 工作坊商品，加入 workshopCartItems 陣列
                WorkshopCartItems.push({
                    id: item.wt_id,
                    typeId: item.type_id,
                    cover: `${item.img_cover}`, // 工作坊圖片路徑
                    name: item.type, // 工作坊類型名稱
                    date: item.ws_date.replace(/-/g, '/'),
                    beginTime: item.start_time.split(':').slice(0, 2).join(':'),
                    endTime: item.end_time.split(':').slice(0, 2).join(':'),
                    qty: item.quantity,
                    price: item.workshop_price,
                });
            }
        });

        // 將普通商品資料存到 localStorage
        if (productCartItems.length > 0) {
            localStorage.setItem('productCart', JSON.stringify(productCartItems));
        } else {
            // 如果工作坊陣列為空，可以選擇移除 Workshopcart 的 localStorage 項目
            localStorage.removeItem('productCart');
        }

        // 將工作坊商品資料存到 localStorage
        if (WorkshopCartItems.length > 0) {
            localStorage.setItem('Workshopcart', JSON.stringify(WorkshopCartItems));
        } else {
            // 如果工作坊陣列為空，可以選擇移除 Workshopcart 的 localStorage 項目
            localStorage.removeItem('Workshopcart');
        }

        // router.push('/cart');
        // // 跳轉到 /cart 並強制刷新頁面
        // router.push('/cart').then(() => {
        //     // 使用 window.location.reload() 強制重新整理頁面
        //     window.location.reload()
        // })
        window.location.href = '/cart';
    };

    return (
        <div className={`${styles.order} d-flex flex-column border rounded-top my-2`}>

            <div className={styles.content}>
                <div className="header d-flex justify-content-between border-bottom pb-1 mb-2">
                    <div className="d-flex">
                        <div className={`p order-number me-5`}>訂單編號：{order_number}</div>
                        {/* <div className={`p ${styles["order-date"]}`}>訂單日期：{new Date(orderDate).toLocaleDateString()}</div> */}
                    </div>
                    <div className={`p ${styles["order-status"]}`}>{status}</div>
                </div>


                {items.length > 0 && (
                    <div>

                        {/* 顯示第一個商品 */}
                        <div>
                            <Link className={`text-decoration-none ${styles.link}`} href={`/user/order/detail`} passHref onClick={handleClick}>
                                {/*  */}
                                <div key={items[0].id}>
                                    {items[0].product_id && (
                                        <Item
                                            orderId={orderId}
                                            imageSrc={`/product/mainimage/${items[0].mainimage}`}
                                            brand={items[0].name}
                                            productName={items[0].product_name}
                                            color={items[0].color}
                                            color_name={items[0].color_name}
                                            quantity={items[0].quantity}
                                            originalPrice={items[0].originalprice}
                                            discountedPrice={new Intl.NumberFormat().format(items[0].price)}
                                        />
                                    )}
                                    {items[0].wid && (
                                        <Workshop
                                            key={items[0].wid}
                                            imageSrc={`http://localhost:3005/workshop/${items[0].img_cover}`}
                                            title={items[0].type}
                                            instructor={items[0].teachers_name}
                                            date={`${items[0].ws_date.replace(/-/g, '/')}`}
                                            time={`${items[0].start_time.split(':').slice(0, 2).join(':')} - ${items[0].end_time.split(':').slice(0, 2).join(':')}`}
                                            price={new Intl.NumberFormat().format(items[0].workshop_price)}
                                            dsPrice={new Intl.NumberFormat().format(items[0].workshop_price * 0.95)}
                                            quantity={items[0].quantity}
                                        />
                                    )}
                                </div>

                                {/* 顯示更多商品 */}
                                <div className={`${styles["item-container"]} ${showAllItems ? `${styles.open}` : ''}`}>
                                    {showAllItems && items.slice(1).map((item, index) => (
                                        <div key={item.id || index}>
                                            {item.product_id && (
                                                <Item
                                                    orderId={orderId}
                                                    imageSrc={`/product/mainimage/${item.mainimage}`}
                                                    brand={item.name}
                                                    productName={item.product_name}
                                                    color={item.color}
                                                    color_name={item.color_name}
                                                    quantity={item.quantity}
                                                    originalPrice={item.originalprice}
                                                    discountedPrice={new Intl.NumberFormat().format(item.price)}
                                                />
                                            )}
                                            {item.wid && (
                                                <Workshop
                                                    key={item.wid}
                                                    imageSrc={`http://localhost:3005/workshop/${item.img_cover}`}
                                                    title={item.type}
                                                    instructor={item.teachers_name}
                                                    date={`${item.ws_date.replace(/-/g, '/')}`}
                                                    time={`${item.start_time.split(':').slice(0, 2).join(':')} - ${item.end_time.split(':').slice(0, 2).join(':')}`}
                                                    price={new Intl.NumberFormat().format(item.workshop_price)}
                                                    dsPrice={new Intl.NumberFormat().format(item.workshop_price * 0.95)}
                                                    quantity={item.quantity}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Link>
                        </div>
                        <button onClick={toggleShowItems} className={`btn ${styles.showItem} ps`}>
                            {showAllItems ? <>隱藏其他商品<GoChevronUp /></> : <>檢視其他商品<GoChevronDown /></>}
                        </button>
                    </div>
                )}
            </div>


            <div className={`${styles.footer} d-flex flex-column justify-content-end align-items-end border-top p-2`}>
                <div className={`${styles.total} p-2`}>
                    訂單金額：<span className="h4">NT$ {new Intl.NumberFormat().format(totalAmount)}</span>
                </div>
                <div className="botton-group d-flex justify-content-end p-2 h6">
                    <div className={`${styles.again} btn btn-primary align-content-center`} onClick={handleBuyAgain}>
                        再買一次
                    </div>
                    {/* <div className={`${styles.btn}  btn-primary align-content-center`}>評論</div> */}
                </div>
            </div>
        </div>
    );
}