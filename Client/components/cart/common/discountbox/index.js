import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { X } from '@phosphor-icons/react'
import { useRouter } from 'next/router'
import styles from './discount-box.module.scss'
import { useAuth } from '@/hooks/use-auth'
import { useCartProduct } from '@/hooks/use-cartP'

export default function DiscountBox({ onCouponSelect }) {
  const { auth } = useAuth()
  const userId = auth.userData.id
  const router = useRouter()

  const {
    productItems,
    coupons,
    selectedCoupon,
    loadCoupons,
    selectCoupon,
    removeCoupon,
  } = useCartProduct()

  const [tempCoupon, setTempCoupon] = useState('')
  const [show, setShow] = useState(false)

  useEffect(() => {
    loadCoupons(userId, productItems)
  }, [userId, productItems])

  const handleConfirm = () => {
    if (tempCoupon === '') {
      // 如果選擇的是 "選擇優惠券" 則取消已選優惠券
      removeCoupon()
      if (onCouponSelect) {
        onCouponSelect(null) // 傳遞 null 以表示沒有選擇任何優惠券
      }
    } else {
      const selected = coupons.find(
        (coupon) => coupon.coupon_list_id == tempCoupon
      )
      if (selected) {
        selectCoupon(selected)
        if (onCouponSelect) {
          onCouponSelect(selected)
        }
      }
    }
    setShow(false)
  }

  const handleNoCoupons = () => {
    router.push('/') // 導航到優惠券頁面
  }

  return (
    <>
      <div
        onClick={() => setShow(true)}
        className={styles['checkout_discount']}
      >
        <span>優惠券</span>
        <span className="ps">
          {selectedCoupon
            ? `${selectedCoupon.brand_name} ${selectedCoupon.name}`
            : '輸入享有折扣 >'}
        </span>
      </div>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        backdrop="static"
        keyboard={false}
        className={styles['modal']}
      >
        <div className={styles['modal-header']}>
          <div
            className={styles['close-button']}
            onClick={() => setShow(false)}
            style={{ cursor: 'pointer' }}
          >
            <X size={28} />
          </div>
        </div>
        <Modal.Body className={styles['modal-body']}>
          {coupons.length > 0 ? (
            <>
              <Form.Label className="h6 mt-3 mb-3">優惠券折扣 :</Form.Label>
              <Form.Select
                value={tempCoupon}
                onChange={(e) => setTempCoupon(e.target.value)}
                aria-label="Default select example"
                className={styles['form-select']}
              >
                <option value="">選擇優惠券</option>
                {coupons.map((coupon) => (
                  <option
                    key={coupon.coupon_relation_id}
                    value={coupon.coupon_list_id}
                  >
                    {`${coupon.brand_name} ${coupon.name}`}
                  </option>
                ))}
              </Form.Select>
              <div className="ps mt-2 text-muted text-end">
                <span className="text-danger">*</span>優惠券僅限彩妝商品使用
              </div>
            </>
          ) : (
            <div className="text-center">
              <Form.Label className="h5 mb-4">尚無優惠券</Form.Label>
              <div className={styles['no-coupon']} onClick={handleNoCoupons}>
                查看優惠專區
              </div>
            </div>
          )}
        </Modal.Body>
        <div className={styles['btn-comfirm']}>
          {coupons.length > 0 && <button onClick={handleConfirm}>確認</button>}
        </div>
      </Modal>
    </>
  )
}
