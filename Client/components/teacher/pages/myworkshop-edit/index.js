'use client'
import Sidebar from '@/components/teacher/common/t-dashboard-side-bar'
import TDashboardBN from '@/components/teacher/common/t-dashboard-bn'
import Page1 from '@/components/teacher/pages/upload/page-1'
import Page2 from '@/components/teacher/pages/upload/page-2'
import React, { useState, useEffect } from 'react'

export default function Upload(props) {
  const [isPage2, setIsPage2] = useState(false) // 控制是否顯示第二頁

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

        {!isPage2 ? (
          <Page1 onNextPage={handleNextPage} /> // 傳入切換頁面函數
        ) : (
          <Page2 onPreviousPage={handlePreviousPage} /> // 傳入返回頁面函數
        )}
      </div>
    </>
  )
}
