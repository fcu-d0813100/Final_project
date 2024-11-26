import React, { useState, useEffect } from 'react'
import ActivityUpload from '@/components/activity/page/activity-Upload/index'
export default function Index(props) {
  return (
    <>
      <ActivityUpload />
    </>
  )
}
Index.getLayout = function getLayout(page) {
  return <>{page}</> // 返回頁面內容，不套用任何布局
}