import React, { useState, useEffect } from 'react'
import Landing from '@/components/home/common/landing'

const Index = (props) => {
  return (
    <>
      <Landing />
    </>
  )
}

// 設置不使用全局布局的 getLayout 方法
Index.getLayout = function getLayout(page) {
  return <>{page}</> // 返回頁面內容，不套用任何布局
}

export default Index
