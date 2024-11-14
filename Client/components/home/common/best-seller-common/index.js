import styles from './index.module.scss'; // 確保引入正確的樣式
import Link from 'next/link';
import Image from 'next/image'
import React, { useState, useEffect } from 'react';


// 經典豆沙紅｜百搭色號 永不出錯
// best-seller.svg
const index = ({
  title = "",
  bgc = "",
  bgimg = "",
  mainimage1 = "",
  brand = "",
  product_name = "",
  mainimage2 = "",

}) => {
  // const [bgColor, setBgColor] = useState(bgc);  // 設定初始背景顏色

  // useEffect(() => {
  //   const handleResize = () => {
  //     // 判斷視窗寬度並更新背景顏色
  //     if (window.innerWidth <= 1480) {
  //       setBgColor('transparent');
  //     } else {
  //       setBgColor(bgc);  // 恢復背景顏色
  //     }
  //   };

  //   handleResize();  // 初始化時檢查一次視窗大小

  //   // 監聽視窗大小變化
  //   window.addEventListener('resize', handleResize);

  //   // 元件卸載時移除事件監聽器
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, [bgc]);  // 當 bgc 改變時重新執行 useEffect
  return (
    <>
      <div>
        <div className={`${styles.bestSeller}`} style={{ backgroundColor: bgc  }}>
          <Image
            src={`/discount/${bgimg}`} // 圖片路徑
            alt="Discount image" // 圖片描述
            width={1800} // 設定圖片的寬度
            height={2021} // 設定圖片的高度
            sizes="(max-width: 600px) 100vw, 600px"  // 自適應大小的設置
            priority={true}  // 添加 priority 屬性以優先加載此圖片
          />
          <div className={`${styles.right}`}>
            <div className={`${styles.textGroup} flex-column`}>
              <div className={`h2-L text-start ${styles.title}`}>Best Seller</div>
              <div className={`${styles.line} items-stretch`}></div>
              <div className={`${styles.subTitle} h5 mt-2`}>{title}</div>
            </div>
            <div className={`${styles.cartGroup}`}>
              <div className={`${styles.cart} ${styles.cart1} flex-column `}>
                <Image
                  src={`product/mainimage/${mainimage1} `}
                  alt='mainimage'
                  width={315}
                  height={315}
                />
                <div className='text-center '>
                  <div className={`${styles.brand} h4 mb-1`}>{brand}</div>

                  <div className={`${styles.productName} h5`}>{product_name}</div>
                </div>
                <Link className='text-decoration-none' href={`/product/product-list?brand=${brand}`}>
                  <div className={`btn btn-danger align-content-center h5 ${styles.preadBtn}`}>查看商品</div>
                </Link>
              </div>

              <div className={`${styles.cart} ${styles.cart2} flex-column align-items-center`}>
                <Image
                  src={`product/mainimage/${mainimage2} `}
                  alt='mainimage'
                  width={315}
                  height={315}

                />
                <div className='text-center '>
                  <div className={`${styles.brand} h4 mb-1`}>{brand}</div>

                  <div className={`${styles.productName} h5`}>{product_name}</div>
                </div>
                <Link className='text-decoration-none' href={`/product/product-list?brand=${brand}`}>
                  <div className={`btn btn-danger align-content-center h5 ${styles.preadBtn}`}>查看商品</div>
                </Link>
              </div>
            </div>
          </div>

        </div>
        <Link className='text-decoration-none' href={`/product/product-list?brand=${brand}`}>
          <div className={`btn btn-danger align-content-center ${styles.readBtn}`}>查看商品</div>
        </Link>
      </div>
    </>
  )
}
export default index;
