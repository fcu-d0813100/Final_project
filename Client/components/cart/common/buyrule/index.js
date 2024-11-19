import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import style from './buy-rule.module.scss'

export default function BuyRule(props) {
  // 預設為未勾選
  const [isChecked, setIsChecked] = useState(true)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked) // 切換勾選狀態
  }

  return (
    <>
      <div className={style['buy-rule']}>
        <p className={style['buy-rule-topic']}>Beautique官方網站購物須知 :</p>
        <p>
          1.
          訂單確認後，我們會於1-3個工作日內進行處理並安排出貨。如有課程預訂，我們將於預訂後發送課程確認信。
          <br />
          2. 訂單成立後將無法變更，請依照需求下單。 <br />
          3.
          課程則為線下授課，詳細地點與時間將依您選擇的課程而定，下單前請詳閱課程須知。
          <br />
          4. 若遇缺貨或商品無法出貨，客服人員將電話聯繫說明。
          <br />
          5. 恕不接受海外信用卡。
          <br />
          6. 已領取的優惠券僅能對彩妝商品使用(限一次)。
          <br />
          7. 請仔細閱讀並同意本條款後使用本服務。
          <br />
          感謝您的閱讀，祝您購物愉快!
        </p>
        <div>
          <Form.Check
            className={style['buy-rule-checkbox']}
            type="checkbox"
            label="我同意以上條款與條件"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        </div>
      </div>
    </>
  )
}
