import React, { useState, useEffect } from 'react'
import TeacherLogin from '@/components/user/pages/teacher-login'
import { TeacherAuthProvider } from '@/hooks/use-teacher-auth'

const TeacherLoginPage = () => {
  return (
    <TeacherAuthProvider>
      <TeacherLogin />
    </TeacherAuthProvider>
  )
}

export default TeacherLoginPage
