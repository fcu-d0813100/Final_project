import React from 'react';
import Image from 'next/image';
import styles from './index.module.scss'; // 確保引入正確的樣式

export default function ItemDiscount({ 
    imageSrc="" ,
    brand="" ,
    productName="" ,
    color="", 
    quantity,
    originalPrice,
    discountedPrice,
    productId, 
    colorId     
}) {
     console.log("imageSrc:", imageSrc);
     console.log("brand:", brand);
     console.log("productName:", productName);
     console.log("color:", color);
     console.log("quantity:", quantity);
     console.log("originalPrice:", originalPrice);
     console.log("discountedPrice:", discountedPrice);
     console.log("productId:", productId);
     console.log("colorId:", colorId);

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
                    <div className={`${styles.brand} mb-2 p`}>{brand}</div>
                    <div className={`${styles['item-name']} h6 mb-1`}>{productName}</div>
                    <div className={`${styles['color-group']} d-flex align-items-center`}>
                        {/* <div className={`${styles['color-left']} d-flex justify-content-center align-items-center me-2`}>
                            <div className={styles.color}></div>
                        </div> */}
                        <div className={`${styles['color-right']} ps`}>顏色：{color}</div>
                    </div>
                </div>
            </div>
            <div className={`${styles.count} text-center`}>x{quantity}</div>
            <div className={`${styles['sub-total']} text-end h6`}>
                <del className={`p ${styles.del}`}>NT$ {originalPrice}
                </del> NT$ {discountedPrice}
                {/* <Link href={`/user/order/detail/comment?productId=${productId}&colorId=${colorId}`}><button className={`${styles.btn} p mt-2`}>評論</button></Link> */}
                <Link href={{
                    pathname: '/user/order/detail/comment',
                    query: {
                        productId: productId,  
                        colorId: colorId,      
                        productName: productName,
                        brand: brand,
                        color: color,
                        imageSrc: imageSrc
                    }
                }}>
                <button className={`${styles.btn} p mt-2`}>評論</button>
                </Link>
            </div>
        </div>
    );
}
