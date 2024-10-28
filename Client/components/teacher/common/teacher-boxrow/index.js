'use client'

import React, { useState, useEffect } from 'react'
import TeacherBox from '@/components/teacher/common/teacher-boxrow/box'
import styles from '@/components/teacher/common/teachers.module.scss'

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
