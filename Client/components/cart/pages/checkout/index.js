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
import ModalConfirm from '@/components/shared/modal-confirm/index'
import { useAuth } from '@/hooks/use-auth'
import {
  countries,
  townships,
  postcodes,
} from '../../common/tw-zipcode/data-townships'

export default function Checkout({
  initPostcode = '',
  onPostcodeChange = (country, township, postcode) => {},
}) {
  //----------------------------------------------套用縣市連動資料
  // console.log(countries, townships, postcodes)
  // 記錄陣列的索引值，預設值是-1，相當於"請選擇xxx"
  const [countryIndex, setCountryIndex] = useState(-1)
  const [townshipIndex, setTownshipIndex] = useState(-1)

  // 郵遞區號使用字串(數字字串)
  const [postcode, setPostcode] = useState('')

  // 利用傳入時的initPostcode初始化用
  useEffect(() => {
    if (initPostcode) {
      setPostcode(initPostcode)
      // 使用initPostcode尋找對應的countryIndex, townshipIndex
      for (let i = 0; i < postcodes.length; i++) {
        for (let j = 0; j < postcodes[i].length; j++) {
          if (postcodes[i][j] === initPostcode) {
            setCountryIndex(i)
            setTownshipIndex(j)
            return // 跳出巢狀for迴圈
          }
        }
      }
    }
  }, [initPostcode])

  // 當countryIndex, townshipIndex均有值時，設定postcode值
  useEffect(() => {
    if (countryIndex > -1 && townshipIndex > -1) {
      setPostcode(postcodes[countryIndex][townshipIndex])
    }
  }, [countryIndex, townshipIndex])

  // 當使用者改變的countryIndex, townshipIndex，使用onPostcodeChange回傳至父母元件
  useEffect(() => {
    if (postcode && postcode !== initPostcode) {
      onPostcodeChange(
        countries[countryIndex],
        townships[countryIndex][townshipIndex],
        postcode
      )
    }
  }, [postcode])
  //

  //------------談窗阻擋
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  //-----------------------------------其他資料
  const router = useRouter()
  const [deliveryMethod, setDeliveryMethod] = useState('home') //預設物流
  const [paymentMethod, setPaymentMethod] = useState('cod') //預設付款
  const [orderData, setOrderData] = useState({}) // 保存訂單資料

  //會員id
  const { auth } = useAuth()
  const userId = auth.userData.id

  //鉤子帶入金額跟數量
  const {
    pTotalPrice = 0,
    pTotalQty = 0,
    pOriginalTotalPrice,
  } = useCartProduct()
  const { wTotalPrice = 0, wTotalQty = 0 } = useCartWorkshop()
  //打折的價格
  const discountedPTotalPrice = pTotalPrice
  const discountedWTotalPrice = Math.floor(wTotalPrice * 0.95)
  //加入優惠券的部分
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [coupon, setCoupon] = useState(null)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const coupon = JSON.parse(localStorage.getItem('selectedCouponObj'))
      if (coupon && coupon.discount_value) {
        setCoupon(coupon)

        // 百分比折扣
        if (coupon.discount_value <= 1) {
          let PercentDiscount = Math.floor(pTotalPrice * coupon.discount_value)
          PercentDiscount = pTotalPrice - PercentDiscount
          setCouponDiscount(PercentDiscount)
          // console.log(PercentDiscount)
          // 固定金額折扣
        } else if (coupon.discount_value > 1) {
          setCouponDiscount(coupon.discount_value)
        }
      } else {
        // 若 coupon 不存在或沒有 discount_value
        setCoupon(null) // 清空 coupon 狀態
        setCouponDiscount(0) // 設置折扣為 0 或其他預設值
        localStorage.removeItem('selectedCouponObj')
      }
    }
  }, [])

  //計算總金額
  const totalPrice =
    discountedPTotalPrice + discountedWTotalPrice - couponDiscount

  // 使用 useRef 來存儲 input 值
  const recipientNameRef = useRef(null)
  const recipientPhoneRef = useRef(null)
  const recipientEmailRef = useRef(null)
  const recipientCityRef = useRef(null)
  const recipientDistrictRef = useRef(null)
  const recipientAddressRef = useRef(null)
  const sevenRecipientNameRef = useRef(null)
  const sevenRecipientPhoneRef = useRef(null)
  const sevenRecipientEmailRef = useRef(null)

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
    const recipientCity = countries[countryIndex]
    let recipientDistrict

    if (townshipIndex > 0) {
      recipientDistrict = townships[countryIndex][townshipIndex]
    } else {
      recipientDistrict = null
    }
    const recipientAddress = recipientAddressRef.current?.value
    const homeAdress = `${recipientCity}${recipientDistrict}${recipientAddress}`

    // 711
    const sevenRecipientName = sevenRecipientNameRef.current?.value
    const sevenRecipientPhone = sevenRecipientPhoneRef.current?.value
    const sevenRecipientEmail = sevenRecipientEmailRef.current?.value
    const store711Data = JSON.parse(localStorage.getItem('store711'))
    const storename = store711Data?.storename
    const storeaddress = store711Data?.storeaddress

    // 商品&課程資訊&金額
    const productCart = JSON.parse(localStorage.getItem('productCart'))
    const Workshopcart = JSON.parse(localStorage.getItem('Workshopcart'))

    if (deliveryMethod === '7-11') {
      const phoneRegex = /^09\d{8}$/
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (
        !sevenRecipientName ||
        !sevenRecipientPhone ||
        !sevenRecipientEmail ||
        !storename ||
        !storeaddress
      ) {
        setModalMessage('請完整填寫7-11寄送資訊')
        setShowModal(true)
        return
      }

      // 第二階段檢查：電話格式
      if (!phoneRegex.test(sevenRecipientPhone)) {
        setModalMessage('請輸入有效的手機號碼')
        setShowModal(true)
        return
      }

      // 第三階段檢查：Email格式
      if (!emailRegex.test(sevenRecipientEmail)) {
        setModalMessage('請輸入有效的電子信箱')
        setShowModal(true)
        return
      }
    } else {
      const phoneRegex = /^09\d{8}$/
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (
        !recipientName ||
        !recipientPhone ||
        !recipientEmail ||
        !recipientCity
      ) {
        setModalMessage('請完整填寫宅配寄送資訊')
        setShowModal(true)
        return
      }

      // 第二階段檢查：電話格式
      if (!phoneRegex.test(recipientPhone)) {
        setModalMessage('請輸入有效的手機號碼')
        setShowModal(true)
        return
      }

      // 第三階段檢查：Email格式
      if (!emailRegex.test(recipientEmail)) {
        setModalMessage('請輸入有效的電子信箱')
        setShowModal(true)
        return
      }
    }

    let orderData = {}
    if (deliveryMethod === '7-11') {
      orderData = {
        deliveryMethod,
        paymentMethod,
        sevenRecipientName,
        sevenRecipientPhone,
        sevenRecipientEmail,
        storename,
        storeaddress,
        productCart,
        Workshopcart,
        totalPrice,
        coupon,
        userId,
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
        coupon,
        userId,
      }
    }

    localStorage.setItem('orderData', JSON.stringify(orderData))
    router.push('/cart/order-check')
  }

  //------------渲染頁面
  return (
    <>
      <div className="container">
        {showModal && (
          <ModalConfirm
            title="填寫資料有誤"
            content={modalMessage} // 顯示對應的錯誤提示
            btnConfirm="確認"
            show={showModal}
            handleClose={() => setShowModal(false)} // 關閉彈窗
          />
        )}
        <div className={style.step}>
          <Image
            src="/cart/step2.svg"
            alt="Step1"
            width={1400}
            height={500}
            className="img-fluid d-none d-md-block"
          />
          <Image
            src="/cart/RWDstep.2.svg"
            alt="Step1"
            width={200}
            height={400}
            className="img-fluid d-md-none -block"
          />
        </div>
        {/* <TWZipCode /> */}
        <div className={style.outer}>
          <div className={style.list}>
            <div className={style.order}>
              <div className={`h5 ${style['order-topic']}`}>填寫訂購資料</div>
              <div className={style['order-box']}>
                <div className={style['order-info']}>
                  <OrderBox />
                </div>
                <div className={style.shipping}>
                  <Form className="p-3">
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <div className={`h5 ${style['shipping-topic']}`}>
                          配送方式 <span>*</span>
                        </div>
                      </Form.Label>
                      <Form.Check
                        className={`mb-3 ${style['method-topic']}`}
                        type="radio"
                        label="宅配"
                        name="deliveryMethod"
                        id="deliveryMethodhome"
                        value="home"
                        checked={deliveryMethod === 'home'}
                        onChange={() => handleDeliveryChange('home')}
                      />
                      <Form.Check
                        className={`${style['method-topic']}`}
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
                            className={style['form-input']}
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
                            className={style['form-input']}
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
                            className={style['form-input']}
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
                                className={style['form-input']}
                                name="recipient_city"
                                ref={recipientCityRef}
                                value={countryIndex}
                                onChange={(e) => {
                                  // 將字串轉成數字
                                  setCountryIndex(+e.target.value)
                                  // 重置townshipIndex的值
                                  setTownshipIndex(-1)
                                  // 重置postcode的值
                                  setPostcode('')
                                }}
                              >
                                <option value="-1">選擇縣市</option>
                                {countries.map((value, index) => (
                                  <option key={index} value={index}>
                                    {value}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId="recipient-district">
                              <Form.Label className="mt-3 mt-md-0">
                                區
                              </Form.Label>
                              <Form.Select
                                className={style['form-input']}
                                name="recipient_district"
                                ref={recipientDistrictRef}
                                value={townshipIndex}
                                onChange={(e) => {
                                  // 將字串轉成數字
                                  setTownshipIndex(+e.target.value)
                                }}
                              >
                                <option value="-1">選擇區域</option>
                                {countryIndex > -1 &&
                                  townships[countryIndex].map(
                                    (value, index) => (
                                      <option key={index} value={index}>
                                        {value}
                                      </option>
                                    )
                                  )}
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
                            className={style['form-input']}
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
                            className={style['form-input']}
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
                            className={style['form-input']}
                            type="text"
                            placeholder="例 : 0912345678"
                            name="seven_recipient_phone"
                            ref={sevenRecipientPhoneRef}
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="recipient-email"
                        >
                          <Form.Label>信箱</Form.Label>
                          <Form.Control
                            className={style['form-input']}
                            type="email"
                            placeholder="填寫信箱"
                            name="seven_recipient_email"
                            ref={sevenRecipientEmailRef}
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
                        className={`${style['method-topic']}`}
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
                        className={`${style['method-topic']}`}
                        type="radio"
                        id="ecPay"
                        name="payment"
                        label="信用卡"
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
                className={`justify-content-between d-xl-flex ${style['checkout_btn']}`}
              >
                <button
                  className="btn-primary"
                  onClick={() => router.push('/cart/')}
                >
                  返回
                </button>
                <button className="ms-2 btn-secondary" onClick={handleCheckout}>
                  前往結賬
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
