'use client'
import { PiPlus } from 'react-icons/pi'
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

          <div className={`${styles.section1} d-flex`}>
            <div className={styles.uploadCover}>
              <div className="text-center">
                <PiPlus className={styles.plus} />
                <p className={`${styles.picUploadText} h4 mt-3`}>
                  新增封面圖
                  <br /> <span className="p">(必填)</span>
                </p>
              </div>
            </div>

            <div className={`${styles.X} flex-grow-1`}>
              <div className={styles.uploadMainInfo}>
                <h4>主要資訊</h4>
              </div>
            </div>
          </div>

          <hr className="opacity-75" />
        </div>
      </div>
      <Footer />
    </>
  )
}
