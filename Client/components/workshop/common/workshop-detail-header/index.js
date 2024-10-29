'use client'
import styles from '@/components/workshop/common/workshop-detail.module.scss'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'

export default function WorkshopDetailHeader({
  name = '',
  description = '',
  beginDate = '',
  endDate = '',
  address = '',
  type = '',
  teacher = '',
  cover = '',
}) {
  return (
    <>
      <div className={`${styles.section01} d-flex`}>
        <div className={styles.wInformation}>
          <h1 className={styles.name}>{name}</h1>
          <div className={styles.infoContainer}>
            <p className="h4 text-body-tertiary">課程簡介</p>
            <div className={`${styles.wText} p`}>
              <p className="pb-4">{description}</p>
              <p>
                課程期間：{beginDate} - {endDate}
                <br />
                上課地點：{address} <br />
                <span className={`p ${styles.type}`}>Type | {type}</span>
              </p>
            </div>
            <p className={`h4 ${styles.tName}`}>Teacher | {teacher} </p>
          </div>
        </div>

        <div className={styles.cover}>
          <Image
            width={960}
            height={700}
            className={styles.coverImg}
            src={cover}
            alt=""
          />
        </div>
      </div>
    </>
  )
}
