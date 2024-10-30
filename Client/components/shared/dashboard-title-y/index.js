'use client'
import styles from '@/components/shared/dashboard-title-y/dashboard-title.module.scss'
import React, { useState, useEffect } from 'react'

export default function DashboardTitle({chTitle , enTitle}) {
  return (
    <>
      <div className={styles.dashboardTitle}>
        <p className="h3">{chTitle}</p>
        <h1 className="h1-L">{enTitle}</h1>
      </div>
    </>
  )
}
