// 產生訂單------1106備份

// import React, { useState, useEffect } from 'react'
// import CheckoutBox from '@/components/cart/common/checkoutbox/index'
// import style from './checkout.module.scss'
// import Image from 'next/image'
// import { Form, Row, Col } from 'react-bootstrap'
// import { useRouter } from 'next/router'
// import BuyRule from '../../common/buyrule'
// import OrderBox from '../../common/orderbox'
// import Seven from '../../../../pages/cart/ship'
// import { useCartProduct } from '@/hooks/use-cartP'
// import { useCartWorkshop } from '@/hooks/use-cartW'
// import axios from 'axios'

// export default function Checkout() {
//   const router = useRouter()

//   //鉤子帶入金額跟數量
//   const { pTotalPrice = 0, pTotalQty = 0 } = useCartProduct()
//   const { wTotalPrice = 0, wTotalQty = 0 } = useCartWorkshop()
//   //打折的價格
//   const discountedPTotalPrice = pTotalPrice * 0.8
//   const discountedWTotalPrice = wTotalPrice * 0.8
//   const totalDiscountPrice = discountedPTotalPrice + discountedWTotalPrice

//   //----------物流
//   const [deliveryMethod, setDeliveryMethod] = useState('home') // 預設選擇宅配

//   //----------付款方式
//   const [paymentMethod, setPaymentMethod] = useState('cod') // 預設付款方式為貨到付款

//   // 在組件加載時從 localStorage 獲取值
//   useEffect(() => {
//     const savedDeliveryMethod = localStorage.getItem('deliveryMethod')
//     const savedPaymentMethod = localStorage.getItem('paymentMethod')

//     if (savedDeliveryMethod) {
//       setDeliveryMethod(savedDeliveryMethod)
//     }
//     if (savedPaymentMethod) {
//       setPaymentMethod(savedPaymentMethod)
//     }

//     // 檢查 URL 中是否有 deliveryMethod 查詢參數(711的)
//     if (router.query.deliveryMethod) {
//       router.replace(router.pathname, undefined, { shallow: true })
//     }
//   }, [router.query])

//   // 儲存到 localStorage
//   const handleDeliveryChange = (method) => {
//     setDeliveryMethod(method)
//     localStorage.setItem('deliveryMethod', method)
//   }
//   // 儲存到 localStorage
//   const handlePaymentChange = (event) => {
//     const method = event.target.value
//     setPaymentMethod(method)
//     localStorage.setItem('paymentMethod', method)
//   }

//   //------------送出預設訂單

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

//     // 根據付款方式進行處理
//     if (paymentMethod === 'cod') {
//       orderData.paymentMethod = 1
//       // 直接插入訂單到資料庫
//       try {
//         const response = await axios.post(
//           'http://localhost:3005/api/cart/checkout',
//           orderData
//         )
//         console.log(orderData)
//         console.log('訂單已成功提交', response.data)
//         // 可以在此添加成功後的操作，比如重定向或顯示提示
//       } catch (error) {
//         console.error('提交訂單失敗', error)
//       }
//     } else if (paymentMethod === 'ecPay') {
//       orderData.paymentMethod = 2
//       // 在此處理串接金流的邏輯
//       // 可能需要引導用戶到支付頁面
//       console.log('請求綠界支付...')
//     }
//   }

//   //------------送出預設訂單

//   return (
//     <>
//       <div className="container">
//         <div className={style.step}>
//           <Image
//             src="/cart/step2.svg"
//             alt="Step2"
//             width={1400}
//             height={300}
//             className="img-fluid d-none d-lg-block"
//           />
//         </div>
//         <div className={style.outer}>
//           <div className={style.list}>
//             <div className={style.order}>
//               <div className={`h5 ${style['order-topic']}`}>填寫訂購資料</div>
//               <div className={style['order-box']}>
//                 <OrderBox />
//                 <div className={style.shipping}>
//                   <Form className="p-4">
//                     <Form.Group className="mb-3">
//                       <Form.Label>
//                         <div className={`h5 ${style['shipping-topic']}`}>
//                           配送方式 <span>*</span>
//                         </div>
//                       </Form.Label>
//                       <Form.Check
//                         className="mb-3"
//                         type="radio"
//                         label="宅配"
//                         name="deliveryMethod"
//                         id="deliveryMethodhome"
//                         value="home"
//                         checked={deliveryMethod === 'home'}
//                         onChange={() => handleDeliveryChange('home')}
//                       />
//                       <Form.Check
//                         type="radio"
//                         label="7-11"
//                         name="deliveryMethod"
//                         id="deliveryMethod7-11"
//                         value="7-11"
//                         checked={deliveryMethod === '7-11'}
//                         onChange={() => handleDeliveryChange('7-11')}
//                       />
//                     </Form.Group>

