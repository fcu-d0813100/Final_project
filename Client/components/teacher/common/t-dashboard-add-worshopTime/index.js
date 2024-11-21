'use client'
import SelectInput from '@/components/teacher/common/t-dashboard-select-input'
import InputStyle from '@/components/teacher/common/t-dashboard-input-style'
import { PiPlus, PiX, PiArrowRight } from 'react-icons/pi'
import styles from '@/components/teacher/common/t-dashboard-add-worshopTime/add-workshopTime.module.scss'
import React, { useState, useEffect } from 'react'

export default function AddWorkshopTime({ onAddTime, workshopIdVal, registrationEnd }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [selectedTime, setSelectedTime] = useState({
    id: null,
    date: '',
    start_time: '',
    end_time: '',
    min_students: '',
    max_students: '',
  })

  // 控制 Modal 的顯示
  const toggleModal = () => setIsModalOpen(!isModalOpen)

  // 處理表單數據變更
  const handleChange = (e) => {
    const { name, value } = e.target
    setSelectedTime((prevTime) => ({
      ...prevTime,
      [name]: value,
    }))
  }

  const timeOptions = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
  ]
  //console.log(selectedTime)
  // 處理新增時間
  const handleAddTime = () => {
    onAddTime(selectedTime) // 將資料傳遞給父層
    setSelectedTime({
      date: '',
      start_time: '',
      end_time: '',
      min_students: '',
      max_students: '',
    })
    toggleModal()
  }

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
        <button
          className={styles.modalOverlay}
          type="button"
          onClick={toggleModal}
        >
          <button
            type="button"
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={toggleModal} className={`${styles.close} ph`}>
              <PiX />
            </button>
            <h5 className="h5 mb-4">新增課程時間</h5>
            <input
              name="workshop_id"
              value={workshopIdVal}
              className="d-none"
            />
            <InputStyle
              addclass="mb-3"
              forText="date"
              titleCh="上課時間"
              titleEn=""
              typeText="date"
              placeholder="請選擇日期"
              name="date"
              value={selectedTime.date}
              min={registrationEnd}
              onChange={handleChange}
            />

            <div className="d-flex align-items-end justify-content-between p-0 mb-3">
              <SelectInput
                initName="開始時間"
                addClass="w-100"
                forText="start_time"
                titleCh="時間"
                titleEn=""
                items={timeOptions.map((t) => ({
                  name: 'start_time',
                  option: t,
                  value: `${t}`,
                }))}
                name="start_time"
                value={selectedTime.start_time}
                onChange={handleChange}
              />
              <p className="col-1 d-flex justify-content-center align-items-center">
                <PiArrowRight className="ph" />
              </p>
              <SelectInput
                initName="結束時間"
                addClass="w-100"
                forText="end_time"
                titleCh=""
                titleEn=""
                items={timeOptions.map((t) => ({
                  name: 'end_time',
                  option: t,
                  value: `${t}`,
                }))}
                name="end_time"
                value={selectedTime.end_time}
                onChange={handleChange}
              />
            </div>
            <div className="container d-flex align-items-end justify-content-between p-0">
              <InputStyle
                addclass="w-100"
                forText="min_students"
                titleCh="人數區間"
                titleEn=""
                typeText="number"
                placeholder="最少人數"
                name="min_students"
                value={selectedTime.min_students}
                min={1} // 最少人數不能小於 1
                onChange={handleChange}
              />
              <p className="col-1 d-flex justify-content-center align-items-center">
                <PiArrowRight className="ph" />
              </p>

              <InputStyle
                addclass="w-100"
                forText="max_students"
                titleCh=""
                titleEn=""
                typeText="number"
                placeholder="最多人數"
                name="max_students"
                min={1} // 最少人數不能小於 1
                value={selectedTime.max_students}
                onChange={handleChange}
              />
            </div>
            <p className={`${styles.note} ps my-3 mb-5 pb-5`}>
              *少於區間人數將自動通知不開班授課
            </p>

            <div className="d-flex justify-content-end pt-4">
              <button
                type="button"
                className="btn-success h6"
                onClick={handleAddTime}
              >
                新增
              </button>
            </div>
          </button>
        </button>
      )}
    </>
  )
}
