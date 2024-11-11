'use client'
import { useAuth } from '@/hooks/use-auth'
import styles from '@/components/teacher/common/t-dashboard-bn/t-dashboard-bn.module.scss'
import React, { useState, useEffect } from 'react'

export default function TDashboardBN(props) {
  const { auth, login, logout } = useAuth()
  const { userData } = auth // 撈取 teacherData 資料
  //console.log(auth)
  return (
    <>
      <div className={styles.section1}>
        <div>
          <h1 className="h1-L mb-2">WELCOME</h1>
          <p className="h3">TEACHER&nbsp; {userData.account} !</p>
        </div>
      </div>
    </>
  )
}
