'use client'
import styles from '@/components/workshop/common/workshop-detail.module.scss'
import { PiHeartStraight } from 'react-icons/pi'
import React, { useState, useEffect } from 'react'

export default function WorkshopAddCartInfo({
  name,
  registrationStart,
  registrationEnd,
  price,
}) {
  return (
    <>
      <div>
        <div className="d-flex">
          <h1 className={`${styles.cName}`}>{name}</h1>
          <p className={`${styles.cDateTime} p`}>
            <span className="fw-semibold">報名時間</span>
            <br />
            {registrationStart} - {registrationEnd}
          </p>
        </div>
        <p className="d-flex align-items-center">
          <button className="border-0 bg-white d-flex align-items-center ph">
            <PiHeartStraight />
          </button>
          加入追蹤清單
        </p>
        <p className={`h3 ${styles.price}`}>NT${price}</p>
      </div>
    </>
  )
}
