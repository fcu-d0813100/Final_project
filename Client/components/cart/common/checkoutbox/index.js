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
      const discountValue = selectedCouponObj.discount_value || 0
      setDiscountName(
        `${selectedCouponObj.brand_name || ''} ${selectedCouponObj.name || ''}`
      )

      // 計算折扣
      if (discountValue <= 1 && discountValue > 0) {
        const discountAmount = Math.floor(pTotalPrice * discountValue)
        setDiscount(pTotalPrice - discountAmount)
      } else if (discountValue > 1) {
        setDiscount(discountValue)
      } else {
        setDiscount(0)
      }
    } else {
      setDiscount(0)
      setDiscountName('')
    }
  }

  useEffect(() => {
    const storedCouponData = localStorage.getItem('selectedCouponObj')
    if (storedCouponData) {
      const couponData = JSON.parse(storedCouponData)
      handleCouponSelect(couponData)
    }
  }, [selectedCoupon, pTotalPrice])

  const finalPrice =
    pOriginalTotalPrice + wTotalPrice - discountDifference - discount

  return (
    <>
      <DiscountBox onCouponSelect={handleCouponSelect} />

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
              <span>課程商品</span>
              <span>NT${wTotalPrice.toLocaleString()}</span>
            </div>
          )}
          <div className={`${style.item} ${style['discount_item']}`}>
            <span>全站95折優惠</span>
            <span>-NT${discountDifference.toLocaleString()}</span>
          </div>
          {selectedCoupon && (
            <div className={`${style.item} ${style['discount_item']}`}>
              <span>{discountName}</span>
              <span>-NT${discount.toLocaleString()}</span>
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
