import React, { useState, useEffect } from 'react'
import style from './order-comfirm.module.scss'
import Image from 'next/image'
import { Form } from 'react-bootstrap'
import { useRouter } from 'next/router'
import BuyRule from '../../common/buyrule'
import OrderBox from '../../common/orderbox'
import axios from 'axios'
import { useCartProduct } from '@/hooks/use-cartP'
import { useCartWorkshop } from '@/hooks/use-cartW'

export default function OrderComfirm() {
  const router = useRouter()

  const {
    pTotalPrice = 0,
    pOriginalTotalPrice = 0,
    onClearProduct,
  } = useCartProduct()
  const { wTotalPrice = 0, onClearWorkshop } = useCartWorkshop()
  //全站打95折的價格
  const discountedWTotalPrice = Math.floor(wTotalPrice * 0.95)
  const discountDifference =
    pOriginalTotalPrice - pTotalPrice + (wTotalPrice - discountedWTotalPrice)

  //-----------------------生成時間戳記訂單編碼
  const [orderNumber, setOrderNumber] = useState('')
  const [orderData, setOrderData] = useState(null)

  const generateOrderNumber = () => {
    const now = new Date()
    const timestamp = now.toISOString().replace(/\D/g, '').slice(0, 14)
    return `${timestamp}`
  }

  useEffect(() => {
    const newOrderNumber = generateOrderNumber()
    setOrderNumber(newOrderNumber)
    // 從 localStorage 取得 orderData，並將 orderNumber 加入其中
    let storedOrderData = JSON.parse(localStorage.getItem('orderData'))
    // 加入 orderNumber 到 orderData 並更新 localStorage
    storedOrderData.orderNumber = newOrderNumber
    setOrderData(storedOrderData)
    localStorage.setItem('orderData', JSON.stringify(storedOrderData))
  }, [])

  //抓取付款方式的值
  const paymentMethod = orderData?.paymentMethod || 'defaultPaymentMethod'
  const deliveryMethod = orderData?.deliveryMethod || 'defaultDeliveryMethod'

  //算優惠券折價
  let discountPrice
  if (orderData?.coupon?.discount_value <= 1) {
    discountPrice =
      pTotalPrice - Math.floor(pTotalPrice * orderData.coupon.discount_value)
  } else if (orderData?.coupon?.discount_value > 1) {
    discountPrice = orderData.coupon.discount_value
  } else {
    discountPrice = 0
  }

  //------------送訂單到後端
  //判斷付款方式(1.貨到付款)
  const handleCheckout = async () => {
    //處理值的問題
    orderData.paymentMethod = 1
    if (deliveryMethod === 'home') {
      orderData.deliveryMethod = 1
    } else if (deliveryMethod === '7-11') {
      orderData.deliveryMethod = 2
    }
    // -----------另外抓取orderNumber存到localStorage
    localStorage.setItem('orderNumber', orderData.orderNumber)

    //推到後端api
    try {
      router.push('http://localhost:3000/cart/success')
      const response = await axios.post(
        'http://localhost:3005/api/cart/checkout',
        orderData
      )
      console.log('訂單已成功提交', response.data)
    } catch (error) {
      console.error('提交訂單失敗', error)
    }
  }

  //判斷付款方式(2.綠界)
  const goECPay = async () => {
    // -----------另外抓取orderNumber存到localStorage
    localStorage.setItem('orderNumber', orderData.orderNumber)
    //處理值的問題
    orderData.paymentMethod = 2
    if (deliveryMethod === 'home') {
      orderData.deliveryMethod = 1
    } else if (deliveryMethod === '7-11') {
      orderData.deliveryMethod = 2
    }
    const totalPrice = orderData.totalPrice
    const orderNumber = `Beautique訂單編號 : ${orderData.orderNumber}`
    console.log(orderData)
    console.log('請求綠界支付...')
    //導向綠界支付
    try {
      window.location.href = `http://localhost:3005/api/ecpay-test-only?amount=${totalPrice}&orderId=${orderNumber}`
      //訂單資料推到後端街口處理
      const response = await axios.post(
        'http://localhost:3005/api/cart/checkout',
        orderData
      )
      onClearProduct()
      onClearWorkshop()
    } catch (error) {
      console.error('金流請求失敗', error)
    }
  }

  //-----------寄信測試
  // 發送請求來觸發後端寄送郵件
  function sendEmail() {
    fetch('http://localhost:3005/api/cart/send', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          alert('Email 已成功發送！')
        } else {
          alert('Email 發送失敗：' + data.message)
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        alert('發生錯誤，無法發送郵件')
      })
  }

  return (
    <div className="container">
      <div className={style.step}>
        <Image
          src="/cart/step3.svg"
          alt="Step1"
          width={1400}
          height={500}
          className="img-fluid d-none d-md-block"
        />
        <Image
          src="/cart/RWDstep.3.svg"
          alt="Step1"
          width={200}
          height={400}
          className="img-fluid d-md-none -block"
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
                        {orderData ? (
                          orderData.deliveryMethod === 'home' ? (
                            <div className={style.home}>
                              <span className={style.text}>
                                收件地址 : {orderData.homeAdress}
                              </span>

                              <span> 收件人 : {orderData.recipientName}</span>

                              <span> 電話 : {orderData.recipientPhone}</span>

                              <span> 信箱 : {orderData.recipientEmail}</span>
                            </div>
                          ) : (
                            <div className={style.home}>
                              <span className={style.text}>
                                門市 : {orderData?.storename || '未提供'}
                              </span>

                              <span className={style.text}>
                                地址 : {orderData?.storeaddress || '未提供'}
                              </span>

                              <span className={style.text}>
                                收件人 :{' '}
                                {orderData?.sevenRecipientName || '未提供'}
                              </span>

                              <span className={style.text}>
                                電話 :{' '}
                                {orderData?.sevenRecipientPhone || '未提供'}
                              </span>
                            </div>
                          )
                        ) : (
                          <div>資料加載中...</div>
                        )}
                      </div>
                    </Form.Label>
                  </Form.Group>
                </Form>
              </div>

              <Form className="p-4">
                <div className={style.payment}>
                  <div className={`h5 ${style['payment-topic']}`}>付款方式</div>
                  <div className={style.home}>
                    {orderData?.paymentMethod === 'cod' ? '貨到付款' : '信用卡'}
                  </div>
                </div>
              </Form>
            </div>
            <div className={style['total_amount']}>
              <div className={style.discount}>
                全站95折優惠：-NT${discountDifference.toLocaleString()}
              </div>
              {orderData?.coupon && (
                <div className={style.discount}>
                  {`${orderData?.coupon.brand_name} ${orderData?.coupon.name}：-NT$${discountPrice}`}
                </div>
              )}
              <hr />
              <div className="d-flex align-items-center justify-content-end">
                <div>
                  <div className={style['original-p']}>
                    原價：NT$
                    {(pOriginalTotalPrice + wTotalPrice).toLocaleString()}
                  </div>

                  <div className={style['total_price']}>
                    <span className="text-black"> 總金額：</span> NT$
                    {orderData?.totalPrice?.toLocaleString() || '未提供'}
                  </div>
                </div>
              </div>
            </div>

            <div className={`text-end  ${style['checkout_btn']}`}>
              <button
                className="btn-primary"
                onClick={() => router.push('/cart/checkout')}
              >
                取消
              </button>
              <button
                className="ms-2 btn-secondary"
                onClick={paymentMethod === 'cod' ? handleCheckout : goECPay}
              >
                結賬
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
