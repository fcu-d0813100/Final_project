'use client'
import styles from '@/components/workshop/common/workshop-detail.module.scss'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'

export default function WorkshopDetailInfo({ bn, imgS01, outline, note ,imgS02 }) {
  return (
    <>
      <div className={styles.section03}>
        <Image
          height={700}
          width={1920}
          className={styles.fImg}
          src={bn}
          alt=""
        />
      </div>

      <div className={styles.section04}>
        <div className="d-flex align-items-center">
          <div className={styles.smImg01}>
            <Image
              height={620}
              width={960}
              className={styles.img01}
              src={imgS01}
              alt=""
            />
          </div>

          <div className={styles.rightSide}>
            <div className={styles.outline}>
              <div className="d-flex align-items-center justify-content-between mb-5 pb-3 border-bottom border-dark">
                <h3 className="h3">▌課程大綱</h3>
                <p className={`h3-L ${styles.titleEn}`}>Outline</p>
              </div>
              <div>
                <p className={`${styles.context} h6`}>{outline}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section05}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            <div className={styles.leftSide}>
              <h3 className="h3 mb-5 pb-4 border-bottom border-light-subtle">
                注意事項
              </h3>
              <p className="h6">{note}</p>
            </div>

            <div className={styles.smImg02}>
              <img src="/img/sm_img02.jpg" alt="" />
              <Image
                height={620}
                width={700}
                className={styles.img02}
                src={imgS02}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
