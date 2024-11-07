import React from 'react';
import styles from './index.module.scss'; // 確保引入正確的樣式
import DiscountComment from '@/components/order-list/common/item-discount/comment-btn';
import ItemComment from '@/components/order-list/common/item/comment-btn';
import Workshop from '@/components/order-list/common/workshop';

const OrderDetail = ({
    orderId = "202409105743",
    paymentMethod = "貨到付款",
    shippingMethod = "宅配",
    recipient = {
        name: "王美美",
        phone: "09123456789",
        address: "台北市信義區市府路1號",
    },
    status = "待評價",
    subtotal = 2400,
    shippingFee = 80,
    shippingDiscount = 80,
    couponDiscount = 100,
    total = 1200
}) => {

    return (
        <>
            <div className={styles.right}>
                <div className={styles.nav}>
                    <a className="text-decoration-none" href="">訂單查詢</a> / 訂單詳情
                </div>
                <div className={`${styles.title} d-flex justify-content-start align-items-center mb-3`}>
                    <div className={`${styles["title-left"]} h3 p-2`}>訂單查詢</div>
                </div>

                <div className={`${styles["order-det-header"]} d-flex justify-content-between align-items-center mb-2`}>
                    <div className="header-left d-flex align-items-center">
                        <div className={`${styles.squ} me-3`}></div>
                        <div className={`${styles["order-num"]} h4`}>訂單編號 {orderId}</div>
                    </div>
                    <div className={`${styles["header-right"]} p`}>
                        {status}
                    </div>
                </div>

                <div className={`${styles["order-det-content"]} d-flex flex-column border rounded-top`}>
                    <div className={`${styles.msg} d-flex justify-content-between align-items-center`}>
                        <div className={styles["msg-left"]}>
                            <div className={`${styles["left-title"]} h4 mb-3`}>訂單資訊</div>
                            <div className={`${styles.detail} h6 ms-3`}>
                                <div className="num">訂單編號：{orderId}</div>
                                <div className="pay">付款方式：{paymentMethod}</div>
                                <div className="tra">運送方式：{shippingMethod}</div>
                            </div>
                        </div>
                        <div className={styles.line}></div>
                        <div className={styles["msg-right"]}>
                            <div className={`${styles["right-title"]} h4 mb-3`}>收件資訊</div>
                            <div className={`${styles.detail} h6 ms-3`}>
                                <div className="name">{recipient.name}</div>
                                <div className="phone">{recipient.phone}</div>
                                <div className="adress">{recipient.address}</div>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.content} ps-5 pt-5 pe-5`}>
                        <div className={`${styles.header} h4 border-bottom p-2 mb-2`}>購買商品</div>
                        <DiscountComment
                            imageSrc="/order-list/194251136950_1.jpg"
                            brand="LANCOME"
                            name="玲瓏巧思五色眼影盤"
                            color="來杯摩卡01"
                            quantity={10}
                            originalPrice={200}
                            discountedPrice={400}
                        />
                        <ItemComment
                            imageSrc="/order-list/194251136950_1.jpg"
                        brand="LANCOME"
                        productName="玲瓏巧思五色眼影盤"
                        color="來杯摩卡01"
                        quantity={18}
                        subTotal={500}
                        />
                        <Workshop
                            imageSrc="/order-list/workshop.svg"
                            title="A07 基礎修容班"
                            instructor="Terry Barber 老師"
                            dateRange="2024/09/30 - 2024/10/30"
                            price={4000}
                        />
                    </div>

                    <div className={`${styles.footer} d-flex flex-column justify-content-end align-items-end border-top p-2`}>
                        <div className={styles["total-text-group"]}>
                            <div className={`total h6 p-1`}>
                                商品小計<span>${subtotal}</span>
                            </div>
                            <div className={`total h6 p-1`}>
                                運費<span>${shippingFee}</span>
                            </div>
                            <div className={`total h6 p-1`}>
                                運費折扣<span>-${shippingDiscount}</span>
                            </div>
                            <div className={`total h6 p-1`}>
                                優惠券<span>-${couponDiscount}</span>
                            </div>
                            <div className={`${styles.total} h6 p-1 border-top border-black`}>
                                訂單金額<span className="h4">NT$ {total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetail;
