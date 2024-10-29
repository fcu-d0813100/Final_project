import React from 'react'
import style from './checkout-box.module.scss'
export default function CheckoutBox({ pTotal, wTotal }) {
  return (
    <>
      {/* 優惠券 */}
      <div className={style['checkout_discount']}>
        <span>優惠券</span>
        <span className="ps">輸入享有折扣 &gt;</span>
      </div>

      {/* 總計盒子 */}
      <div className={style['checkout_total']}>
        <div className={style['checkout_total_box']}>
          <div className="text-end pb-1">
            <span>小計</span>
          </div>
          <div className={style.item}>
            <span>彩妝商品</span>
            <span>NT${pTotal}</span>
          </div>
          <div className={style.item}>
            <span>課程商品</span>
            <span>NT${wTotal}</span>
          </div>
          <div className={`${style.item} ${style['discount_item']}`}>
            <span>全站9折</span>
            <span>-NT$100</span>
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
