// pages/teacher/index.js
import TeacherInformation from '@/components/teacher/pages/information'
import React, { useState, useEffect } from 'react'
import { TeacherAuthProvider } from '@/hooks/use-teacher-auth'

export default function Index(props) {
  return (
    <>
      <TeacherAuthProvider>
        <TeacherInformation />
      </TeacherAuthProvider>
    </>
  )
}
