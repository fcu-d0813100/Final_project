import React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import 'bootstrap/dist/css/bootstrap.min.css'
import style from './order-box.module.scss'
import { useCartProduct } from '@/hooks/use-cartP'
import Image from 'next/image'

export default function OrderBox() {
  // 從use-cartP鉤子取得商品內容
  const { productItems = [], pTotalPrice = 0, pTotalQty = 0 } = useCartProduct()
  console.log(productItems)
  return (
    <div className={style['order-box']}>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header className={style['order-header']}>
            <div className={style['order-detail']}>
              <div>圖片</div>
              <div>訂單編號：11011124</div>
              <div>查看訂單</div>
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
                      <td>{v.product_name}</td>
                      <td>{v.color}</td>
                      <td>{v.qty}</td>
                      <td>
                        <span className={style['old-price']}>
                          NT${(v.price * v.qty).toLocaleString()}
                        </span>
                        <span className={style['new-price']}>
                          NT${(v.price * v.qty * 0.8).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {/* 課程資料 */}
                  <tr>
                    <td>F19時尚攝影彩妝班</td>
                    <td>2024/10/3 (四) 9:00 - 12:00 | 3hr</td>
                    <td>2</td>
                    <td>NT$6,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}
