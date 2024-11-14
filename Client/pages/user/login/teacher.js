import React, { useState, useEffect } from 'react'
import TeacherLogin from '@/components/user/pages/teacher-login'

const TeacherLoginPage = () => {
  return <TeacherLogin />
}
TeacherLoginPage.getLayout = function getLayout(page) {
  return page
}
export default TeacherLoginPage
