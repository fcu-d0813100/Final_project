import React, { useState, useEffect } from 'react'
import AdminLogin from '@/components/user/pages/admin-login'
import { AdminAuthProvider } from '@/hooks/use-admin'

const AdminLoginPage = () => {
  return (
    <AdminAuthProvider>
      <AdminLogin />
    </AdminAuthProvider>
  )
}

export default AdminLoginPage
