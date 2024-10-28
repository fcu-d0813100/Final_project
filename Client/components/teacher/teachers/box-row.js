'use client'

import React, { useState, useEffect } from 'react'
import TeacherBox from '@/components/teacher/teachers/teacher-box.js'

export default function Boxrow(props) {
  return (
    <>
      <div className="d-flex justify-content-between">
        <TeacherBox />
        <TeacherBox />
        <TeacherBox />
        <TeacherBox />
      </div>
      <div className="d-flex justify-content-between">
        <TeacherBox />
        <TeacherBox />
        <TeacherBox />
        <TeacherBox />
      </div>
      <div className="d-flex justify-content-between">
        <TeacherBox />
        <TeacherBox />
        <TeacherBox />
        <TeacherBox />
      </div>
      <div className="d-flex justify-content-between">
        <TeacherBox />
        <TeacherBox />
        <TeacherBox />
        <TeacherBox />
      </div>
    </>
  )
}
