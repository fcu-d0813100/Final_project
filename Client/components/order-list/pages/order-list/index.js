import React, { useEffect, useState } from 'react';
import Order from '@/components/order-list/common/order';
import styles from './index.module.scss'; // 確保引入正確的樣式

export default function OrderList() {
    return (
        <>
            <div className="d-flex align-self-stretch">
                <aside className={styles.left}></aside>
                <div className={styles.right}>
                    <div className={`${styles.title} d-flex justify-content-between align-items-center mb-2`}>
                        <div className={`${styles["title-left"]} h3 p-2`}>訂單查詢</div>
                        <div className={`${styles["title-right"]} search p d-flex`}>
                            {/* <input type="search" placeholder="可透過訂單編號或商品名稱搜尋" className="p-2">
                                <a href="" className="ms-2 d-flex align-items-center"><i className="ph ph-magnifying-glass"></i></a> */}
                        </div>
                    </div>

                    <div className={`${styles["order-list"]} d-flex flex-column nb-2`}>
                        <Order 
                        orderId="123456" 
                        orderDate="2024/9/9" 
                        totalAmount={1200} 
                        status="已完成" />

                    </div>
                </div>
            </div>
        </>
    )
}