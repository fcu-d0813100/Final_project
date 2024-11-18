import React from 'react';
import Image from 'next/image';
import styles from './index.module.scss'; // 確保引入正確的樣式

export default function Workshop({
    imageSrc = "",
    title = "",
    instructor = "",
    date = "",
    time = "",
    quantity = 0,
    price = 0,
    dsPrice = 0

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
                    <div className={`${styles["item-name"]} ps mb-1`}>{instructor}</div>
                    <div className={`h5 mb-2 ${styles.class}`}>{title}</div>
                    <div className={`${styles.time} p`}>
                        {date}<br /><span>{time}</span>
                    </div>
                </div>
            </div>
            <div className={`${styles.count} text-center h6`}>
                X{quantity}
            </div>

            <div className={`${styles["sub-total"]} text-end h6`}><del className={`p ${styles.del}`}>NT$ {price}
            </del>NT$ {dsPrice}</div>
        </div>
    );
}
