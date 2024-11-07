// pages/teacher/index.js
import TeacherInformation from '@/components/teacher/pages/information'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
export default function Index(props) {
  return (
    <>
      <TeacherInformation />
    </>
  )
}
