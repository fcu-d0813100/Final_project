import React, { useState } from 'react'
import CheckoutBox from '@/components/cart/common/checkoutbox/index'
import style from './checkout.module.scss'
import Image from 'next/image'
import { CaretUp, CaretDown } from '@phosphor-icons/react'
import { useRouter } from 'next/router'

export default function Checkout() {
  //按鈕路由
  const router = useRouter()

  //切換顯示訂單內容
  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => {
    setIsVisible((prev) => !prev)
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
            <form action="" method="post">
              {/* 查看訂單box */}

              <div className={style.order}>
                <div className={`h5 ${style['order-topic']}`}>填寫訂購資料</div>
                <div className={style['order-box']}>
                  <div className={style['order-content']}>
                    <div className={style.pic}>
                      <Image
                        src="/cart/LANCOME_LG01_M_888.webp"
                        alt="訂單主圖片"
                        width={100}
                        height={100}
                        className="img-fluid"
                      />
                    </div>
                    <div className={style.number}>
                      訂單編號：<span>A20241022</span>
                    </div>
                    <div className={style.content}>
                      <button type="button" onClick={toggleVisibility}>
                        查看訂單內容 {isVisible ? <CaretDown /> : <CaretUp />}
                      </button>
                    </div>
                  </div>
                  <div style={{ display: isVisible ? 'block' : 'none' }}>
                    {/* 訂單細節box */}
                    <div className={style['order-list']}>
                      <table>
                        <thead>
                          <tr>
                            <th>商品</th>
                            <th>內容</th>
                            <th>數量</th>
                            <th>價格</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>高級奢華訂製唇膏</td>
                            <td>春日私語</td>
                            <td>1</td>
                            <td>
                              <span className={style['old-price']}>
                                NT$1,200
                              </span>
                              <span className={style['new-price']}>NT$900</span>
                            </td>
                          </tr>
                          <tr>
                            <td>F19時尚攝影彩妝班</td>
                            <td>2024/10/3 (四) 9:00 - 12:00 | 3hr</td>
                            <td>2</td>
                            <td>NT$6,000</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* 配送方式 */}
                  <div className={style.shipping}>
                    <div className={`h5 ${style['shipping-topic']}`}>
                      配送方式
                    </div>
                    <div className="mb-3 ms-2">
                      <div
                        className={`d-flex justify-content-between mb-3 ${style['home_delivery']}`}
                      >
                        <div>
                          <input
                            type="radio"
                            id="home_delivery"
                            name="shipping"
                            defaultValue="宅配"
                            onclick="toggleLine()"
                          />
                          <label htmlFor="home_delivery">宅配</label>
                        </div>
                        <div className="ps">
                          <input
                            className={`me-1 ${style['form-check-input:checked']}`}
                            type="checkbox"
                            defaultValue=""
                            id="user"
                          />
                          <label htmlFor="user">同會員資料</label>
                        </div>
                      </div>

                      {/* 填寫宅配資料 */}
                      <div className="p-4">
                        <div className="mb-3">
                          <label
                            htmlFor="recipient-name"
                            className="form-label"
                          >
                            收件人
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="recipient-name"
                            name="recipient_name"
                            placeholder="填寫姓名"
                          />
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="recipient-phone"
                            className="form-label"
                          >
                            電話
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="recipient-phone"
                            name="recipient_phone"
                            placeholder="例 : 0912345678"
                          />
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="recipient-email"
                            className="form-label"
                          >
                            信箱
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="recipient-email"
                            name="recipient_email"
                            placeholder="填寫信箱"
                          />
                        </div>
                        {/* 縣市下拉選框 */}
                        <div className="delivery-details mb-3">
                          <div className="row">
                            <div className="col-md-6 mb-2">
                              <label
                                htmlFor="recipient-city"
                                className="form-label"
                              >
                                縣市
                              </label>
                              <select
                                className="form-select"
                                id="recipient-city"
                                name="recipient_city"
                              >
                                <option selected="">選擇縣市</option>
                                <option value="taipei">台北市</option>
                                <option value="taichung">台中市</option>
                                <option value="kaohsiung">高雄市</option>
                                <option value="taoyuan">桃園市</option>
                              </select>
                            </div>
                            <div className="col-md-6 mb-2">
                              <label
                                htmlFor="recipient-district"
                                className="form-label"
                              >
                                區
                              </label>
                              <select
                                className="form-select"
                                id="recipient-district"
                                name="recipient_district"
                              >
                                <option selected="">選擇區</option>
                                <option value="zhongzheng">中正區</option>
                                <option value="daan">大安區</option>
                                <option value="xinyi">信義區</option>
                                <option value="neihu">內湖區</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        {/* 居住地址 */}
                        <div className=" mb-3">
                          <label
                            htmlFor="recipient-address"
                            className="form-label"
                          >
                            居住地址
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="recipient-address"
                            name="recipient_address"
                            placeholder="填寫地址"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-2 ms-3">
                      <input
                        type="radio"
                        id="convenience_store"
                        name="shipping"
                        defaultValue="超商"
                      />
                      <label htmlFor="convenience_store">超商</label>
                    </div>
                  </div>
                  {/* 配送方式結束 */}

                  {/* 付款方式 */}
                  <div className={style.payment}>
                    <div className={`h5 ${style['payment-topic']}`}>
                      付款方式
                    </div>
                    {/* 信用卡選項 */}
                    <div className="mb-3 ms-3">
                      <input
                        type="radio"
                        id="credit_card"
                        name="payment"
                        defaultValue="信用卡"
                        onclick="toggleLine()"
                      />
                      <label htmlFor="credit_card">信用卡</label>
                    </div>
                    {/* 填寫信用卡資料 */}
                    <div className="p-4">
                      <div className="mb-3">
                        <label htmlFor="card-number" className="form-label">
                          信用卡卡號
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="card-number"
                          name="card_number"
                          placeholder="0000 0000 0000 0000"
                        />
                      </div>
                      {/* 信用卡年月日 */}
                      <div className="mb-1">
                        <div className="row">
                          <div className="col-md-6 mb-2">
                            <label htmlFor="card-expiry" className="form-label">
                              有效年月
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="card-expiry"
                              name="card_expiry"
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="card-cvc" className="form-label">
                              CVC
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="card-cvc"
                              name="card_cvc"
                              placeholder="三位數安全碼"
                              maxLength={3}
                            />
                          </div>
                        </div>
                      </div>
                      <p className="ps-phone mb-4">
                        注意事項：本公司採用TapPay
                        SSL交易系統，通過PCI-DSS國際信用卡組織Ｖisa、MasterCard等資料安全認證，以確保您的信用卡資料安全
                      </p>
                    </div>
                    {/* 其他付款選項 */}
                    <div className="mb-3 ms-3">
                      <input
                        type="radio"
                        id="cod"
                        name="payment"
                        defaultValue="貨到付款"
                      />
                      <label htmlFor="cod">貨到付款</label>
                    </div>
                    <div className="mb-3 ms-3">
                      <input
                        type="radio"
                        id="linepay"
                        name="payment"
                        defaultValue="LinePay"
                      />
                      <label htmlFor="linepay">Line Pay</label>
                    </div>
                    <div className="mb-4 ms-3">
                      <input
                        type="radio"
                        id="green_world"
                        name="payment"
                        defaultValue="綠界"
                      />
                      <label htmlFor="green_world">綠界</label>
                    </div>
                  </div>
                  {/* 付款方式結束 */}
                </div>
                {/* 填寫訂單box-end */}

                {/* 購買須知 */}
                <div className={style['buy-rule']}>
                  <p className="h6">Beautique官方網站購物須知 :</p>
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
                    6.請仔細閱讀並同意本條款後使用本服務。
                    <br />
                    感謝您的閱讀，祝您購物愉快!
                  </p>
                  <div>
                    <input
                      className="form-check-input me-1"
                      type="checkbox"
                      defaultValue=""
                      defaultChecked=""
                    />
                    <span> 我已閱讀並同意以上購買須知 </span>
                  </div>
                </div>
                {/* 結帳總計 */}
              </div>
            </form>
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
