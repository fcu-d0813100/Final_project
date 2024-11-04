// import React, { useState, useEffect } from 'react'
// import { Form, Row, Col } from 'react-bootstrap'

// export default function Test(props) {
//   const [paymentMethod, setPaymentMethod] = useState('credit_card') // 預設付款方式為信用卡
//   const [cardNumber, setCardNumber] = useState('')
//   const [cardExpiry, setCardExpiry] = useState('')
//   const [cardCVC, setCardCVC] = useState('')
//   const handlePaymentChange = (event) => {
//     setPaymentMethod(event.target.value)
//   }

//   return (
//     <>
//       {/* 信用卡選項 */}
//       <div className="mb-3">
//         <Form.Check
//           type="radio"
//           id="credit_card"
//           name="payment"
//           label="信用卡"
//           value="credit_card"
//           checked={paymentMethod === 'credit_card'}
//           onChange={handlePaymentChange}
//         />
//       </div>
//       {/* 填寫信用卡資料 */}
//       {paymentMethod === 'credit_card' && (
//         <div className={style['credit-card']}>
//           <Form.Group className="mb-3">
//             <Form.Label htmlFor="card-number">信用卡卡號</Form.Label>
//             <Form.Control
//               type="text"
//               id="card-number"
//               name="card_number"
//               placeholder="0000 0000 0000 0000"
//               value={cardNumber}
//               onChange={(e) => setCardNumber(e.target.value)}
//             />
//           </Form.Group>
//           {/* 信用卡年月日 */}
//           <div className="mb-1">
//             <div className="row">
//               <div className="col-md-6 mb-2">
//                 <Form.Group>
//                   <Form.Label htmlFor="card-expiry">有效年月</Form.Label>
//                   <Form.Control
//                     type="text"
//                     id="card-expiry"
//                     name="card_expiry"
//                     placeholder="MM/YY"
//                     maxLength={5}
//                     value={cardExpiry}
//                     onChange={(e) => setCardExpiry(e.target.value)}
//                   />
//                 </Form.Group>
//               </div>
//               <div className="col-md-6">
//                 <Form.Group>
//                   <Form.Label htmlFor="card-cvc">CVC</Form.Label>
//                   <Form.Control
//                     type="text"
//                     id="card-cvc"
//                     name="card_cvc"
//                     placeholder="三位數安全碼"
//                     maxLength={3}
//                     value={cardCVC}
//                     onChange={(e) => setCardCVC(e.target.value)}
//                   />
//                 </Form.Group>
//               </div>
//             </div>
//           </div>
//           <p className="ps-phone mb-3">
//             注意事項：本公司採用TapPay
//             SSL交易系統，通過PCI-DSS國際信用卡組織Ｖisa、MasterCard等資料安全認證，以確保您的信用卡資料安全。
//           </p>
//         </div>
//       )}
//     </>
//   )
// }
