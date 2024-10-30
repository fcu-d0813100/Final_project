import React from 'react';
import styles from './index.module.scss'; // 確保引入正確的樣式
import Item from '@/components/order-list/common/item';
import ItemDiscount from '@/components/order-list/common/item-discount';
import Workshop from '@/components/order-list/common/workshop';

export default function Order({
    orderId = "123456",
    orderDate = "2024/9/9",
    totalAmount = 1200,
    status = "已完成" }) {
    return (
        <>
            <div className={`${styles.order} d-flex flex-column border rounded-top mb-2`}>
                <div className="content ps-3 pt-3 pe-3 pb-1">
                    <div className="header d-flex justify-content-between border-bottom pb-1 mb-2">
                        <div className="d-flex">
                            <div className={`p order-number me-5`}>訂單編號：{orderId}</div>
                            <div className={`p order-date`}>訂單日期：{orderDate}</div>
                        </div>
                        <div className={`p ${styles["order-status"]}`}>{status}</div>
                    </div>
                </div>

                <Item
                    imageSrc="/order-list/194251136950_1.jpg"
                    brand="LANCOME"
                    productName="玲瓏巧思五色眼影盤"
                    color="來杯摩卡01"
                    quantity={1}
                    subTotal={1200}
                />

                <ItemDiscount
                    imageSrc="/order-list/194251136950_1.jpg"
                    brand="LANCOME"
                    name="玲瓏巧思五色眼影盤"
                    color="來杯摩卡01"
                    quantity={1}
                    originalPrice={1200}
                    discountedPrice={1200}
                />

                <Workshop
                    imageSrc="/order-list/workshop.svg"
                    title="A07 基礎修容班"
                    instructor="Terry Barber 老師"
                    dateRange="2024/09/30 - 2024/10/30"
                    price={3200}
                />

                <div className={`${styles.footer} d-flex flex-column justify-content-end align-items-end border-top p-2`}>
                    <div className={`total ${styles.p} p-2`}>
                        訂單金額：<span className="h4">NT$ {totalAmount}</span>
                    </div>
                    <div className="button-group d-flex justify-content-end p-2 text-center">
                        <div className={`${styles.btn} btn-primary h6 me-3`}>再買一次</div>
                        <div className={`${styles.btn} btn-primary h6`}>評論</div>
                    </div>
                </div>
            </div>
        </>
    );
}