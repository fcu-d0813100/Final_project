import React from 'react';
import Image from 'next/image';
import styles from './index.module.scss'; // 確保引入正確的樣式

export default function Workshop({ 
    imageSrc = "/order-list/workshop.svg", 
    title = "A07 基礎修容班", 
    instructor = "Terry Barber 老師", 
    dateRange = "2024/09/30 - 2024/10/30", 
    price = 3200 
}) {
    return (
        <div className={`${styles.item} workshop d-flex justify-content-between align-items-center mb-2`}>
            <div className={`${styles["item-left"]} d-flex justify-content-between align-items-center`}>
                <div className={`${styles['item-img']} ratio ratio-4x3`}>
                    <Image 
                        src={imageSrc} 
                        alt={`Workshop: ${title}`} 
                        width={160} 
                        height={160} 
                    />
                </div>
                <div className={`${styles["text-group"]} d-flex flex-column align-items-start`}>
                    <div className={`${styles.h5} mb-2`}>{title}</div>
                    <div className={`${styles["item-name"]} ${styles.ps} mb-1`}>{instructor}</div>
                </div>
            </div>
            <div className={`${styles.count} ${styles.p}`}>
                活動期間<br />{dateRange}
            </div>
            <div className={`${styles["sub-total"]} text-end ${styles.h6}`}>NT$ {price}</div>
        </div>
    );
}
