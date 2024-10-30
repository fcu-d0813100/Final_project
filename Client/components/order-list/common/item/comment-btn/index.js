import React from 'react';
import Image from 'next/image';
import styles from './index.module.scss'; // 確保引入正確的樣式

export default function Item({ 
    imageSrc="/order-list/194251136950_1.jpg",
    brand="LANCOME",
    productName="玲瓏巧思五色眼影盤",
    color="來杯摩卡01",
    quantity=1,
    subTotal=1200
}) {
    return (
        <div className={`${styles.item} d-flex justify-content-between align-items-center mb-2`}>
            <div className={`${styles['item-left']} d-flex justify-content-between align-items-center`}>
                <div className={`${styles['item-img']} ratio ratio-4x3`}>
                    <Image 
                        src={imageSrc} 
                        alt={productName} 
                        width={160} 
                        height={160} 
                    />
                </div>
                <div className={`${styles['text-group']} d-flex flex-column align-items-start`}>
                    <div className={`${styles.p} mb-2`}>{brand}</div>
                    <div className={`${styles['item-name']} ${styles.h6} mb-1`}>{productName}</div>
                    <div className={`${styles['color-group']} d-flex align-items-center`}>
                        <div className={`${styles['color-left']} d-flex justify-content-center align-items-center me-2`}>
                            <div className={styles.color}></div>
                        </div>
                        <div className={`${styles['color-right']} ${styles.ps}`}>顏色：{color}</div>
                    </div>
                </div>
            </div>
            <div className={`${styles.count} text-center`}>x{quantity}</div>
            <div className={`${styles['sub-total']} text-end ${styles.h6}`}>NT$ {subTotal} <button className={`${styles.btn} ${styles.p} mt-2`}>評論</button></div>
        </div>
    );
}
