import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { X } from '@phosphor-icons/react'
import { useRouter } from 'next/router' // 新增 useRouter
import styles from './discount-box.module.scss'
import { useAuth } from '@/hooks/use-auth'
import { useCartProduct } from '@/hooks/use-cartP'

export default function DiscountBox({ onCouponSelect }) {
  const { auth } = useAuth()
  const userId = auth.userData.id
  const router = useRouter() // 使用 router 來導航

  const { productItems } = useCartProduct()
  const [coupons, setCoupons] = useState([])
  const [selectedCoupon, setSelectedCoupon] = useState('')
  const [tempCoupon, setTempCoupon] = useState('')
  const [show, setShow] = useState(false)

  const fetchCoupons = async () => {
    if (!userId) return

    try {
      const response = await fetch(
        `http://localhost:3005/api/getCoupon?userId=${userId}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      )
      const data = await response.json()

      if (data?.data) {
        const now = new Date()
        const productBrands = productItems
          .map((product) => product.brand)
          .concat('All')

        const validCoupons = data.data.filter((coupon) => {
          const startDate = new Date(coupon.start_date)
          const endDate = new Date(coupon.end_date)
          return (
            startDate <= now &&
            endDate >= now &&
            productBrands.includes(coupon.brand_name)
          )
        })

        setCoupons(validCoupons)
      } else {
        console.warn('No discount data found')
      }
    } catch (error) {
      console.error('Failed to fetch coupon data:', error)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [userId, productItems])

  // Load previously selected coupon from localStorage
  useEffect(() => {
    const storedCoupon = localStorage.getItem('selectedCoupon')
    if (storedCoupon) {
      setSelectedCoupon(storedCoupon)
    }
  }, [])

  const handleCouponChange = (event) => {
    setTempCoupon(event.target.value)
  }

  const handleConfirm = () => {
    setSelectedCoupon(tempCoupon)

    const selectedCouponObj = coupons.find(
      (coupon) => coupon.coupon_list_id == tempCoupon
    )
    localStorage.setItem('selectedCoupon', tempCoupon)

    if (selectedCouponObj) {
      localStorage.setItem(
        'selectedCouponObj',
        JSON.stringify(selectedCouponObj)
      )
    } else {
      localStorage.removeItem('selectedCouponObj')
    }

    if (onCouponSelect) {
      onCouponSelect(selectedCouponObj || null)
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
            ? (() => {
                const selected = coupons.find(
                  (coupon) => coupon.coupon_list_id == selectedCoupon
                )
                return selected
                  ? `${selected.brand_name} ${selected.name}`
                  : '輸入享有折扣 >'
              })()
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
