import React from 'react'
import style from './checkout-box.module.scss'
import DiscountBox from '../discountbox'
import { useCartProduct } from '@/hooks/use-cartP'
import { useCartWorkshop } from '@/hooks/use-cartW'

export default function CheckoutBox() {
  // 從use-cartP鉤子取得商品內容
  const { pTotalPrice = 0, pTotalQty = 0 } = useCartProduct()
  //從use-cartＷ鉤子取得課程內容
  const { wTotalPrice = 0, wTotalQty = 0 } = useCartWorkshop()
  // 計算打折後的總和
  const totalDiscountPrice = pTotalPrice + wTotalPrice * 0.8
  //計算總和
  const totalPrice = pTotalPrice + wTotalPrice * 0.8

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
            <span>NT${pTotalPrice.toLocaleString()}</span>
          </div>
          <div className={style.item}>
            <span>課程商品</span>
            <span>NT${(wTotalPrice * 0.8).toLocaleString()}</span>
          </div>
          <div className={`${style.item} ${style['discount_item']}`}>
            <span>全站8折</span>
            <span>
              -NT$
              {(
                pTotalPrice +
                wTotalPrice -
                totalDiscountPrice
              ).toLocaleString()}
            </span>
          </div>
          <div className={`${style.item} ${style['discount_item']}`}>
            <span>Nars全館20%off</span>
            <span>-NT$300</span>
          </div>
        </div>
        <div className={style.total}>
          總計：<span>NT${totalPrice.toLocaleString()}</span>
        </div>
      </div>
    </>
  )
}
