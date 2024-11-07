'use client'
import styles from '@/components/teacher/common/t-dashboard-bn/t-dashboard-bn.module.scss'
import React, { useState, useEffect } from 'react'

export default function TDashboardBN({teacher=''}) {
  return (
    <>
      <div className={styles.section1}>
        <div>
          <h1 className="h1-L mb-2">WELCOME</h1>
          <p className="h3">TEACHER - {teacher} !</p>
        </div>
      </div>
    </>
  )
}
