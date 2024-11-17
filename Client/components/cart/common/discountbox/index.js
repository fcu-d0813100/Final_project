import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { X } from '@phosphor-icons/react'
import { useRouter } from 'next/router'
import styles from './discount-box.module.scss'
import { useAuth } from '@/hooks/use-auth'
import { useCartProduct } from '@/hooks/use-cartP'
import ModalConfirm from '@/components/shared/modal-confirm/index'

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

  //------------談窗阻擋
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  // ------如果沒有商品無法使用優惠券
  const handleClick = () => {
    if (productItems.length === 0) {
      setModalMessage('本站僅有彩妝品能夠使用優惠券')
      setShowModal(true)
      return
    }
    setShow(true)
  }

  return (
    <>
      {showModal && (
        <ModalConfirm
          title="關於優惠券"
          content={modalMessage}
          btnConfirm="確認"
          show={showModal}
          handleClose={() => setShowModal(false)}
        />
      )}
      <div
        onClick={handleClick} // 使用 handleClick 函式來處理點擊事件
        className={styles['checkout_discount']}
      >
        <span>優惠券</span>
        <span>
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
