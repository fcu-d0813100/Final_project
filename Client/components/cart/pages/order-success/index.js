import React, { useEffect, useState } from 'react'
import style from './order-success.module.scss'
import Link from 'next/link'

export default function OrderSuccess() {
  const [orderNumber, setOrderNumber] = useState('')

  // -----------------------從 localStorage 獲取訂單編號
  useEffect(() => {
    const storedOrderNumber = localStorage.getItem('orderNumber')
    if (storedOrderNumber) {
      setOrderNumber(storedOrderNumber)
      //清理localStorage所有紀錄
      localStorage.clear()
    }
  }, [])

  return (
    <>
      <div className={style['bgc-img']}>
        <img src="/cart/nobuy.png" alt="bgc-pic" className="img-fluid" />
        <div className={style.msg}>
          <div className={`h3-L ${style['msg-en']}`}>Thank You !</div>
          <div className={style['msg-text']}>
            <div>感謝您的訂購！</div>
            <div>訂單編號：{orderNumber}</div>
          </div>
          <Link href="/user">
            <button className={style['btn-women']}>查看訂單</button>
          </Link>
        </div>
      </div>
    </>
  )
}
