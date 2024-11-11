'use client'

import UploadImg from '@/components/teacher/common/t-dashboard-uploadImg'
import Sidebar from '@/components/teacher/common/t-dashboard-side-bar'
import DashboardTitle from '@/components/shared/dashboard-title-y'
import styles from '@/components/teacher/common/upload.module.scss'
import TDashboardBN from '@/components/teacher/common/t-dashboard-bn'
import React, { useState, useEffect } from 'react'

export default function Page2({ onPreviousPage, handleSave, setFormData }) {
  const handleFileChange = (name, file) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: file,
    }))
  }
  return (
    <>
      <div className={styles.main}>
        <DashboardTitle chTitle="課程上架" enTitle="New workshop" />
        <div className={styles.section1}>
          <UploadImg
            width="100%"
            height="330px"
            bigText="新增細節圖"
            smText="1920 X 550 px"
            name="img_lg"
            onFileChange={handleFileChange}
          />
          <div className=" d-flex mt-5">
            <UploadImg
              width="100%"
              height="355px"
              bigText="新增細節圖"
              smText="960 X 530 px"
              name="img_sm01"
              onFileChange={handleFileChange}
            />
            <div className="mx-3"></div>
            <UploadImg
              width="100%"
              height="355px"
              bigText="新增細節圖"
              smText="720 X 620 px"
              name="img_sm02"
              onFileChange={handleFileChange}
            />
          </div>
        </div>

        <hr className="opacity-75" />
        <div className="d-flex mt-5 pt-3">
          <button
            className="btn-primary h6"
            onClick={(e) => {
              e.preventDefault()
              onPreviousPage() // 確保點擊時觸發
            }}
          >
            回前頁
          </button>

          <div className="d-flex ms-auto">
            <button
              className="btn-secondary h6"
              type="submit"
              onClick={(e) => {
                e.preventDefault()
                handleSave(e, 0) // 儲存時執行 handleSubmitisUpload0
              }}
            >
              儲存
            </button>
            <button
              className="btn-danger h6 ms-4"
              type="submit"
              onClick={(e) => {
                e.preventDefault()
                handleSave(e, 1) // 發布時執行 handleSubmitisUpload1
              }}
            >
              立即發布
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
