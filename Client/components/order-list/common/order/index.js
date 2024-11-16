import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import Item from '@/components/order-list/common/item-discount';
import Workshop from '@/components/order-list/common/workshop';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Order({ orderId, order_number, orderDate, totalAmount, status = "已完成", items = [] }) {
    const router = useRouter(); // 初始化 router

    const handleClick = () => {
        // 存儲 orderId 到 localStorage
        localStorage.setItem('orderId', orderId);
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
                    id:item.wid,
                    typeId: item.type_id,
                    imageSrc: `${item.img_cover}`, // 工作坊圖片路徑
                    name: item.type, // 工作坊類型名稱
                    beginTime: item.registration_start,
                    endTime:item.registration_end,
                    qty: item.quantity,
                    price: item.workshop_price,
                });
            }
        });
    
        // 將普通商品資料存到 localStorage
        if (productCartItems.length > 0) {
            localStorage.setItem('productCart', JSON.stringify(productCartItems));
        }
    
        // 將工作坊商品資料存到 localStorage
        if (WorkshopCartItems.length > 0) {
            localStorage.setItem('Workshopcart', JSON.stringify(WorkshopCartItems));
        }
    
        
        router.push('/cart');
    };
    
    return (
        <div className={`${styles.order} d-flex flex-column border rounded-top my-2`}>
            <Link className={`text-decoration-none ${styles.link}`} href="/user/order/detail" passHref onClick={handleClick}>
                <div className={styles.content}>
                    <div className="header d-flex justify-content-between border-bottom pb-1 mb-2">
                        <div className="d-flex">
                            <div className={`p order-number me-5`}>訂單編號：{order_number}</div>
                            {/* <div className={`p ${styles["order-date"]}`}>訂單日期：{new Date(orderDate).toLocaleDateString()}</div> */}
                        </div>
                        <div className={`p ${styles["order-status"]}`}>{status}</div>
                    </div>

                    {items.length > 0 && items.map((item, index) => (
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
                                    dateRange={`${item.registration_start} - ${item.registration_end}`}
                                    price={new Intl.NumberFormat().format(item.workshop_price)}
                                    quantity={item.quantity}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </Link>

            <div className={`${styles.footer} d-flex flex-column justify-content-end align-items-end border-top p-2`}>
                <div className={`total p-2`}>
                    訂單金額：<span className="h4">NT$ {new Intl.NumberFormat().format(totalAmount)}</span>
                </div>
                <div className="botton-group d-flex justify-content-end p-2">
                    <div className="btn btn-primary align-content-center h6 me-3" onClick={handleBuyAgain}>
                        再買一次
                    </div>
                    <div className="btn btn-primary align-content-center h6">評論</div>
                </div>
            </div>
        </div>
    );
}