import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import styles from './discount-box.module.scss'
import { X } from '@phosphor-icons/react'
import Form from 'react-bootstrap/Form'
import { useAuth } from '@/hooks/use-auth'

export default function DiscountBox() {
  const [show, setShow] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState('') // 用來存儲選擇的優惠券
  const [coupons, setCoupons] = useState([]) // 儲存會員的優惠券清單
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  //獲取會員身上的優惠券
  const { auth } = useAuth()
  //確認會員id
  // if (auth.isAuth) {
  //   const userId = auth.userData.id
  //   console.log(userId)
  // }

  // 每次元件載入時從 localStorage 重新取得優惠券選擇
  useEffect(() => {
    const storedCoupon = localStorage.getItem('selectedCoupon')
    if (storedCoupon) {
      setSelectedCoupon(storedCoupon) // 設定為上次選擇的優惠券
    }
  }, [])

  // 更新選擇的優惠券名稱
  const handleCouponChange = (event) => {
    const couponId = event.target.value
    const selected = coupons.find((coupon) => coupon.id === couponId)
    const couponName = selected ? selected.name : ''
    setSelectedCoupon(couponName)
    localStorage.setItem('selectedCoupon', couponName) // 更新 localStorage
  }

  return (
    <>
      <div onClick={handleShow} className={styles['checkout_discount']}>
        <span>優惠券</span>
        <span className="ps">{selectedCoupon || '輸入享有折扣 >'}</span>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className={styles['modal']}
      >
        <div className={styles['modal-header']}>
          <div
            className={styles['close-button']}
            onClick={handleClose}
            style={{ cursor: 'pointer' }}
          >
            <X size={28} />
          </div>
        </div>
        <Modal.Body className={styles['modal-body']}>
          <Form.Label className="h6 mt-3 mb-3">優惠券折扣 :</Form.Label>
          <Form.Select
            value={
              selectedCoupon
                ? coupons.find((coupon) => coupon.name === selectedCoupon)?.id
                : ''
            }
            onChange={handleCouponChange}
            aria-label="Default select example"
            className={styles['form-select']}
          >
            <option value="">選擇優惠券</option>
            {/* 動態生成優惠券選項 */}
            {coupons.map((coupon) => (
              <option key={coupon.id} value={coupon.id}>
                {coupon.name}
              </option>
            ))}
          </Form.Select>
        </Modal.Body>
        <div className={styles['btn-comfirm']}>
          <button onClick={handleClose}>確認</button>
        </div>
      </Modal>
    </>
  )
}
