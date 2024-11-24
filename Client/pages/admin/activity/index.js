import React, { useState, useEffect } from 'react'
import ActivityAdmin from '@/components/activity/page/activity-Admin'

export default function Index(props) {
  return (
    <>
      <ActivityAdmin />
    </>
  )
}
Index.getLayout = function getLayout(page) {
  return <>{page}</> // 返回頁面內容，不套用任何布局
}
