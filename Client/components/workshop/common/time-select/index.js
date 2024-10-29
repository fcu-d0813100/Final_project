'use client'
import styles from '@/components/workshop/common/workshop-detail.module.scss'
import Image from 'next/image'
import {
  PiHeartStraight,
  PiMinus,
  PiPlus,
  PiPlusCircle,
  PiHandbagSimple,
} from 'react-icons/pi'
import React, { useState, useEffect } from 'react'

export default function TimeSelect({
  disabled = false,
  date = '',
  beginTime = '',
  endTime = '',
  hours = 0,
  min = 0,
  max = 0,
}) {

  return (
    <>
      <div className="col">
        <div
          className={`${disabled ? styles.checkDateDisable : styles.checkDate}
                 d-flex align-items-center justify-content-center`}
        >
          <div>
            <p
              className={disabled ? `${styles.wDateDisable} h3` : styles.wDate}
            >
              {date}
            </p>
            <p
              className={disabled ? `${styles.wTimeDisable} h5` : `${styles.wTime} h5`}
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
                  <p className="flex-grow-1 m-0"> 至少 {min} 人</p>
                  <p className={`flex-grow-1 m-0 ${styles.pMax}`}>
                    {max} 人額滿
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
