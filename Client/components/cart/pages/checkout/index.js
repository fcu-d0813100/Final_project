import React, { useState, useEffect } from 'react'
import CheckoutBox from '@/components/cart/common/checkoutbox/index'
import style from './checkout.module.scss'
import Image from 'next/image'
import { Form, Row, Col } from 'react-bootstrap'
import { useRouter } from 'next/router'
import BuyRule from '../../common/buyrule'
import OrderBox from '../../common/orderbox'
import Seven from '../../../../pages/cart/ship'
import axios from 'axios'

export default function Checkout() {
  const router = useRouter()

  const [deliveryMethod, setDeliveryMethod] = useState('home') // 預設選擇宅配
  const [paymentMethod, setPaymentMethod] = useState('cod') // 預設付款方式為貨到付款
  const [orderData, setOrderData] = useState({}) // 保存訂單資料

  // 在組件加載時從 localStorage 獲取值
  useEffect(() => {
    const savedDeliveryMethod = localStorage.getItem('deliveryMethod')
    const savedPaymentMethod = localStorage.getItem('paymentMethod')

    if (savedDeliveryMethod) {
      setDeliveryMethod(savedDeliveryMethod)
    }
    if (savedPaymentMethod) {
      setPaymentMethod(savedPaymentMethod)
    }

    if (router.query.deliveryMethod) {
      router.replace(router.pathname, undefined, { shallow: true })
    }
  }, [router.query])

  const handleDeliveryChange = (method) => {
    setDeliveryMethod(method)
    localStorage.setItem('deliveryMethod', method)
  }

  const handlePaymentChange = (event) => {
    const method = event.target.value
    setPaymentMethod(method)
    localStorage.setItem('paymentMethod', method)
  }

  const handleCheckout = () => {
    const recipientName = document.getElementsByName('recipient_name')[0].value
    const recipientPhone =
      document.getElementsByName('recipient_phone')[0].value
    const recipientEmail =
      document.getElementsByName('recipient_email')[0].value
    const recipientCity = document.getElementsByName('recipient_city')[0].value
    const recipientDistrict =
      document.getElementsByName('recipient_district')[0].value
    const recipientAddress =
      document.getElementsByName('recipient_address')[0].value

    // 檢查選擇的物流方式，並生成不同的 `orderData`
    let orderData = {}
    if (deliveryMethod === '7-11') {
      orderData = {
        deliveryMethod,
        paymentMethod,
        sevenInfo: {
          // 假設 Seven 組件內有需要的字段 (例如 7-11 門市名稱或編號等)
          storeName: '示例門市',
          storeID: '7111234',
        },
      }
    } else {
      orderData = {
        deliveryMethod,
        paymentMethod,
        recipient: {
          name: recipientName,
          phone: recipientPhone,
          email: recipientEmail,
          city: recipientCity,
          district: recipientDistrict,
          address: recipientAddress,
        },
      }
    }

    // 將 `orderData` 保存到 localStorage
    localStorage.setItem('orderData', JSON.stringify(orderData))
    alert('訂單成立')
    // 跳轉到確認頁面或提交訂單
    // router.push('/cart/confirmation')
  }
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
                          />
                        </Form.Group>

                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Group controlId="recipient-city">
                              <Form.Label>縣市</Form.Label>
                              <Form.Select name="recipient_city">
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
                              <Form.Select name="recipient_district">
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
                          />
                        </Form.Group>
                      </div>
                    ) : (
                      <div className={style['shipping-form']}>
                        <Seven />
                        <Form.Group className="mb-3" controlId="recipient-name">
                          <Form.Label className="mt-3">收件人</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="填寫姓名"
                            name="recipient_name"
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
            <div className={style.sticky}>
              <CheckoutBox />
              <div
                className={`justify-content-between d-xl-flex d-none ${style['checkout_btn']}`}
              >
                <button
                  className="btn-primary"
                  onClick={() => router.push('/cart/')}
                >
                  返回
                </button>
                <button className="ms-2 btn-secondary" onClick={handleCheckout}>
                  確認
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
