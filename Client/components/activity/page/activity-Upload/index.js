'use client'
import TimeSelect from '@/components/teacher/common/t-dashboard-time-select'
import Textarea from '@/components/teacher/common/t-dashboard-textarea-style'
import UploadImg from '@/components/activity/common/uploadImg'
import SelectInput from '@/components/activity/common/inputSelect'
import InputStyle from '@/components/teacher/common/t-dashboard-input-style'
import { PiPlus, PiArrowRight } from 'react-icons/pi'
import Sidebar from '@/components/activity/common/Sidebar'
import DashboardTitle from '@/components/shared/dashboard-title-y'
import styles from '@/components/teacher/common/upload.module.scss'
import TDashboardBN from '@/components/teacher/common/t-dashboard-bn'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
export default function Upload(props) {
  return (
    <>
      <header
        className={`${styles.header} d-flex justify-content-between align-items-center px-5`}
      >
        <div className="h3-L">Beautique</div>
        <div className="h5">Admin</div>
      </header>

      <div>
        <Sidebar />

        <form action="">
          <div className={styles.main}>
            <DashboardTitle chTitle="活動上架" enTitle="New activity" />
            <div className={`${styles.section1} d-flex align-items-end`}>
              <UploadImg width="445px" height="320px" />

              <div className={`${styles.uploadMainInfo} flex-grow-1`}>
                <div className={styles.subtitle}>
                  <h4 className="h4 pb-2">主要資訊</h4>
                </div>
                <div className={styles.inputArea}>
                  <div className="container d-flex gap-4 mb-3">
                    <InputStyle
                      addclass="col-9"
                      forText="name"
                      titleCh="活動名稱"
                      titleEn=" | name"
                      typeText="text"
                      placeholder="請輸入活動名稱"
                      name=""
                    />
                    <InputStyle
                      addclass="col-3"
                      forText="price"
                      titleCh="活動名額"
                      titleEn=" | amount"
                      typeText="text"
                      placeholder="請填入活動名額"
                      name=""
                    />
                  </div>
                  <div className="container d-flex gap-4 mb-3">
                    <SelectInput
                      addClass="col-5"
                      forText="type"
                      titleCh="活動品牌"
                      titleEn="brand"
                    />

                    <InputStyle
                      addclass="col-7"
                      forText="address"
                      titleCh="活動地點"
                      titleEn=" | address"
                      typeText="text"
                      placeholder="請填入地址"
                      name=""
                    />
                  </div>
                  <div className="container d-flex align-items-end justify-content-between gap-2">
                    <InputStyle
                      addclass="col-6 me-1"
                      forText="name"
                      titleCh="報名時間"
                      titleEn=" | registration period"
                      typeText="date"
                      placeholder="Beginning Date"
                      name=""
                    />
                    <p className="col-1 d-flex justify-content-center align-items-center">
                      <PiArrowRight className="ph" />
                    </p>

                    <InputStyle
                      addclass="col-5 ms-1"
                      forText="price"
                      titleCh=""
                      titleEn=""
                      typeText="date"
                      placeholder="End Date"
                      name=""
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr className="opacity-75" />
            <div className={`${styles.section02}`}>
              <div className={`${styles.workshopDetail} p-5`}>
                <Textarea
                  title="課程簡介"
                  name="description"
                  rows="5"
                  width="100%"
                  placeholder="最多輸入200字"
                  addclass="mb-4"
                />
              </div>
            </div>

            <div className="ms-auto d-flex justify-content-end mt-2">
              <Link href="/admin/activity">
                <button className="btn-secondary h6 me-3">取消</button>
              </Link>
              <button className="btn-primary h6" type="submit">
                上架
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
