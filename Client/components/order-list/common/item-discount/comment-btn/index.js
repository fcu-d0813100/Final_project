import React from 'react';
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
    discountedPrice = 0
}) {
    // const handleEditClick = (event, productId, colorId, mainimage, name, productName, color_name, color) => {
    //     // 阻止 Link 的預設行為，這樣可以先執行 handleEditClick，再進行頁面跳轉
    //     event.preventDefault();

    //     // 儲存資料到 localStorage
    //     const productData = {
    //         productId: productId,
    //         colorId: colorId,
    //         mainimage: mainimage,
    //         brand: name,
    //         product_name: productName,
    //         color_name: color_name,
    //         color: color
    //     };
    //     localStorage.setItem('productData', JSON.stringify(productData));
    //     window.location.href = `/user/order/detail/comment`;
    // };


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
            <div className={`${styles.count} text-center`}>x{quantity}</div>
            <div className={`${styles['sub-total']} text-end h6`}>
                <del className={`p ${styles.del}`}>NT$ {originalPrice}
                </del> NT$ {discountedPrice}


                <button className={`${styles.btn} p mt-2`} onClick={(event) => handleEditClick(event, productId, colorId, imageSrc, brand, productName, color_name, color)}>評論</button>
            </div>
        </div>
    );
}
