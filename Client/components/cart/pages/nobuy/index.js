import React from 'react'
import style from './nobuy.module.scss'
import Link from 'next/link'

export default function Nobuy() {
  return (
    <>
      <div className={style['bgc-img']}>
        <img src="/cart/nobuy.png" alt="bgc-pic" className="img-fluid" />
        <div className={style.msg}>
          <div className={style['msg-text']}>目前沒有商品</div>
          <Link href="product/product-list">
            <button className={style['btn-women']}>前往購物</button>
          </Link>
        </div>
      </div>
    </>
  )
}
