'use client'
import styles from '@/components/workshop/common/workshop-detail.module.scss'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'

export default function WorkshopDetailHeader(props) {
  return (
    <>
      <div className={`${styles.section01} d-flex`}>
        <div className={styles.wInformation}>
          <h1 className={styles.name}>F19 時尚攝影彩妝班</h1>
          <div className={styles.infoContainer}>
            <p className="h4 text-body-tertiary">課程簡介</p>
            <div className={`${styles.wText} p`}>
              <p className="pb-4">
                時尚攝影彩妝班專注於培養學員掌握專業時尚彩妝與修容技巧，融合創意與流行元素，打造獨特的時尚造型。適合想進入時尚產業的學員，從基礎到高階全面提升。
              </p>
              <p>
                課程期間：2024/09/30 - 2024/10/20 <br />
                上課地點：台北市大同區重慶北路三段43號2樓 <br />
                <span className={`p ${styles.type}`}>Type | 時尚攝影類</span>
              </p>
            </div>
            <p className={`h4 ${styles.tName}`}>Teacher | Terry Barber</p>
          </div>
        </div>

        <div className={styles.cover}>
          <Image
            width={960}
            height={700}
            className={styles.coverImg}
            src="/workshop/workshop_img/1-1-c.jpg"
            alt=""
          />
        </div>
      </div>
    </>
  )
}
