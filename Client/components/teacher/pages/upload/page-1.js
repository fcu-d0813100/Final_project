'use client'
import AddWorkshopTime from '@/components/teacher/common/t-dashboard-add-worshopTime'
import TimeSelect from '@/components/teacher/common/t-dashboard-time-select'
import Textarea from '@/components/teacher/common/t-dashboard-textarea-style'
import UploadImg from '@/components/teacher/common/t-dashboard-uploadImg'
import SelectInput from '@/components/teacher/common/t-dashboard-select-input'
import InputStyle from '@/components/teacher/common/t-dashboard-input-style'
import { PiPlus, PiArrowRight } from 'react-icons/pi'
import Sidebar from '@/components/teacher/common/t-dashboard-side-bar'
import DashboardTitle from '@/components/shared/dashboard-title-y'
import styles from '@/components/teacher/common/upload.module.scss'
import TDashboardBN from '@/components/teacher/common/t-dashboard-bn'
import React, { useState, useEffect } from 'react'

export default function Page1({ onNextPage }) {
  return (
    <>
      <form action="">
        <div className={styles.main}>
          <DashboardTitle chTitle="課程上架" enTitle="New workshop" />
          <div className={`${styles.section1} d-flex align-items-end`}>
            <UploadImg
              width="445px"
              height="320px"
              bigText="新增封面圖"
              smText="必填"
            />

            <div className={`${styles.uploadMainInfo} flex-grow-1`}>
              <div className={styles.subtitle}>
                <h4 className="h4 pb-2">主要資訊</h4>
              </div>
              <div className={styles.inputArea}>
                <div className="container d-flex gap-4 mb-3">
                  <InputStyle
                    addclass="col-9"
                    forText="name"
                    titleCh="課程名稱"
                    titleEn=" | name"
                    typeText="text"
                    placeholder="請輸入課程名稱"
                    name=""
                  />
                  <InputStyle
                    addclass="col-3"
                    forText="price"
                    titleCh="價錢"
                    titleEn=" | price"
                    typeText="text"
                    placeholder="請填入金額"
                    name=""
                  />
                </div>
                <div className="container d-flex gap-4 mb-3">
                  <SelectInput
                    initName="類別"
                    addClass="col-5"
                    forText="type"
                    titleCh="課程類別"
                    titleEn=" | type"
                    items={[
                      { name: 'type_id', option: '基礎化妝' },
                      { name: 'type_id', option: '新娘化妝' },
                      { name: 'type_id', option: '時尚與攝影化妝' },
                      { name: 'type_id', option: '韓系美妝' },
                      { name: 'type_id', option: '特效化妝' },
                      { name: 'type_id', option: '美妝產品知識' },
                    ]}
                  />

                  <InputStyle
                    addclass="col-7"
                    forText="address"
                    titleCh="上課地點"
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
              <div className="d-flex justify-content-between p-0">
                <Textarea
                  title="課程大綱"
                  name="outline"
                  rows="10"
                  width="93%"
                  placeholder="最多輸入120字"
                  addclass="w-100"
                />
                <Textarea
                  title="注意事項"
                  name="notes"
                  rows="10"
                  width="100%"
                  placeholder="最多輸入120字"
                  addclass="w-100"
                />
              </div>
            </div>
          </div>
          <hr className="opacity-75" />
          <div className={`${styles.section03} `}>
            <h4 className="h4 mb-4">開課時程</h4>
            <div className="row row-cols-3">
              <TimeSelect
                date="20202020"
                beginTime="12"
                endTime="12"
                hours="3"
                min="2"
                max="1"
              />
              <TimeSelect
                date="20202020"
                beginTime="12"
                endTime="12"
                hours="3"
                min="2"
                max="1"
              />
              <AddWorkshopTime />
            </div>
          </div>
          <div className="ms-auto d-flex justify-content-end mt-2">
            <button className="btn-secondary h6 me-4">儲存</button>
            <button
              className="btn-primary h6"
              onClick={(e) => {
                e.preventDefault()
                onNextPage()
              }}
            >
              下一步
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
