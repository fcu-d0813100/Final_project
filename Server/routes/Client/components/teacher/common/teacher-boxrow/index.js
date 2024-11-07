'use client'

import React, { useState, useEffect } from 'react'
import TeacherBox from '@/components/teacher/common/teacher-boxrow/box'
import styles from '@/components/teacher/common/teachers.module.scss'

export default function Boxrow(props) {
  return (
    <>
      <div className="d-flex justify-content-between">
        <TeacherBox
          blackImg="/teacher/teachers_img/T_1.jpg"
          colorImg="/teacher/teachers_img/T_1_color.jpg"
          name="Gina Bettelli"
          type="時尚攝影妝"
          nation="America | 美國"
          years="20"
        />
        <TeacherBox
          blackImg="/teacher/teachers_img/T_1.jpg"
          colorImg="/teacher/teachers_img/T_1_color.jpg"
          name="Gina Bettelli"
          type="時尚攝影妝"
          nation="America | 美國"
          years="20"
        />
        <TeacherBox
          blackImg="/teacher/teachers_img/T_1.jpg"
          colorImg="/teacher/teachers_img/T_1_color.jpg"
          name="Gina Bettelli"
          type="時尚攝影妝"
          nation="America | 美國"
          years="20"
        />
        <TeacherBox
          blackImg="/teacher/teachers_img/T_1.jpg"
          colorImg="/teacher/teachers_img/T_1_color.jpg"
          name="Gina Bettelli"
          type="時尚攝影妝"
          nation="America | 美國"
          years="20"
        />
      </div>
    </>
  )
}