//                     {deliveryMethod === 'home' ? (
//                       <div className={style['shipping-form']}>
//                         {/* 宅配資料表單 */}
//                         <Form.Group className="mb-3" controlId="recipient-name">
//                           <Form.Label>收件人</Form.Label>
//                           <Form.Control
//                             type="text"
//                             placeholder="填寫姓名"
//                             name="recipient_name"
//                           />
//                         </Form.Group>

//                         <Form.Group
//                           className="mb-3"
//                           controlId="recipient-phone"
//                         >
//                           <Form.Label>電話</Form.Label>
//                           <Form.Control
//                             type="text"
//                             placeholder="例 : 0912345678"
//                             name="recipient_phone"
//                           />
//                         </Form.Group>

//                         <Form.Group
//                           className="mb-3"
//                           controlId="recipient-email"
//                         >
//                           <Form.Label>信箱</Form.Label>
//                           <Form.Control
//                             type="email"
//                             placeholder="填寫信箱"
//                             name="recipient_email"
//                           />
//                         </Form.Group>

//                         <Row className="mb-3">
//                           <Col md={6}>
//                             <Form.Group controlId="recipient-city">
//                               <Form.Label>縣市</Form.Label>
//                               <Form.Select name="recipient_city">
//                                 <option value="" disabled selected>
//                                   選擇縣市
//                                 </option>
//                                 <option value="台北市">台北市</option>
//                                 <option value="台中市">台中市</option>
//                                 <option value="高雄市">高雄市</option>
//                                 <option value="桃園市">桃園市</option>
//                               </Form.Select>
//                             </Form.Group>
//                           </Col>
//                           <Col md={6}>
//                             <Form.Group controlId="recipient-district">
//                               <Form.Label>區</Form.Label>
//                               <Form.Select name="recipient_district">
//                                 <option value="" disabled selected>
//                                   選擇區
//                                 </option>
//                                 <option value="中正區">中正區</option>
//                                 <option value="大安區">大安區</option>
//                                 <option value="信義區">信義區</option>
//                                 <option value="內湖區">內湖區</option>
//                               </Form.Select>
//                             </Form.Group>
//                           </Col>
//                         </Row>

//                         <Form.Group
//                           className="mb-3"
//                           controlId="recipient-address"
//                         >
//                           <Form.Label>居住地址</Form.Label>
//                           <Form.Control
//                             type="text"
//                             placeholder="填寫地址"
//                             name="recipient_address"
//                           />
//                         </Form.Group>
//                       </div>
//                     ) : (
//                       <div className={style['shipping-form']}>
//                         <Seven />
//                       </div>
//                     )}
//                   </Form>
//                 </div>

//                 <Form className="p-4">
//                   <div className={style.payment}>
//                     <div className={`h5 ${style['payment-topic']}`}>
//                       付款方式 <span>*</span>
//                     </div>
//                     <div className="mb-3">
//                       <Form.Check
//                         type="radio"
//                         id="cod"
//                         name="payment"
//                         label="貨到付款"
//                         value="cod"
//                         checked={paymentMethod === 'cod'}
//                         onChange={handlePaymentChange}
//                       />
//                     </div>
//                     <div className="mb-4">
//                       <Form.Check
//                         type="radio"
//                         id="ecPay"
//                         name="payment"
//                         label="綠界"
//                         value="ecPay"
//                         checked={paymentMethod === 'ecPay'}
//                         onChange={handlePaymentChange}
//                       />
//                     </div>
//                   </div>
//                 </Form>
//               </div>
//               <BuyRule />
//             </div>
//           </div>

//           <div className={style.checkout}>
//             <div className={style.sticky}>
//               <CheckoutBox />
//               <div
//                 className={`justify-content-between d-xl-flex d-none ${style['checkout_btn']}`}
//               >
//                 <button
//                   className="btn-primary"
//                   onClick={() => router.push('/cart/')}
//                 >
//                   返回
//                 </button>
//                 <button className="ms-2 btn-secondary" onClick={handleCheckout}>
//                   結賬
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }