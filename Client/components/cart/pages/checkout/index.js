import React, { useState } from 'react'
import CheckoutBox from '@/components/cart/common/checkoutbox/index'
import style from './checkout.module.scss'
import Image from 'next/image'
import { Form, Row, Col } from 'react-bootstrap'
import { useRouter } from 'next/router'
import BuyRule from '../../common/buyrule'
import OrderBox from '../../common/orderbox'
import Seven from '../../../../pages/cart/ship'

export default function Checkout() {
  //----------按鈕路由
  const router = useRouter()

  //----------物流
  const [deliveryMethod, setDeliveryMethod] = useState('宅配') // 預設選擇宅配

  //----------付款方式
  const [paymentMethod, setPaymentMethod] = useState('credit_card') // 預設付款方式為信用卡
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCVC, setCardCVC] = useState('')

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value)
  }

  return (
    <>
      <div className="container">
        {/* 步驟圖片 */}
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
          {/* 填寫訂單box */}
          <div className={style.list}>
            {/* 以下為表單(配送&付款方式) */}

            {/* 查看訂單box */}
            <div className={style.order}>
              <div className={`h5 ${style['order-topic']}`}>填寫訂購資料</div>
              <div className={style['order-box']}>
                <OrderBox />
                {/* 配送方式 */}
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
                        id="deliveryMethod宅配"
                        value="宅配"
                        checked={deliveryMethod === '宅配'}
                        onChange={() => setDeliveryMethod('宅配')}
                      />
                      <Form.Check
                        type="radio"
                        label="7-11"
                        name="deliveryMethod"
                        id="deliveryMethod7-11"
                        value="7-11"
                        checked={deliveryMethod === '7-11'}
                        onChange={() => setDeliveryMethod('7-11')}
                      />
                    </Form.Group>

                    {/* 根據選擇的配送方式顯示不同的表單內容 */}
                    {deliveryMethod === '宅配' ? (
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
                                <option value="taipei">台北市</option>
                                <option value="taichung">台中市</option>
                                <option value="kaohsiung">高雄市</option>
                                <option value="taoyuan">桃園市</option>
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
                                <option value="zhongzheng">中正區</option>
                                <option value="daan">大安區</option>
                                <option value="xinyi">信義區</option>
                                <option value="neihu">內湖區</option>
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
                        {/* 超商店名選擇 */}
                        <Seven />
                      </div>
                    )}
                  </Form>
                </div>
                {/* 配送方式結束 */}

                {/* 付款方式 */}
                <Form className="p-4">
                  {/* 付款方式 */}
                  <div className={style.payment}>
                    <div className={`h5 ${style['payment-topic']}`}>
                      付款方式 <span>*</span>
                    </div>
                    {/* 信用卡選項 */}
                    <div className="mb-3">
                      <Form.Check
                        type="radio"
                        id="credit_card"
                        name="payment"
                        label="信用卡"
                        value="credit_card"
                        checked={paymentMethod === 'credit_card'}
                        onChange={handlePaymentChange}
                      />
                    </div>
                    {/* 填寫信用卡資料 */}
                    {paymentMethod === 'credit_card' && (
                      <div className={style['credit-card']}>
                        <Form.Group className="mb-3">
                          <Form.Label htmlFor="card-number">
                            信用卡卡號
                          </Form.Label>
                          <Form.Control
                            type="text"
                            id="card-number"
                            name="card_number"
                            placeholder="0000 0000 0000 0000"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                          />
                        </Form.Group>
                        {/* 信用卡年月日 */}
                        <div className="mb-1">
                          <div className="row">
                            <div className="col-md-6 mb-2">
                              <Form.Group>
                                <Form.Label htmlFor="card-expiry">
                                  有效年月
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  id="card-expiry"
                                  name="card_expiry"
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  value={cardExpiry}
                                  onChange={(e) =>
                                    setCardExpiry(e.target.value)
                                  }
                                />
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group>
                                <Form.Label htmlFor="card-cvc">CVC</Form.Label>
                                <Form.Control
                                  type="text"
                                  id="card-cvc"
                                  name="card_cvc"
                                  placeholder="三位數安全碼"
                                  maxLength={3}
                                  value={cardCVC}
                                  onChange={(e) => setCardCVC(e.target.value)}
                                />
                              </Form.Group>
                            </div>
                          </div>
                        </div>
                        <p className="ps-phone mb-3">
                          注意事項：本公司採用TapPay
                          SSL交易系統，通過PCI-DSS國際信用卡組織Ｖisa、MasterCard等資料安全認證，以確保您的信用卡資料安全。
                        </p>
                      </div>
                    )}
                    {/* 其他付款選項 */}
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
                    <div className="mb-3">
                      <Form.Check
                        type="radio"
                        id="linepay"
                        name="payment"
                        label="Line Pay"
                        value="linepay"
                        checked={paymentMethod === 'linepay'}
                        onChange={handlePaymentChange}
                      />
                    </div>
                    <div className="mb-4">
                      <Form.Check
                        type="radio"
                        id="green_world"
                        name="payment"
                        label="綠界"
                        value="green_world"
                        checked={paymentMethod === 'green_world'}
                        onChange={handlePaymentChange}
                      />
                    </div>
                  </div>
                </Form>
                {/* 付款方式結束 */}
              </div>
              {/* 填寫訂單box-end */}
              {/* 購買須知 */}
              <BuyRule />
              {/* 結帳總計 */}
            </div>
          </div>

          {/* 總計box */}
          <div className={style.checkout}>
            <div className={style.sticky}>
              <CheckoutBox />
              <div
                className={` justify-content-between d-xl-flex d-none ${style['checkout_btn']}`}
              >
                <button className="btn-primary" onClick={() => router.back()}>
                  返回
                </button>
                <button className="ms-2 btn-secondary">結賬</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
