'use client'

import styles from '@/components/teacher/common/teacher-detail.module.scss'
import Image from 'next/image'

import React, { useState, useEffect } from 'react'

export default function TeacherDetailBn({imgBanner,name,nation,years,typeId,signImg}) {
  return (
    <>
      <div className={styles.section01}>
        <div className={styles.bannerImg}>
          <Image
            width={1920}
            height={700}
            className={styles.bn}
            src={imgBanner}
            alt=""
          />

          <div className={styles.bnInformation}>
            <h1 className="h1-L">{name}</h1>
            <p className="h6">
              {nation} <br />
              年資 {years} 年
            </p>
            <p className="h6">擅長 ｜ {typeId}</p>
          </div>

          <div className={styles.whiteRec}></div>
          <div>
            <Image
              width={772}
              height={280}
              className={styles.signImg}
              src={signImg}
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  )
}
