import React, { useState, useEffect } from 'react'
import AdminSection from '@/components/admin/pages/admin-section'
import { AdminAuthProvider } from '@/hooks/use-admin'

const AdminLoginPage = () => {
  return (
    <>
      <AdminAuthProvider>
        <AdminSection />
      </AdminAuthProvider>
    </>
  )
}
export default AdminLoginPage
