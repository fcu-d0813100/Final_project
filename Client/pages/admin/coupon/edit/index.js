import React from 'react'
import AdminCouponEdit from '@/components/admin/pages/admin-coupon/edit'

const Index = (props) => {
  return (
    <>
      <AdminCouponEdit />
    </>
  )
}
// 設置不使用全局布局的 getLayout 方法
Index.getLayout = function getLayout(page) {
  return <>{page}</>  // 返回頁面內容，不套用任何布局
}

export default Index;
