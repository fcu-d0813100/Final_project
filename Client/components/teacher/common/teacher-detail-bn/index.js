'use client'

import styles from '@/components/teacher/common/teacher-detail.module.scss'
import Image from 'next/image'

import React, { useState, useEffect } from 'react'

export default function TeacherDetailBn(props) {
  return (
    <>
      <div className={styles.section01}>
        <div className={styles.bannerImg}>
          <Image
            width={1920}
            height={700}
            className={styles.bn}
            src="/teacher/teachers_img/T_2_BN.jpg"
            alt=""
          />

          <div className={styles.bnInformation}>
            <h1 className="h1-L">Terry Barber</h1>
            <p className="h6">
              Britain 英國 <br />
              年資 17 年
            </p>
            <p className="h6">擅長 ｜ 時尚攝影妝</p>
          </div>

          <div className={styles.whiteRec}></div>
          <div>
            <Image
              width={772}
              height={280}
              className={styles.signImg}
              src="/teacher/teachers_img/T_2_S.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  )
}
