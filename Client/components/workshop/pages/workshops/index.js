'use client'
import styles from '@/components/workshop/common/workshops.module.scss'
import WorkshopsBN from '@/components/workshop/common/workshop-bn'
import WorkshopSelectbar from '@/components/workshop/common/workshop-selectbar'
import WorkshopCardLg from '@/components/shared/workshop-card-lg'
import React, { useState, useEffect } from 'react'

export default function WorkshopAll(props) {
  return (
    <>
      <WorkshopsBN />

      <WorkshopSelectbar />

      <div className={`${styles.section03} container`}>
        <div className={`${styles.tOwnWorkshops} row row-cols-3 my-5`}>
          <WorkshopCardLg
            imgCover="/workshop/workshop_img/1-1-c.jpg"
            name="F19時尚攝影妝容班"
            teacher="Terry Barber 老師"
            beginDate="2024/09/30"
            endDate="2024/10/30"
            price="3200"
            status="已截止"
          />
          <WorkshopCardLg
            imgCover="/workshop/workshop_img/1-2-c.jpg"
            name="F19時尚攝影妝容班"
            teacher="Terry Barber 老師"
            beginDate="2024/09/30"
            endDate="2024/10/30"
            price="3200"
            status="報名中"
          />
        </div>
      </div>
    </>
  )
}
