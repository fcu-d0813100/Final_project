import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import Item from '@/components/order-list/common/item';
import Workshop from '@/components/order-list/common/workshop';
import Link from 'next/link';

export default function Order({ orderId, orderDate, totalAmount, status="已完成", items = [] }) {
    return (
        <div className={`${styles.order} d-flex flex-column border rounded-top my-2`}>
            <Link className={`text-decoration-none ${styles.link}`} href={`/order-list/${orderId}`} passHref>
                <div className="content ps-3 pt-3 pe-3 pb-1">
                    <div className="header d-flex justify-content-between border-bottom pb-1 mb-2">
                        <div className="d-flex">
                            <div className={`p order-number me-5`}>訂單編號：{orderId}</div>
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
                                    subTotal={item.price*item.quantity}
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
                <div className="button-group d-flex justify-content-end p-2 text-center">
                    <Link className='text-decoration-none' href="/product" passHref>
                        <div className={`${styles.btn} btn-primary h6 me-3`}>再買一次</div>
                    </Link>
                    <Link className='text-decoration-none' href="/user/order/comment" passHref>
                        <div className={`${styles.btn} btn-primary h6`}>評論</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
