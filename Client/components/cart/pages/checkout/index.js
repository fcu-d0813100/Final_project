import React, { useState, useEffect, useRef } from 'react'
import CheckoutBox from '@/components/cart/common/checkoutbox/index'
import style from './checkout.module.scss'
import Image from 'next/image'
import { Form, Row, Col } from 'react-bootstrap'
import { useRouter } from 'next/router'
import BuyRule from '../../common/buyrule'
import OrderBox from '../../common/orderbox'
import Seven from '../../../../pages/cart/ship'
import { useCartProduct } from '@/hooks/use-cartP'
import { useCartWorkshop } from '@/hooks/use-cartW'
import axios from 'axios'

export default function Checkout() {
  const router = useRouter()
  const [deliveryMethod, setDeliveryMethod] = useState('home') //預設物流
  const [paymentMethod, setPaymentMethod] = useState('cod') //預設付款
  const [orderData, setOrderData] = useState({}) // 保存訂單資料

  //鉤子帶入金額跟數量
  const { pTotalPrice = 0, pTotalQty = 0 } = useCartProduct()
  const { wTotalPrice = 0, wTotalQty = 0 } = useCartWorkshop()
  //打折的價格
  const discountedPTotalPrice = pTotalPrice
  const discountedWTotalPrice = wTotalPrice * 0.8
  const totalPrice = discountedPTotalPrice + discountedWTotalPrice

  // 使用 useRef 來存儲 input 值
  const recipientNameRef = useRef(null)
  const recipientPhoneRef = useRef(null)
  const recipientEmailRef = useRef(null)
  const recipientCityRef = useRef(null)
  const recipientDistrictRef = useRef(null)
  const recipientAddressRef = useRef(null)
  const sevenRecipientNameRef = useRef(null)
  const sevenRecipientPhoneRef = useRef(null)

  //首次渲染-------------------------抓取已設定在localStorage的物流跟付款方法
  useEffect(() => {
    const savedDeliveryMethod = localStorage.getItem('deliveryMethod')
    const savedPaymentMethod = localStorage.getItem('paymentMethod')

    if (savedDeliveryMethod) {
      setDeliveryMethod(savedDeliveryMethod)
    }
    if (savedPaymentMethod) {
      setPaymentMethod(savedPaymentMethod)
    }
    //擋711路由顯示的問題
    if (router.query.deliveryMethod) {
      router.replace(router.pathname, undefined, { shallow: true })
    }
  }, [router.query])

  //------------選擇方式
  const handleDeliveryChange = (method) => {
    setDeliveryMethod(method)
    localStorage.setItem('deliveryMethod', method)
  }
  //------------選擇付款方式
  const handlePaymentChange = (event) => {
    const method = event.target.value
    setPaymentMethod(method)
    localStorage.setItem('paymentMethod', method)
  }

  //------------產生訂單資訊儲存到localstorage(整合使用者選擇的內容)
  const handleCheckout = () => {
    //宅配
    const recipientName = recipientNameRef.current?.value
    const recipientPhone = recipientPhoneRef.current?.value
    const recipientEmail = recipientEmailRef.current?.value
    const recipientCity = recipientCityRef.current?.value
    const recipientDistrict = recipientDistrictRef.current?.value
    const recipientAddress = recipientAddressRef.current?.value
    const homeAdress = `${recipientCity}${recipientDistrict}${recipientAddress}`
    //711
    const sevenRecipientName = sevenRecipientNameRef.current?.value
    const sevenRecipientPhone = sevenRecipientPhoneRef.current?.value
    const store711Data = JSON.parse(localStorage.getItem('store711'))
    const storename = store711Data?.storename
    const storeaddress = store711Data?.storeaddress
    //商品&課程資訊&金額
    const productCart = JSON.parse(localStorage.getItem('productCart'))
    const Workshopcart = JSON.parse(localStorage.getItem('Workshopcart'))

    let orderData = {}
    if (deliveryMethod === '7-11') {
      orderData = {
        deliveryMethod,
        paymentMethod,
        sevenRecipientName,
        sevenRecipientPhone,
        storename,
        storeaddress,
        productCart,
        Workshopcart,
        totalPrice,
      }
    } else {
      orderData = {
        deliveryMethod,
        paymentMethod,
        recipientName,
        recipientPhone,
        recipientEmail,
        homeAdress,
        productCart,
        Workshopcart,
        totalPrice,
      }
    }

    localStorage.setItem('orderData', JSON.stringify(orderData))
    alert('訂單成立')
    router.push('/cart/order-check')
  }

  //------------渲染頁面
  return (
    <>
      <div className="container">
        <div className={style.step}>
          <Image
            src="/cart/step2.svg"
            alt="Step2"
            width={1400}
            height={300}
            className="img-fluid d-none d-lg-block"
          />
        </div>
        <div className={style.outer}>
          <div className={style.list}>
            <div className={style.order}>
              <div className={`h5 ${style['order-topic']}`}>填寫訂購資料</div>
              <div className={style['order-box']}>
                <OrderBox />
                <div className={style.shipping}>
                  <Form className="p-4">
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <div className={`h5 ${style['shipping-topic']}`}>
                          配送方式 <span>*</span>
                        </div>
                      </Form.Label>
                      <Form.Check
                        className="mb-3"
                        type="radio"
                        label="宅配"
                        name="deliveryMethod"
                        id="deliveryMethodhome"
                        value="home"
                        checked={deliveryMethod === 'home'}
                        onChange={() => handleDeliveryChange('home')}
                      />
                      <Form.Check
                        type="radio"
                        label="7-11"
                        name="deliveryMethod"
                        id="deliveryMethod7-11"
                        value="7-11"
                        checked={deliveryMethod === '7-11'}
                        onChange={() => handleDeliveryChange('7-11')}
                      />
                    </Form.Group>

                    {deliveryMethod === 'home' ? (
                      <div className={style['shipping-form']}>
                        {/* 宅配資料表單 */}
                        <Form.Group className="mb-3" controlId="recipient-name">
                          <Form.Label>收件人</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="填寫姓名"
                            name="recipient_name"
                            ref={recipientNameRef}
                          />
                        </Form.Group>

                        <Form.Group
                          className="mb-3"
                          controlId="recipient-phone"
                        >
                          <Form.Label>電話</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="例 : 0912345678"
                            name="recipient_phone"
                            ref={recipientPhoneRef}
                          />
                        </Form.Group>

                        <Form.Group
                          className="mb-3"
                          controlId="recipient-email"
                        >
                          <Form.Label>信箱</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="填寫信箱"
                            name="recipient_email"
                            ref={recipientEmailRef}
                          />
                        </Form.Group>

                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Group controlId="recipient-city">
                              <Form.Label>縣市</Form.Label>
                              <Form.Select
                                name="recipient_city"
                                ref={recipientCityRef}
                              >
                                <option value="" disabled selected>
                                  選擇縣市
                                </option>
                                <option value="台北市">台北市</option>
                                <option value="台中市">台中市</option>
                                <option value="高雄市">高雄市</option>
                                <option value="桃園市">桃園市</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId="recipient-district">
                              <Form.Label>區</Form.Label>
                              <Form.Select
                                name="recipient_district"
                                ref={recipientDistrictRef}
                              >
                                <option value="" disabled selected>
                                  選擇區
                                </option>
                                <option value="中正區">中正區</option>
                                <option value="大安區">大安區</option>
                                <option value="信義區">信義區</option>
                                <option value="內湖區">內湖區</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group
                          className="mb-3"
                          controlId="recipient-address"
                        >
                          <Form.Label>居住地址</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="填寫地址"
                            name="recipient_address"
                            ref={recipientAddressRef}
                          />
                        </Form.Group>
                      </div>
                    ) : (
                      <div className={style['shipping-form']}>
                        <Seven />
                        <Form.Group
                          className="mb-3"
                          controlId="seven-recipient-name"
                        >
                          <Form.Label className="mt-3">收件人</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="填寫姓名"
                            name="seven_recipient_name"
                            ref={sevenRecipientNameRef}
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="seven-recipient-phone"
                        >
                          <Form.Label>電話</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="例 : 0912345678"
                            name="seven_recipient_phone"
                            ref={sevenRecipientPhoneRef}
                          />
                        </Form.Group>
                      </div>
                    )}
                  </Form>
                </div>

                <Form className="p-4">
                  <div className={style.payment}>
                    <div className={`h5 ${style['payment-topic']}`}>
                      付款方式 <span>*</span>
                    </div>
                    <div className="mb-3">
                      <Form.Check
                        type="radio"
                        id="cod"
                        name="payment"
                        label="貨到付款"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={handlePaymentChange}
                      />
                    </div>
                    <div className="mb-4">
                      <Form.Check
                        type="radio"
                        id="ecPay"
                        name="payment"
                        label="綠界"
                        value="ecPay"
                        checked={paymentMethod === 'ecPay'}
                        onChange={handlePaymentChange}
                      />
                    </div>
                  </div>
                </Form>
              </div>
              <BuyRule />
            </div>
          </div>

          <div className={style.checkout}>
            <div className="mb-5">
              <CheckoutBox />
            </div>
            <button
              type="button"
              className={`w-100 btn btn-primary ${style['checkout-btn']}`}
              onClick={handleCheckout}
            >
              確認結帳
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
