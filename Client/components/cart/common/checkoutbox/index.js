import React from 'react'
import style from './checkout-box.module.scss'
import DiscountBox from '../discountbox'
import { useCartProduct } from '@/hooks/use-cartP'

export default function CheckoutBox() {
  // 從use-cartP鉤子取得商品內容
  const { pTotalPrice = 0, pTotalQty = 0 } = useCartProduct()

  
  return (
    <>
      {/* 優惠券 */}
      <DiscountBox />

      {/* 總計盒子 */}
      <div className={style['checkout_total']}>
        <div className={style['checkout_total_box']}>
          <div className="text-end pb-1">
            <span>小計</span>
          </div>
          <div className={style.item}>
            <span>彩妝商品</span>
            <span>NT${(pTotalPrice * 0.8).toLocaleString()}</span>
          </div>
          <div className={style.item}>
            <span>課程商品</span>
            <span>NT${}</span>
          </div>
          <div className={`${style.item} ${style['discount_item']}`}>
            <span>全站8折</span>
            <span>-NT${(pTotalPrice - pTotalPrice * 0.8).toLocaleString()}</span>
          </div>
          <div className={`${style.item} ${style['discount_item']}`}>
            <span>Nars全館20%off</span>
            <span>-NT$300</span>
          </div>
        </div>
        <div className={style.total}>
          總計：<span>NT$10,860</span>
        </div>
      </div>
    </>
  )
}
