'use client'

import React, { useState, useEffect } from 'react'
import TeacherBox from '@/components/teacher/common/teacher-boxrow/box'
import styles from '@/components/teacher/common/teachers.module.scss'

export default function Boxrow(props) {
  const [teacher, setTeacher] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/teacher')
        if (!response.ok) {
          throw new Error('網路回應不成功：' + response.status)
        }
        const data = await response.json()
        setTeacher(data)
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])

  // 每四個一組分成子陣列
  const groupedTeachers = []
  for (let i = 0; i < teacher.length; i += 4) {
    groupedTeachers.push(teacher.slice(i, i + 4))
  }

  return (
    <>
      {groupedTeachers.map((row, rowIndex) => (
        <div className="d-flex justify-content-between" key={rowIndex}>
          {row.map((teacher, index) => (
            <TeacherBox
              tid={teacher.id}
              key={teacher.id}
              blackImg={`/teacher/teachers_img/T_${teacher.id}.jpg`}
              colorImg={`/teacher/teachers_img/T_${teacher.id}_color.jpg`}
              name={teacher.name}
              type={teacher.workshop_type_type}
              nation={teacher.nation}
              years={teacher.years}
            />
          ))}
        </div>
      ))}
    </>
  )
}
