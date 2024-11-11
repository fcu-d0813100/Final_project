import React, { useState, useEffect } from 'react'
import style from './checkout-box.module.scss'
import DiscountBox from '../discountbox'
import { useCartProduct } from '@/hooks/use-cartP'
import { useCartWorkshop } from '@/hooks/use-cartW'

export default function CheckoutBox() {
  const {
    pTotalPrice = 0,
    pTotalQty = 0,
    pOriginalTotalPrice = 0,
    selectedCoupon,
    onSelectCoupon,
  } = useCartProduct()

  const { wTotalPrice = 0, wTotalQty = 0 } = useCartWorkshop()

  const discountedWTotalPrice = Math.floor(wTotalPrice * 0.95)
  const discountDifference =
    pOriginalTotalPrice - pTotalPrice + (wTotalPrice - discountedWTotalPrice)

  const [discount, setDiscount] = useState(0)
  const [discountName, setDiscountName] = useState('')

  const handleCouponSelect = (selectedCouponObj) => {
    if (selectedCouponObj) {
      setDiscount(selectedCouponObj.discount_value || 0)
      setDiscountName(
        `${selectedCouponObj.brand_name || ''} ${selectedCouponObj.name || ''}`
      )
    } else {
      setDiscount(0)
      setDiscountName('')
    }
  }

  // 使用 useEffect 在選擇優惠券後及時更新
  useEffect(() => {
    const storedCouponData = localStorage.getItem('selectedCouponObj')
    if (storedCouponData) {
      const couponData = JSON.parse(storedCouponData)
      setDiscount(couponData.discount_value || 0)
      setDiscountName(`${couponData.brand_name || ''} ${couponData.name || ''}`)
    }
  }, [selectedCoupon]) // 每當 selectedCoupon 改變時重新運行 useEffect

  //------------最後總額計算
  const finalPrice =
    pOriginalTotalPrice + wTotalPrice - discountDifference - discount

  return (
    <>
      {/* 傳遞 handleCouponSelect 回調給 DiscountBox */}
      <DiscountBox onCouponSelect={handleCouponSelect} />

      {/* 總計盒子 */}
      <div className={style['checkout_total']}>
        <div className={style['checkout_total_box']}>
          <div className="text-end pb-1">
            <span>小計</span>
          </div>
          {pOriginalTotalPrice !== 0 && (
            <div className={style.item}>
              <span>彩妝商品</span>
              <span>NT${pOriginalTotalPrice.toLocaleString()}</span>
            </div>
          )}
          {wTotalPrice !== 0 && (
            <div className={style.item}>
              <>
                <span>課程商品</span>
                <span>NT${wTotalPrice.toLocaleString()}</span>
              </>
            </div>
          )}
          <div className={`${style.item} ${style['discount_item']}`}>
            <span>全站95折優惠</span>
            <span>-NT${discountDifference.toLocaleString()}</span>
          </div>
          {discount !== 0 && (
            <div className={`${style.item} ${style['discount_item']}`}>
              <span>{discountName}</span>
              <span>-NT${discount}</span>
            </div>
          )}
        </div>
        <div className={style.total}>
          總計：<span>NT${finalPrice.toLocaleString()}</span>
        </div>
      </div>
    </>
  )
}
