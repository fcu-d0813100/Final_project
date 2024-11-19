'use client'
import styles from '@/components/teacher/common/t-dashboard-time-select/time-select.module.scss'
import React, { useState, useEffect } from 'react'

export default function TimeSelect({
  id = '',
  date = '',
  beginTime = '',
  endTime = '',
  min = 0,
  max = 0,
  onClick,
}) {
  return (
    <>
      <p name="id" className="d-none">
        {id}
      </p>
      <div className="col">
        <button
          type="button"
          className={`${styles.checkDateActive}
                 d-flex align-items-center justify-content-center mb-4`}
          onClick={onClick}
        >
          <div>
            <p className={styles.wDate}>{date}</p>
            <p className={`${styles.wTime} h5`}>
              {beginTime} - {endTime}
            </p>
            <div className={`ps d-flex align-items-center ${styles.wPerson}`}>
              <p className="flex-grow-1 m-0"> 最少 {min} 人</p>
              <p className={`flex-grow-1 m-0 ${styles.pMax}`}>{max} 人額滿</p>
            </div>
          </div>
        </button>
      </div>
    </>
  )
}
