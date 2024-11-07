import React, { useState, useEffect } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import 'bootstrap/dist/css/bootstrap.min.css'
import style from './order-box.module.scss'
import { useCartProduct } from '@/hooks/use-cartP'
import { useCartWorkshop } from '@/hooks/use-cartW'
import Image from 'next/image'

export default function OrderBox() {
  // 從use-cartP鉤子取得商品內容
  const { productItems = [] } = useCartProduct()
  // 從use-cartW鉤子取得課程內容
  const { workshopItems = [] } = useCartWorkshop()

  // 取得商品圖片或課程圖片
  const firstProductImage =
    productItems.length > 0
      ? `/product/mainimage/${productItems[0].mainimage}`
      : null
  const firstWorkshopImage =
    workshopItems.length > 0
      ? `/workshop/workshop_img/${workshopItems[0].typeId}-${workshopItems[0].id}-c.jpg`
      : null

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
                    width={140} // 設定圖片寬度
                    height={140} // 設定圖片高度
                  />
                ) : firstWorkshopImage ? (
                  <Image
                    src={firstWorkshopImage}
                    alt="First Workshop Image"
                    width={100} // 設定圖片寬度
                    height={100} // 設定圖片高度
                  />
                ) : (
                  <span>無圖片</span>
                )}
              </div>
              <div className="h5 p-2">查看訂單</div>
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
                      <td>{v.color_name}</td>
                      <td>{v.qty}</td>
                      <td>
                        <span className={style['old-price']}>
                          NT${(v.originalprice * v.qty).toLocaleString()}
                        </span>
                        <span className={style['new-price']}>
                          NT${(v.price * v.qty).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {/* 課程資料 */}
                  {workshopItems.map((v, i) => (
                    <tr key={i}>
                      <td>{v.name}</td>
                      <td>{v.date}</td>
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
                </tbody>
              </table>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}
