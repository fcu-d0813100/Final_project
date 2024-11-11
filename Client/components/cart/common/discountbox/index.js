import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import styles from './discount-box.module.scss'
import { X } from '@phosphor-icons/react'
import Form from 'react-bootstrap/Form'
import { useAuth } from '@/hooks/use-auth'

export default function DiscountBox() {
  // 獲取會員ID
  const { auth } = useAuth()
  const userId = auth.userData.id
  console.log('userId:', userId)

  const [discount, setDiscount] = useState(0) // 折扣內容
  const [coupons, setCoupons] = useState([]) // 優惠券清單
  const [selectedCoupon, setSelectedCoupon] = useState('') // 已選的優惠券
  const [tempCoupon, setTempCoupon] = useState('') // 暫存的優惠券
  const [couponData, setCouponData] = useState(null) //儲存被選中的優惠券物件（到時候要抓裡面的值）

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
      console.log(resData.data)

      // 從購物車取得商品品牌
      let productBrand = JSON.parse(localStorage.getItem('productCart'))
      productBrand = productBrand.map((product) => product.brand)
      console.log(productBrand)

      if (resData.data) {
        // 篩選出有效優惠券
        const now = new Date()
        const filteredData = resData.data.filter((coupon) => {
          const startDate = new Date(coupon.start_date)
          const endDate = new Date(coupon.end_date)
          return (
            startDate <= now &&
            endDate >= now &&
            productBrand.includes(coupon.brand_name)
          )
        })
        console.log(filteredData) // 篩選後的結果
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
  }, [userId])

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
    console.log(couponId)
    setTempCoupon(couponId) // 儲存在 tempCoupon 中，按確認後才更新
  }

  // 確認按鈕的點擊事件，更新 selectedCoupon 並關閉彈窗
  const handleConfirm = () => {
    setSelectedCoupon(tempCoupon)
    const selectedCouponObj = coupons.find(
      (item) => item.coupon_list_id == tempCoupon
    )
    console.log(selectedCouponObj)
    localStorage.setItem('selectedCoupon', tempCoupon)
    if (tempCoupon) {
      localStorage.setItem(
        'selectedCouponObj',
        JSON.stringify(selectedCouponObj)
      )
    } else if (!tempCoupon) {
      localStorage.removeItem('selectedCouponObj')
    }
    handleClose()
  }

  return (
    <>
      <div onClick={handleShow} className={styles['checkout_discount']}>
        <span>優惠券</span>
        <span className="ps">
          {' '}
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
            onChange={handleCouponChange} // 綁定到 tempCoupon
            aria-label="Default select example"
            className={styles['form-select']}
          >
            <option value="">選擇優惠券</option>
            {/* 動態生成優惠券選項 */}
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
