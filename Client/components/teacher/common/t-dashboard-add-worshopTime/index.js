'use client'
import SelectInput from '@/components/teacher/common/t-dashboard-select-input'
import InputStyle from '@/components/teacher/common/t-dashboard-input-style'
import { PiPlus, PiX, PiArrowRight } from 'react-icons/pi'
import styles from '@/components/teacher/common/t-dashboard-add-worshopTime/add-workshopTime.module.scss'
import React, { useState, useEffect } from 'react'


export default function AddWorkshopTime(props) {
      const [isModalOpen, setIsModalOpen] = useState(false)

      // 控制 Modal 的顯示
      const toggleModal = () => setIsModalOpen(!isModalOpen)

      const time = [
        '09:00:00',
        '09:30:00',
        '10:00:00',
        '10:30:00',
        '11:00:00',
        '11:30:00',
        '12:00:00',
        '12:30:00',
        '13:00:00',
        '13:30:00',
        '14:00:00',
        '14:30:00',
        '15:00:00',
        '15:30:00',
        '16:00:00',
        '16:30:00',
        '17:00:00',
        '17:30:00',
        '18:00:00',
        '18:30:00',
      ]

  return (
    <>
      <div className={`${styles.addClassBtn}`}>
        <button
          type="button"
          className={`${styles.btnContent}`}
          onClick={toggleModal}
        >
          <div>
            <PiPlus className={styles.plus} />
            <p className={`h4 mt-3`}>新增封面圖</p>
          </div>
        </button>
      </div>

      {/* Modal 視窗 */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={toggleModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={toggleModal} className={`${styles.close} ph`}>
              <PiX />
            </button>
            <h5 className="h5 mb-4">新增課程時間</h5>
            <InputStyle
              addclass="mb-3"
              forText="date"
              titleCh="上課時間"
              titleEn=""
              typeText="date"
              placeholder="請選擇日期"
              name=""
            />

            <div className="d-flex align-items-end justify-content-between p-0 mb-3">
              <SelectInput
                initName="開始時間"
                addClass="w-100"
                forText="time"
                titleCh="時間"
                titleEn=""
                items={time.map((t) => ({ name: 'start_time', option: t }))}
              />
              <p className="col-1 d-flex justify-content-center align-items-center">
                <PiArrowRight className="ph" />
              </p>
              <SelectInput
                initName="結束時間"
                addClass="w-100"
                forText="time"
                titleCh=""
                titleEn=""
                items={time.map((t) => ({ name: 'end_time', option: t }))}
              />
            </div>
            <div className="container d-flex align-items-end justify-content-between p-0">
              <InputStyle
                addclass="w-100"
                forText="min_students"
                titleCh="人數區間"
                titleEn=""
                typeText="text"
                placeholder="最少人數"
                name="min_students"
              />
              <p className="col-1 d-flex justify-content-center align-items-center">
                <PiArrowRight className="ph" />
              </p>

              <InputStyle
                addclass="w-100"
                forText="max_students"
                titleCh=""
                titleEn=""
                typeText="text"
                placeholder="最多人數"
                name="max_students"
              />
            </div>
            <p className={`${styles.note} ps my-3 mb-5 pb-4`}>
              *少於區間人數將自動通知不開班授課
            </p>

            <div className="d-flex justify-content-end">
              <button className="btn-success">確定</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
