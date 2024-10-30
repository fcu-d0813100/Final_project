'use client'
import Sidebar from '@/components/teacher/common/T-dashboard-side-bar'
import DashboardTitle from '@/components/shared/dashboard-title-y'
import styles from '@/components/teacher/common/upload.module.scss'
import Footer from '@/components/home/common/footer'
import TopBar from '@/components/home/common/header'
import TDashboardBN from '@/components/teacher/common/t-dashboard-bn'
import React, { useState, useEffect } from 'react'

export default function Upload(props) {
  return (
    <>
      <TopBar />
      <TDashboardBN teacher="Gina Bettelli" />

      <div>
        <Sidebar />

        <div className={styles.main}>
          <DashboardTitle chTitle="課程上架" enTitle="New workshop" />
          <div className={styles.section1}>
            <div className={styles.uploadCover}>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
