'use client'
import styles from '@/styles/workshop/workshop.module.scss'
import Image from 'next/image'
import {
  PiHeartStraight,
  PiMinus,
  PiPlus,
  PiPlusCircle,
  PiHandbagSimple,
} from 'react-icons/pi'
import React, { useState, useEffect } from 'react'

export default function WorkshopAll(props) {
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

      <div className={styles.workshopSpace}>
        <Image
          width={500}
          height={200}
          className={styles.workshopImg}
          src="/workshop/workshop.svg"
          alt=""
        />
      </div>

      <div className={`container ${styles.section02} py-5`}>
        <h4 className="h4 text-center mb-5">開課時程</h4>

        <div className="row row-cols-3 g-4">
          {[
            {
              date: '2024/9/28 (一)',
              time: '13:00-16:00',
              registered: 10,
              max: 12,
            },
            {
              date: '2024/9/30 (一)',
              time: '13:00-16:00',
              registered: 8,
              max: 12,
            },
            {
              date: '2024/9/30 (一)',
              time: '13:00-16:00',
              registered: 13,
              max: 12,
            },
            {
              date: '2024/9/30 (一)',
              time: '12:00-15:00',
              registered: 10,
              max: 12,
            },
            {
              date: '2024/9/30 (一)',
              time: '13:00-16:00',
              registered: '已額滿',
              disabled: true,
            },
          ].map(({ date, time, registered, max, disabled }, index) => (
            <div key={index} className="col">
              <div
                className={`${
                  disabled ? styles.checkDateDisable : styles.checkDate
                }
                 d-flex align-items-center justify-content-center`}
              >
                <div>
                  <p
                    className={
                      disabled ? `${styles.wDateDisable} h3` : styles.wDate
                    }
                  >
                    {date}
                  </p>
                  <p
                    className={
                      disabled ? `${styles.wTimeDisable} h5` : styles.wTime
                    }
                  >
                    {time} | 3hr
                  </p>
                  <div
                    className={
                      disabled
                        ? `${styles.wPersonDisable}`
                        : `ps d-flex align-items-center ${styles.wPerson}`
                    }
                  >
                    {disabled ? (
                      <p className={`m-0 ${styles.pMaxDisable} p-0`}>
                        {registered}
                      </p>
                    ) : (
                      <>
                        <p className="flex-grow-1 m-0">已報名{registered}人</p>
                        <p className={`flex-grow-1 m-0 ${styles.pMax}`}>
                          {max} 人額滿
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr className="border-2 my-5" />

        <div className="d-flex justify-content-between align-items-end pb-2">
          <div>
            <div className="d-flex">
              <h1 className={`${styles.cName}`}>F19時尚攝影彩妝班</h1>
              <p className={`${styles.cDateTime} p`}>
                <span className="fw-semibold">報名時間</span>
                <br />
                2024/08/30 - 2024/09/20
              </p>
            </div>
            <p className="d-flex align-items-center">
              <button className="border-0 bg-white d-flex align-items-center ph">
                <PiHeartStraight />
              </button>
              加入追蹤清單
            </p>
            <p className={`h3 ${styles.price}`}>NT$3200</p>
          </div>

          <div>
            <div className="mb-4 d-flex align-items-center justify-content-end">
              <button className={`${styles.btnSm} ph`}>
                <PiMinus />
              </button>
              <span className="px-3 h6">1</span>
              <button className={`${styles.btnSm} ph`}>
                <PiPlus />
              </button>
            </div>
            <div>
              <button className="btn-primary h6">
                <PiPlusCircle className="me-2 ph" />
                加入購物車
              </button>
              <button className="btn-secondary h6 ms-3">
                <PiHandbagSimple className="me-2 ph" />
                立即購買
              </button>
            </div>
          </div>
        </div>
      </div>

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
