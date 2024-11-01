import React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import style from './order-box.module.scss'
import Image from 'next/image'

export default function OrderBox() {
  return (
    <>
      <Accordion>
        <Accordion.Item className={`${style['order']} ${style['order-header']}`} eventKey="0">
          <Accordion.Header className={style['order-header']}>
            <div className={style['order-header']}>
              <h5>訂單細節</h5>
              <h6> 查看訂單</h6>
            </div>
            {/* <div className={style['order-content']}>
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
              <div className={style.content}></div>
            </div> */}
          </Accordion.Header>
          <Accordion.Body>
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
                      <span className={style['old-price']}>NT$1,200</span>
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
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  )
}
