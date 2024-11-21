import React, { useEffect, useState } from 'react'
import style from './order-success.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router' // 引入 useRouter 來進行導航
import { useCartProduct } from '@/hooks/use-cartP'
import { useCartWorkshop } from '@/hooks/use-cartW'

export default function OrderSuccess() {
  const [orderNumber, setOrderNumber] = useState('')
  const router = useRouter() // 使用 useRouter 來處理導航

  //-----------------------清空產品狀態
  const { onClearProduct = () => {} } = useCartProduct()
  const { onClearWorkshop = () => {} } = useCartWorkshop()

  //-----------訂單完成寄信
  const sendEmail = async () => {
    const storedOrderNumber = localStorage.getItem('orderNumber')
    try {
      // 把訂單編號帶入到 URL 查詢參數中
      const response = await fetch(
        `http://localhost:3005/api/cart/send?orderNumber=${storedOrderNumber}`,
        {
          method: 'GET',
        }
      )

      const data = await response.json()

      if (data.status === 'success') {
        // alert('Email 已成功發送！')
        console.log('發送成功')
      } else {
        alert('Email 發送失敗：' + data.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('發生錯誤，無法發送郵件')
    }
  }

  useEffect(() => {
    sendEmail()
  }, [])

  // -----------------------從 localStorage 獲取訂單編號
  useEffect(() => {
    const storedOrderNumber = localStorage.getItem('orderNumber')
    onClearProduct()
    onClearWorkshop()
    if (storedOrderNumber) {
      setOrderNumber(storedOrderNumber)
      // 清理 localStorage 所有紀錄
      localStorage.clear()
    } else {
      // 如果沒有訂單編號，重定向到首頁
      router.push('/')
    }
  }, [router]) // 在 useEffect 中加入 router 以觸發導航

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
          <Link href="/user/order">
            <button className={style['btn-women']}>查看訂單</button>
          </Link>
        </div>
      </div>
    </>
  )
}
