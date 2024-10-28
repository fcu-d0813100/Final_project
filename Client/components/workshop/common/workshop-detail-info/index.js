'use client'
import styles from '@/components/workshop/common/workshop-detail.module.scss'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'

export default function WorkshopDetailInfo(props) {
  return (
    <>
      <div className={styles.section03}>
        <Image
          height={700}
          width={1920}
          className={styles.fImg}
          src="/workshop/workshop_img/1-1-f.jpg"
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
              src="/workshop/workshop_img/1-1-s-1.jpg"
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
                <p className={`${styles.context} h6`}>
                  • 彩妝基礎：膚質分析、基礎底妝 <br />
                  • 造型技巧：時尚彩妝趨勢、創意妝容設計。 <br />
                  • 時尚色彩學：色彩趨勢、色彩搭配。 <br />
                  • 實務操作：現場拍攝實習與專業彩妝應用。 <br />•
                  作品集製作：打造個人風格，準備進入時尚產業。
                </p>
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
              <p className="h6">
                ※
                若因個人因素無法前往，可轉讓資格給朋友，需於開課前七天通知，如未通知且當日未到者，不予補課及退費。
                <br />
                ※
                為確保上課品質，4人開班，若不足4人時另協調時段開班，於開課前五天通知學員。
                <br />※
                本課程提供上妝刷具，學員上課時需「自備」習慣保養品、彩妝品、其他上妝工具。
              </p>
            </div>

            <div className={styles.smImg02}>
              <img src="/img/sm_img02.jpg" alt="" />
              <Image
                height={620}
                width={700}
                className={styles.img02}
                src="/workshop/workshop_img/1-1-s-2.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
