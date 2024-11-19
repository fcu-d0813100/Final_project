'use client'
import { useAuth } from '@/hooks/use-auth'
import Sidebar from '@/components/teacher/common/t-dashboard-side-bar'
import TPersonalMoreInfo from '@/components/teacher/common/t-dashboard-personal-moreinfo'
import TPersonalInfo from '@/components/teacher/common/t-dashboard-personal-info'
import DashboardTitle from '@/components/shared/dashboard-title-y'
import TDashboardBN from '@/components/teacher/common/t-dashboard-bn'
import styles from '@/components/teacher/common/information.module.scss'
import React, { useState, useEffect } from 'react'

export default function Page1({ onNextPage }) {
  const role = 'teacher'
  const { auth, login, logout } = useAuth()
  const { userData } = auth // 撈取 teacherData
  console.log(auth)

  const [teacher, setTeacher] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch(
        'http://localhost:3005/api/teacher/information',
        {
          credentials: 'include', //一定要加，才會帶cookie
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (!response.ok) {
        throw new Error('網路回應不成功：' + response.status)
      }
      const data = await response.json()
      //const filteredData = data.find((teacher) => teacher.id === userData.id) // 篩選符合 userData.id 的資料
      setTeacher(data) // 只設定符合 id 的資料
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <div className={styles.main}>
        <DashboardTitle chTitle="個人資訊" enTitle="Information" />
        {teacher ? (
          <div>
            <TPersonalInfo
              name={teacher.name}
              account={teacher.user_account}
              email={teacher.email}
              birthday={teacher.birthday}
              years={teacher.years}
              gender={teacher.gender === 'female' ? '女' : '男'}
              nation={teacher.nation}
              teacherImg={`/teacher/teachers_img/T_${teacher.id}_color.jpg`}
            />

            <hr className="opacity-75" />

            <TPersonalMoreInfo
              slogan={teacher.slogan}
              about={teacher.about}
              experience={teacher.experience}
            />
          </div>
        ) : (
          <p>載入中或找不到資料</p>
        )}
        <div className={`${styles.button} d-flex`}>
          <button
            className="btn-primary h6 ms-auto"
            onClick={(e) => {
              e.preventDefault()
              onNextPage() // 確保點擊時觸發
            }}
          >
            編輯
          </button>
        </div>
      </div>
    </>
  )
}
