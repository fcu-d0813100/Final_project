'use client'

import Sidebar from '@/components/teacher/common/t-dashboard-side-bar'
import TDashboardBN from '@/components/teacher/common/t-dashboard-bn'
import Page1 from '@/components/teacher/pages/information/page-1'
import Page2 from '@/components/teacher/pages/information/page-2'
import React, { useState, useEffect } from 'react'

export default function TeacherInformation(props) {
  const [isPage2, setIsPage2] = useState(false) // 控制是否顯示第二頁

  // 切換到下一頁並滾動到頂部
  const handleNextPage = () => {
    setIsPage2(true)
    window.scrollTo(0, 580)
  }

  // 回到前一頁並滾動到頂部
  const handlePreviousPage = () => {
    setIsPage2(false)
    window.scrollTo(0, 580)
  }

  return (
    <>
      <TDashboardBN />
      <div>
        <Sidebar />
        {!isPage2 ? (
          <Page1 onNextPage={handleNextPage} />
        ) : (
          <Page2 onPreviousPage={handlePreviousPage} />
        )}
      </div>
    </>
  )
}
