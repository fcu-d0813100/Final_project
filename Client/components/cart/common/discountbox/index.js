import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import styles from './discount-box.module.scss'
import { X } from '@phosphor-icons/react'
import Form from 'react-bootstrap/Form'
import { useAuth } from '@/hooks/use-auth'
import { useCartProduct } from '@/hooks/use-cartP'

export default function DiscountBox({ onCouponSelect }) {
  // 獲取會員ID
  const { auth } = useAuth()
  const userId = auth.userData.id
  console.log('userId:', userId)

  const { productItems } = useCartProduct() // 使用上下文中的購物車資料
  const [coupons, setCoupons] = useState([]) // 優惠券清單
  const [selectedCoupon, setSelectedCoupon] = useState('') // 已選的優惠券
  const [tempCoupon, setTempCoupon] = useState('') // 暫存的優惠券

  // 控制彈窗
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  // 取得優惠券
  const getCoupon = async () => {
    if (!userId) return
    try {
      const url = `http://localhost:3005/api/getCoupon?userId=${userId}`
      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      })
      const resData = await res.json()

      // 從購物車取得商品品牌
      const productBrands = productItems.map((product) => product.brand)

      if (resData.data) {
        // 篩選出有效優惠券
        const now = new Date()
        const filteredData = resData.data.filter((coupon) => {
          const startDate = new Date(coupon.start_date)
          const endDate = new Date(coupon.end_date)
          return (
            startDate <= now &&
            endDate >= now &&
            productBrands.includes(coupon.brand_name)
          )
        })
        setCoupons(filteredData)
      } else {
        console.warn('No discount data found')
      }
    } catch (error) {
      console.error('Failed to fetch coupon data:', error)
    }
  }

  useEffect(() => {
    getCoupon()
  }, [userId, productItems]) // 當 userId 或 productItems 改變時重新獲取優惠券

  // 從 localStorage 重新取得上次選擇的優惠券
  useEffect(() => {
    const storedCoupon = localStorage.getItem('selectedCoupon')
    if (storedCoupon) {
      setSelectedCoupon(storedCoupon)
    }
  }, [])

  // 更新暫存的優惠券
  const handleCouponChange = (event) => {
    const couponId = event.target.value
    setTempCoupon(couponId) // 儲存在 tempCoupon 中，按確認後才更新
  }

  // 確認按鈕的點擊事件，更新 selectedCoupon 並關閉彈窗
  const handleConfirm = () => {
    setSelectedCoupon(tempCoupon)
    const selectedCouponObj = coupons.find(
      (item) => item.coupon_list_id == tempCoupon
    )
    localStorage.setItem('selectedCoupon', tempCoupon)

    if (tempCoupon && selectedCouponObj) {
      localStorage.setItem(
        'selectedCouponObj',
        JSON.stringify(selectedCouponObj)
      )
    } else {
      localStorage.removeItem('selectedCouponObj')
    }

    // 調用父組件的 onCouponSelect 回調
    if (onCouponSelect) {
      onCouponSelect(selectedCouponObj || null)
    }

    handleClose()
  }

  return (
    <>
      <div onClick={handleShow} className={styles['checkout_discount']}>
        <span>優惠券</span>
        <span className="ps">
          {selectedCoupon
            ? coupons.find((coupon) => coupon.coupon_list_id == selectedCoupon)
                ?.brand_name +
              ' ' +
              coupons.find((coupon) => coupon.coupon_list_id == selectedCoupon)
                ?.name
            : '輸入享有折扣 >'}
        </span>
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
            value={tempCoupon}
            onChange={handleCouponChange}
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
        </Modal.Body>

        <div className={styles['btn-comfirm']}>
          <button onClick={handleConfirm}>確認</button>
        </div>
      </Modal>
    </>
  )
}
