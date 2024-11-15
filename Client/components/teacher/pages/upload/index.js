'use client'
import { useRouter } from 'next/router'
import Sidebar from '@/components/teacher/common/t-dashboard-side-bar'
import TDashboardBN from '@/components/teacher/common/t-dashboard-bn'
import Page1 from '@/components/teacher/pages/upload/page-1'
import Page2 from '@/components/teacher/pages/upload/page-2'
import React, { useState, useEffect } from 'react'

export default function Upload(props) {
  const router = useRouter() // 使用 Next.js 的 useRouter hook 來進行頁面跳轉
  const [isPage2, setIsPage2] = useState(false) // 控制是否顯示第二頁
  const [timeSchedule, setTimeSchedule] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    address: '',
    registration_start: '',
    registration_end: '',
    description: '',
    outline: '',
    notes: '',
    img_cover: '',
    img_lg: '',
    img_sm01: '',
    img_sm02: '',
  })
  useEffect(() => {
    // 當頁面一加載，滾動到指定位置
    window.scrollTo(0, 580)
  }, [])
  //----------------------------------------------
  const handleSubmitisUpload0 = async (e) => {
    e.preventDefault()
    const form = new FormData()

    // 其餘表單資料
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key])
    })

    // 加入 timeSchedule 資料
    timeSchedule.forEach((time, index) => {
      form.append(`timeSchedule[${index}]`, JSON.stringify(time))
    })

    try {
      const response = await fetch(
        'http://localhost:3005/api/workshop/upload/isUpload0',
        {
          credentials: 'include',
          method: 'POST',
          body: form, // 直接將 FormData 傳送
        }
      )

      if (!response.ok) {
        throw new Error('上傳資料失敗')
      }

      const result = await response.json()
      console.log('上傳成功', result)
    } catch (error) {
      console.error('上傳失敗', error)
    }
  }
  //----------------------------------------------
  const handleSubmitisUpload1 = async (e) => {
    e.preventDefault()
    const form = new FormData()

    // 其餘表單資料
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key])
    })

    // 加入 timeSchedule 資料
    timeSchedule.forEach((time, index) => {
      form.append(`timeSchedule[${index}]`, JSON.stringify(time))
    })

    try {
      const response = await fetch(
        'http://localhost:3005/api/workshop/upload/isUpload1',
        {
          credentials: 'include',
          method: 'POST',
          body: form, // 直接將 FormData 傳送
        }
      )

      if (!response.ok) {
        throw new Error('上傳資料失敗')
      }

      const result = await response.json()
      console.log('上傳成功', result)
    } catch (error) {
      console.error('上傳失敗', error)
    }
  }
  //----------------------------------------------
  // 儲存按鈕的處理函數，送出資料並重定向到 /teacher/myworkshop
  const handleSave = async (e, uploadType) => {
    if (uploadType === 0) {
      await handleSubmitisUpload0(e) // 儲存時執行 handleSubmitisUpload0
    } else if (uploadType === 1) {
      await handleSubmitisUpload1(e) // 發布時執行 handleSubmitisUpload1
    }
    router.push('/teacher/myworkshop') // 送出後跳轉
  }

  // 切換到下一頁並滾動到頂部
  const handleNextPage = () => {
    setIsPage2(true)
    window.scrollTo(0, 580) // 滾動到頁面頂部
  }

  // 回到前一頁並滾動到頂部
  const handlePreviousPage = () => {
    setIsPage2(false)
    window.scrollTo(0, 580) // 滾動到頁面頂部
  }

  return (
    <>
      <TDashboardBN teacher="Gina Bettelli" />

      <div>
        <Sidebar />
        <form method="post" encType="multipart/form-data">
          {!isPage2 ? (
            <Page1
              onNextPage={handleNextPage}
              formData={formData}
              setFormData={setFormData}
              timeSchedule={timeSchedule}
              setTimeSchedule={setTimeSchedule}
              handleSave={handleSave}
            /> // 傳入切換頁面函數
          ) : (
            <Page2
              onPreviousPage={handlePreviousPage}
              handleSave={handleSave}
              setFormData={setFormData}
            /> // 傳入返回頁面函數
          )}
        </form>
      </div>
    </>
  )
}
