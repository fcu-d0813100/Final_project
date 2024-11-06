import React, { useState, useEffect } from 'react'
import CheckoutBox from '@/components/cart/common/checkoutbox/index'
import style from './order-comfirm.module.scss'
import Image from 'next/image'
import { Form, Row, Col } from 'react-bootstrap'
import { useRouter } from 'next/router'
import BuyRule from '../../common/buyrule'
import OrderBox from '../../common/orderbox'
import { useCartProduct } from '@/hooks/use-cartP'
import { useCartWorkshop } from '@/hooks/use-cartW'
import axios from 'axios'

export default function OrderComfirm() {
  const router = useRouter()

  // ---------- 物流 & 付款方式 -----------
  const [deliveryMethod, setDeliveryMethod] = useState('home') // 預設選擇宅配
  const [store711, setStore711] = useState(null) // 預設為 null，後面再更新
  const [paymentMethod, setPaymentMethod] = useState('cod') // 預設付款方式為貨到付款

  // 只在客戶端執行localStorage操作
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDeliveryMethod = localStorage.getItem('deliveryMethod')
      const savedPaymentMethod = localStorage.getItem('paymentMethod')
      const savedStore711 = localStorage.getItem('store711')

      if (savedDeliveryMethod) {
        setDeliveryMethod(savedDeliveryMethod)
      }
      if (savedPaymentMethod) {
        setPaymentMethod(savedPaymentMethod)
      }
      if (savedStore711) {
        setStore711(JSON.parse(savedStore711))
      }
    }
  }, [router.query])
  //------------送出預設訂單

  //   const handleCheckout = async () => {
  //     // 獲取宅配或7-11的資料
  //     let orderData = {}
  //     const productCart = JSON.parse(localStorage.getItem('productCart'))
  //     const Workshopcart = JSON.parse(localStorage.getItem('Workshopcart'))
  //     const orderNumber = localStorage.getItem('orderNumber')

  //     if (deliveryMethod === 'home') {
  //       orderData = {
  //         deliveryMethod: 1,
  //         recipient_name: document.querySelector('input[name="recipient_name"]')
  //           .value,
  //         recipient_phone: document.querySelector('input[name="recipient_phone"]')
  //           .value,
  //         recipient_email: document.querySelector('input[name="recipient_email"]')
  //           .value,
  //         recipient_city: document.querySelector('select[name="recipient_city"]')
  //           .value,
  //         recipient_district: document.querySelector(
  //           'select[name="recipient_district"]'
  //         ).value,
  //         recipient_address: document.querySelector(
  //           'input[name="recipient_address"]'
  //         ).value,
  //         productCart,
  //         Workshopcart,
  //         orderNumber,
  //         totalDiscountPrice,
  //       }
  //     } else if (deliveryMethod === '7-11') {
  //       const store711 = JSON.parse(localStorage.getItem('store711'))
  //       orderData = {
  //         deliveryMethod: 2,
  //         storename: store711.storename,
  //         storeaddress: store711.storeaddress,
  //         productCart,
  //         Workshopcart,
  //         orderNumber,
  //         totalDiscountPrice,
  //       }
  //     }

  // 根據付款方式進行處理
  // if (paymentMethod === 'cod') {
  //   orderData.paymentMethod = 1
  //   // 直接插入訂單到資料庫
  //   try {
  //     const response = await axios.post(
  //       'http://localhost:3005/api/cart/checkout',
  //       orderData
  //     )
  //     console.log(orderData)
  //     console.log('訂單已成功提交', response.data)
  //     // 可以在此添加成功後的操作，比如重定向或顯示提示
  //   } catch (error) {
  //     console.error('提交訂單失敗', error)
  //   }
  // } else if (paymentMethod === 'ecPay') {
  //   orderData.paymentMethod = 2
  //   // 在此處理串接金流的邏輯
  //   // 可能需要引導用戶到支付頁面
  //   console.log('請求綠界支付...')
  // }
  //   }

  //------------送出預設訂單

  //生成時間戳記訂單編碼
  const [orderNumber, setOrderNumber] = useState('')
  const generateOrderNumber = () => {
    const now = new Date()
    const timestamp = now.toISOString().replace(/\D/g, '').slice(0, 14)
    return `${timestamp}`
  }
  useEffect(() => {
    const newOrderNumber = generateOrderNumber()
    setOrderNumber(newOrderNumber)
    localStorage.setItem('orderNumber', newOrderNumber)
  }, [])

  return (
    <>
      <div className="container">
        <div className={style.step}>
          <Image
            src="/cart/step3.svg"
            alt="Step2"
            width={1400}
            height={300}
            className="img-fluid d-none d-lg-block"
          />
        </div>
        <div className={style.outer}>
          <div className={style.list}>
            <div className={style.order}>
              <div className={`h5 ${style['order-topic']}`}>
                訂單編號：{orderNumber}
              </div>
              <div className={style['order-box']}>
                <OrderBox />
                <div className={style.shipping}>
                  <Form className="p-4">
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <div className={`h5 ${style['shipping-topic']}`}>
                          配送方式
                        </div>
                        <div>
                          {deliveryMethod === 'home' ? (
                            <div>
                              {/* <div>{store711.storeaddress}</div>
                              <div>{store711.storeaddress}</div>
                              <div>{store711.storeaddress}</div>
                              <div>{store711.storeaddress}</div> */}
                            </div>
                          ) : (
                            <div>
                              {store711.storename}
                              <div>{store711.storeaddress}</div>
                            </div>
                          )}
                        </div>
                      </Form.Label>
                    </Form.Group>
                  </Form>
                </div>

                <Form className="p-4">
                  <div className={style.payment}>
                    <div className={`h5 ${style['payment-topic']}`}>
                      付款方式
                    </div>
                    <div>{paymentMethod === 'cod' ? '貨到付款' : '信用卡'}</div>
                  </div>
                </Form>
              </div>
              {/* <BuyRule /> */}
              <div
                className={`mt-5 mb-5 d-xl-flex justify-content-end ${style['checkout_btn']}`}
              >
                <button
                  className="btn-primary"
                  onClick={() => router.push('/cart/checkout')}
                >
                  返回
                </button>
                <button className="ms-2 btn-secondary">結賬</button>
              </div>
            </div>
          </div>

          {/* <div className={style.checkout}>
            <div className={style.sticky}>
              <CheckoutBox />
              
            </div>
          </div> */}
        </div>
      </div>
    </>
  )
}
