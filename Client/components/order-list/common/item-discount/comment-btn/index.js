import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './index.module.scss'; // 確保引入正確的樣式
import Link from 'next/link';

export default function ItemDiscount({
    productId,
    colorId,
    imageSrc = "",
    brand = "",
    productName = "",
    color = "",
    color_name = "",
    quantity = 0,
    originalPrice,
    discountedPrice = 0,
}) {
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        // 從 localStorage 獲取 orderId
        const storedOrderId = localStorage.getItem('orderId');
        if (storedOrderId) {
            setOrderId(storedOrderId);
        }
    }, []);

    return (
        <div className={`${styles.item} d-flex justify-content-between align-items-center mb-2`}>
            <div className={`${styles['item-left']} d-flex justify-content-between align-items-center`}>
                <div className={`${styles['item-img']} ratio ratio-4x3`}>
                    <Image
                        src={imageSrc}
                        alt={`${brand} ${productName}`}
                        width={160}
                        height={160}
                    />
                </div>
                <div className={`${styles['text-group']} d-flex flex-column align-items-start`}>
                    <div className={`p mb-2 ${styles.brand}`}>{brand}</div>
                    <div className={`${styles['item-name']} h6 mb-1`}>{productName}</div>
                    <div className={`${styles['color-group']} d-flex align-items-center`}>
                        <div className={`${styles['color-left']} d-flex justify-content-center align-items-center me-2`} >
                            <div className={styles.color}
                                style={{ backgroundColor: color, border: `2px solid ${color}` }}></div>
                        </div>
                        <div className={`${styles['color-right']} ${styles.ps}`}>顏色：{color_name}</div>
                    </div>
                </div>
            </div>
            <div className={`${styles.count} text-center h6`}>x{quantity}</div>
            <div className={`${styles['sub-total']} text-end h6`}>
                <del className={`p ${styles.del}`}>NT$ {originalPrice}
                </del> NT$ {discountedPrice}

                <Link
                    className={styles.link}
                    href={{
                        pathname: '/user/order/detail/comment',
                        query: {
                            orderId: orderId,
                            productName: productName,
                            color: color,
                            brand: brand,
                            imageSrc: imageSrc,
                            productId: productId,
                            colorId: colorId,
                            color_name: color_name,
                            quantity: quantity
                        }
                    }}
                >
                    <button className={`${styles.btn} p mt-2`}>評論</button>
                </Link>
            </div>
        </div>
    );
}
