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

export default function AddToCart(props) {
  return (
    <>
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
    </>
  )
}
