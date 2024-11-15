'use client'
import { useRouter } from 'next/router'
import Sidebar from '@/components/teacher/common/t-dashboard-side-bar'
import TDashboardBN from '@/components/teacher/common/t-dashboard-bn'
import Page1 from '@/components/teacher/pages/myworkshop-edit/page-1'
import Page2 from '@/components/teacher/pages/myworkshop-edit/page-2'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'

export default function WorkshopEdit(props) {
  const router = useRouter() // 使用 Next.js 的 useRouter hook 來進行頁面跳轉
  const [isPage2, setIsPage2] = useState(false) // 控制是否顯示第二頁
  const [timeSchedule, setTimeSchedule] = useState([])
  const [workshop, setWorkshop] = useState({
    name: '',
    price: '',
    address: '',
    registration_start: '',
    registration_end: '',
    workshop_type_id: '',
    description: '',
    outline: '',
    notes: '',
    img_cover: '',
    img_lg: '',
    img_sm01: '',
    img_sm02: '',
  })
  //----------------------------------------------
  const fetchData = async (wid) => {
    try {
      const response = await fetch(`http://localhost:3005/api/workshop/${wid}`)
      if (!response.ok) {
        throw new Error('網路回應不成功：' + response.status)
      }
      const data = await response.json()
      setWorkshop(...data)
      console.log(...data)
    } catch (err) {
      console.log(err)
    }
  }

  // 用useEffect監聽router.isReady變動
  useEffect(() => {
    if (router.isReady) {
      fetchData(router.query.wid)
    }
  }, [router.isReady])

  useEffect(() => {
    // 當頁面一加載，滾動到指定位置
    window.scrollTo(0, 580)
  }, [])

  //----------------------------------------------
  const handleSubmitUpdateSave = async (e) => {
    e.preventDefault()
    const form = new FormData()

    // 其餘表單資料
    Object.keys(workshop).forEach((key) => {
      form.append(key, workshop[key])
    })

    // 加入 timeSchedule 資料
    timeSchedule.forEach((time, index) => {
      form.append(`timeSchedule[${index}]`, JSON.stringify(time))
    })

    try {
      const response = await fetch(
        'http://localhost:3005/api/workshop/edit/save',
        {
          credentials: 'include',
          method: 'PUT',
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
    router.push('/teacher/myworkshop')
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
      <TDashboardBN />

      <div>
        <Sidebar />
        <form method="post" encType="multipart/form-data">
          {!isPage2 ? (
            <Page1
              onNextPage={handleNextPage}
              workshop={workshop}
              setWorkshop={setWorkshop}
              timeSchedule={timeSchedule}
              setTimeSchedule={setTimeSchedule}
              handleSave={handleSubmitUpdateSave}
            /> // 傳入切換頁面函數
          ) : (
            <Page2
              onPreviousPage={handlePreviousPage}
              handleSave={handleSubmitUpdateSave}
              setWorkshop={setWorkshop}
              workshop={workshop}
            /> // 傳入返回頁面函數
          )}
        </form>
      </div>
    </>
  )
}
