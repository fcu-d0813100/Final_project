import React, { useState, useEffect } from 'react'
import AdminLogin from '@/components/user/pages/admin-login'

const AdminLoginPage = () => {
  return <AdminLogin />
}
AdminLoginPage.getLayout = function getLayout(page) {
  return page
}
export default AdminLoginPage
