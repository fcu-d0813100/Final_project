import React, { useState, useEffect } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import 'bootstrap/dist/css/bootstrap.min.css'
import style from './order-box.module.scss'
import { useCartProduct } from '@/hooks/use-cartP'
import { useCartWorkshop } from '@/hooks/use-cartW'
import Image from 'next/image'

export default function OrderBox() {
  // 從use-cartP鉤子取得商品內容
  const { productItems = [], selectedCoupon } = useCartProduct()
  // 從use-cartW鉤子取得課程內容
  const { workshopItems = [] } = useCartWorkshop()

  // 取得商品圖片或課程圖片
  const firstProductImage =
    productItems.length > 0
      ? `/product/mainimage/${productItems[0].mainimage}`
      : null

  const firstWorkshopImage =
    workshopItems.length > 0
      ? `http://localhost:3005/workshop/${workshopItems[0].cover}`
      : null

  //優惠券折扣
  let discountValue = 1
  if (selectedCoupon && selectedCoupon.discount_value <= 1) {
    discountValue = selectedCoupon.discount_value
  }

  return (
    <div className={style['order-box']}>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header className={style['order-header']}>
            <div className={style['order-detail']}>
              <div>
                {firstProductImage ? (
                  <Image
                    src={firstProductImage}
                    alt="First Product Image"
                    width={120} // 設定圖片寬度
                    height={120} // 設定圖片高度
                  />
                ) : firstWorkshopImage ? (
                  <Image
                    src={firstWorkshopImage}
                    alt="First Workshop Image"
                    width={120} // 設定圖片寬度
                    height={120} // 設定圖片高度
                  />
                ) : (
                  <span>無圖片</span>
                )}
              </div>
              <div className={style['order-title']}>查看訂單</div>
            </div>
          </Accordion.Header>
          <Accordion.Body className={style['order-list']}>
            <div>
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
                  {/* 商品資料 */}
                  {productItems.map((v, i) => (
                    <tr key={i}>
                      <td>
                        <div className="text-danger ps">
                          {/* 如果有折扣，顯示提示文字 */}
                          {selectedCoupon &&
                            selectedCoupon.discount_value <= 1 && (
                              <span className={style['discount-text']}>
                                再享受 {selectedCoupon.discount_value * 100}%
                                折扣
                              </span>
                            )}
                        </div>
                        {v.product_name}
                      </td>
                      <td>{v.color_name}</td>
                      <td className={style['product-qty']}> {`${v.qty}`}</td>
                      <td>
                        {/* 顯示原價 */}
                        <span className={style['old-price']}>
                          NT${(v.originalprice * v.qty).toLocaleString()}
                        </span>
                        {/* 顯示打折後價格 */}
                        <br />
                        <span className={style['new-price']}>
                          NT$
                          {selectedCoupon && selectedCoupon.discount_value <= 1
                            ? Math.floor(
                                v.price * v.qty * discountValue
                              ).toLocaleString()
                            : (v.price * v.qty).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {/* 課程資料 */}
                  {workshopItems.map((v, i) => (
                    <tr key={i}>
                      <td>{v.name}</td>
                      <td>{`${v.date}  ${v.beginTime}-${v.endTime}`}</td>
                      <td>{v.qty}</td>
                      <td>
                        <span className={style['old-price']}>
                          NT${(v.price * v.qty).toLocaleString()}
                        </span>
                        <br />
                        <span className={style['new-price']}>
                          NT$
                          {Math.floor(v.price * v.qty * 0.95).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}
