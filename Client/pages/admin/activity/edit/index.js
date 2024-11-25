import React, { useState, useEffect } from 'react'
import ActivityEdit from '@/components/activity/page/activity-Edit/index'
export default function Index(props) {
  return (
    <>
      <ActivityEdit/>
    </>
  )
}
Index.getLayout = function getLayout(page) {
  return <>{page}</> // 返回頁面內容，不套用任何布局
}