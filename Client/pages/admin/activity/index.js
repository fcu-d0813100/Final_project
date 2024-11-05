import React, { useState, useEffect } from 'react'
import ActivityAdmin from '@/components/activity/page/activity-Admin'
import { AdminAuthProvider } from '@/hooks/use-admin'

export default function Index(props) {
  return (
    <>
      <AdminAuthProvider>
        <ActivityAdmin />
      </AdminAuthProvider>
    </>
  )
}
