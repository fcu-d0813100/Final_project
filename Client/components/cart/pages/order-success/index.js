import React, { useEffect, useState } from 'react'
import style from './order-success.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router' // 引入 useRouter 來進行導航

export default function OrderSuccess() {
  const [orderNumber, setOrderNumber] = useState('')
  const router = useRouter() // 使用 useRouter 來處理導航

  // -----------------------從 localStorage 獲取訂單編號
  useEffect(() => {
    const storedOrderNumber = localStorage.getItem('orderNumber')
    if (storedOrderNumber) {
      setOrderNumber(storedOrderNumber)
      // 清理 localStorage 所有紀錄
      localStorage.clear()
    } else {
      // 如果沒有訂單編號，重定向到首頁
      router.push('/')
    }
  }, [router]) // 在 useEffect 中加入 router 以觸發導航

  // useEffect(() => {
  //   const storedOrderNumber = localStorage.getItem('orderNumber')
  //   if (storedOrderNumber) {
  //     setOrderNumber(storedOrderNumber)
  //     //清理localStorage所有紀錄
  //     localStorage.clear()
  //   }
  // }, [])

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
