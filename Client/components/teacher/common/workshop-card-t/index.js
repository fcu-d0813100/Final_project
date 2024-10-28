'use client'
import styles from '@/components/teacher/common/teacher-detail.module.scss'
import Image from 'next/image'
import { PiMagnifyingGlass, PiCaretDown, PiArrowRight } from 'react-icons/pi'
import React, { useState, useEffect } from 'react'

export default function WorkshopCardT(props) {
  return (
    <>
      <div className={`${styles.tOwnWorkshops} row row-cols-3 my-5`}>
        {[
          {
            imgSrc: '/workshop/workshop_img/1-1-c.jpg',
            title: 'F19時尚攝影妝容班',
            teacher: 'Terry Barber 老師',
            dates: '2024/09/30-2024/10/30',
            price: 'NT$3200',
            status: '已截止',
          },
          {
            imgSrc: '/workshop/workshop_img/1-2-c.jpg',
            title: 'F19時尚攝影妝容班',
            teacher: 'Terry Barber 老師',
            dates: '2024/09/30-2024/10/30',
            price: 'NT$3200',
            status: '已截止',
          },
          {
            imgSrc: '/workshop/workshop_img/1-3-c.jpg',
            title: 'F19時尚攝影妝容班',
            teacher: 'Terry Barber 老師',
            dates: '2024/09/30-2024/10/30',
            price: 'NT$3200',
            status: '報名中',
          },
          {
            imgSrc: '/workshop/workshop_img/1-4-c.jpg',
            title: 'F19時尚攝影妝容班',
            teacher: 'Terry Barber 老師',
            dates: '2024/09/30-2024/10/30',
            price: 'NT$3200',
            status: '已截止',
          },
        ].map((workshop, index) => (
          <a href="#" className={`${styles.workshop} p-0`} key={index}>
            <div className={styles.workshopImg}>
              <Image
                height={615}
                width={480}
                className={styles.coverImg}
                src={workshop.imgSrc}
                alt=""
              />
            </div>
            <div className={styles.wInformation}>
              <div className={styles.innerText}>
                <div>
                  <h4 className={`h4 ${styles.wTitle}`}>{workshop.title}</h4>
                </div>
                <div className={styles.wDetail}>
                  <p className="p mb-2">{workshop.teacher}</p>
                  <h6 className="h6 mb-3">
                    開課時間
                    <br />
                    {workshop.dates}
                  </h6>
                  <h4 className="h4 mb-3">{workshop.price}</h4>
                  <div className={styles.wStatus}>
                    <p
                      className={`ps ${
                        workshop.status === '已截止'
                          ? styles.over
                          : styles.nowOpen
                      }`}
                    >
                      {workshop.status}
                    </p>
                    <div className={styles.more}>
                      <h6 className="h6">MORE</h6>
                      <PiArrowRight className="ph ms-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </>
  )
}
