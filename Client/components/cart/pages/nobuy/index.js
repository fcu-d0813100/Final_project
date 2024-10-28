import React from 'react'
import style from './nobuy.module.scss'
import Link from 'next/link'
import ToggleContent from './common/ToggleContent'

export default function Nobuy() {
  return (
    <>
      <div className={style['bgc-img']}>
        <img src="/cart/nobuy.png" alt="bgc-pic" className="img-fluid" />
        <div className={style.msg}>
          <div className={style['msg-text']}>目前沒有商品</div>
          <Link href="/product">
            <button className={style['btn-women']}>前往購物</button>
          </Link>
        </div>
        <ToggleContent buttonLabel="查看訂單內容">
          <div>
            {/* 訂單細節內容 */}
            <h5>訂單詳細資訊</h5>
            {/* 更多內容 */}
          </div>
        </ToggleContent>

        <ToggleContent buttonLabel="查看運送資訊">
          <div>
            {/* 運送細節內容 */}
            <h5>運送方式和地址</h5>
            {/* 更多內容 */}
          </div>
        </ToggleContent>

        {/* 可以重複使用 */}
        <ToggleContent buttonLabel="查看付款資訊">
          <div>
            {/* 付款細節內容 */}
            <h5>付款方式和金額</h5>
            {/* 更多內容 */}
          </div>
        </ToggleContent>
      </div>
    </>
  )
}
