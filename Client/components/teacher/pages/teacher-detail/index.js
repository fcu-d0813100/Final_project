'use client'
import styles from '@/components/teacher/common/teacher-detail.module.scss'
import Image from 'next/image'
import { PiMagnifyingGlass, PiCaretDown, PiArrowRight } from 'react-icons/pi'

import WorkshopCardLg from '@/components/shared/workshop-card-lg'
import TeacherDetailBn from '@/components/teacher/common/teacher-detail-bn'
import TeacherDetailText from '@/components/teacher/common/teacher-detail-text'

import React, { useState, useEffect } from 'react'

export default function TeacherDetail(props) {
  return (
    <>
      <TeacherDetailBn
        imgBanner="/teacher/teachers_img/T_2_BN.jpg"
        name="Terry Barber"
        nation="Britain 英國"
        years="17"
        typeId="時尚攝影妝"
        signImg="/teacher/teachers_img/T_2_S.png"
      />

      <TeacherDetailText
        slogan="“ 我喜歡贈送口紅。口紅如此豐富多變，一旦你用過了它們，你就離不開了！”"
        about=" 現任職彩妝藝術總監。身為一個表演者，我喜歡後台的能量和創造力，但無論在哪裡在世界各地教授彩妝大師班，在全球舉行活動或參與密集的時裝週活動品牌的多樣性仍然是我持續的靈感來源。"
        experience=" 擔任 M.A.C 彩妝藝術總監17年。與 Grace Jones 一起合作，並由 Jean-Paul Goude
              負責拍攝V雜誌封面。"
      />

      <div className={styles.section03}>
        <div className="container">
          <div className={styles.tWorkshopTitle}>
            <h1 className="h1-L">Workshop</h1>
            <h4 className="h4">Terry Barber</h4>
          </div>

          <div className={styles.selectBar}>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className={styles.searchInput}
                placeholder="搜尋"
              />
              <a
                className="d-flex align-items-center text-decoration-none ph text-dark ms-3"
                href="#"
              >
                <PiMagnifyingGlass />
              </a>
            </div>

            <div className="d-flex">
              <div className="dropdown mx-3">
                <a
                  href="#"
                  className={`${styles.dropdownTitle} p d-flex align-content-center justify-content-between`}
                  data-bs-toggle="dropdown"
                >
                  <p>狀態</p>
                  <PiCaretDown />
                </a>
                <div className={`dropdown-menu ${styles.dropdownMenu}`}>
                  <a href="#" className="dropdown-item my-1">
                    報名中
                  </a>
                  <a href="#" className="dropdown-item my-1">
                    已截止
                  </a>
                </div>
              </div>

              <div className="dropdown mx-3">
                <a
                  href="#"
                  className={`${styles.dropdownTitle} p d-flex align-content-center justify-content-between`}
                  data-bs-toggle="dropdown"
                >
                  <p>排序</p>
                  <PiCaretDown />
                </a>
                <div className={`dropdown-menu ${styles.dropdownMenu}`}>
                  <a href="#" className="dropdown-item my-1">
                    價錢 高 -- 低
                  </a>
                  <a href="#" className="dropdown-item my-1">
                    價錢 低 -- 高
                  </a>
                  <a href="#" className="dropdown-item my-1">
                    最新上架
                  </a>
                </div>
              </div>
            </div>
          </div>

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
      </div>
    </>
  )
}
