'use client'
import styles from '@/components/workshop/common/workshop-detail.module.scss'
import React, { useState, useEffect } from 'react'

export default function TimeSelect({
  disabled = false,
  date = '',
  beginTime = '',
  endTime = '',
  hours = 0,
  registered = 0,
  max = 0,
  onSelect,
}) {
  // 狀態來追蹤是否被選取
  const [isActive, setIsActive] = useState(false)

  // 處理點擊事件
  const handleClick = () => {
    if (!disabled) {
      setIsActive(!isActive)
      // 傳遞被選取的時間資料
      if (!isActive) {
        onSelect({
          date,
          beginTime,
          endTime,
        })
      }
    }
  }

  return (
    <>
      <div className="col">
        <button
          className={`${
            disabled
              ? styles.checkDateDisable
              : isActive
              ? styles.checkDateActive
              : styles.checkDate
          }
                 d-flex align-items-center justify-content-center`}
          onClick={handleClick}
        >
          <div>
            <p
              className={disabled ? `${styles.wDateDisable} h3` : styles.wDate}
            >
              {date}
            </p>
            <p
              className={
                disabled ? `${styles.wTimeDisable} h5` : `${styles.wTime} h5`
              }
            >
              {beginTime} - {endTime} | {hours}hr
            </p>
            <div
              className={
                disabled
                  ? `${styles.wPersonDisable}`
                  : `ps d-flex align-items-center ${styles.wPerson}`
              }
            >
              {disabled ? (
                <p className={`m-0 ${styles.pMaxDisable} p-0`}>已額滿</p>
              ) : (
                <>
                  <p className="flex-grow-1 m-0"> 已報名 {registered} 人</p>
                  <p className={`flex-grow-1 m-0 ${styles.pMax}`}>
                    {max} 人額滿
                  </p>
                </>
              )}
            </div>
          </div>
        </button>
      </div>
    </>
  )
}
