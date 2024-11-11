import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import Item from '@/components/order-list/common/item';
import Workshop from '@/components/order-list/common/workshop';
import Link from 'next/link';

export default function Order({ orderId, order_number, orderDate, totalAmount, status = "已完成", items = [] }) {

    const handleClick = () => {
        // 存储 orderId 到 localStorage
        localStorage.setItem('orderId', orderId);
    };

    return (
        <div className={`${styles.order} d-flex flex-column border rounded-top my-2`}>
            <Link className={`text-decoration-none ${styles.link}`} href="/user/order/detail" passHref onClick={handleClick}>
                <div className="content ps-3 pt-3 pe-3 pb-1">
                    <div className="header d-flex justify-content-between border-bottom pb-1 mb-2">
                        <div className="d-flex">
                            <div className={`p order-number me-5`}>訂單編號：{order_number}</div>
                            <div className={`p ${styles["order-date"]}`}>訂單日期：{new Date(orderDate).toLocaleDateString()}</div>
                        </div>
                        <div className={`p ${styles["order-status"]}`}>{status}</div>
                    </div>

                    {items.length > 0 && items.map((item, index) => (
                        <div key={item.id || index}>
                            {item.product_id && (
                                <Item
                                    imageSrc={`/product/${item.mainimage}`}
                                    brand={item.name}
                                    productName={item.product_name}
                                    color={item.color}
                                    quantity={item.quantity}
                                    subTotal={item.price * item.quantity}
                                />
                            )}
                            {item.wid && (
                                <Workshop
                                    key={item.wid}
                                    imageSrc={`/workshop/`}
                                    title={item.type}
                                    instructor={item.teachers_name}
                                    dateRange={`${item.registration_start} - ${item.registration_end}`}
                                    price={item.workshop_price}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </Link>

            <div className={`${styles.footer} d-flex flex-column justify-content-end align-items-end border-top p-2`}>
                <div className={`total p-2`}>
                    訂單金額：<span className="h4">NT$ {totalAmount}</span>
                </div>
            </div>
        </div>
    );
}
