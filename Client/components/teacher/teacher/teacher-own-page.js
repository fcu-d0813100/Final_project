'use client'
import styles from '@/styles/teacher/teacher.module.scss'
import Image from 'next/image'
import { PiMagnifyingGlass, PiCaretDown, PiArrowRight } from 'react-icons/pi'
import React, { useState, useEffect } from 'react'

export default function TeacherOwnPage(props) {
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

      <div className={`${styles.section02} container`}>
        <div className={styles.textContent}>
          <div className="col p-0">
            <h4 className="h4">Slogan</h4>
            <p className="h6">
              “我喜歡贈送口紅。口紅如此豐富多變，一旦你用過了它們，你就離不開了！”
            </p>
          </div>
          <div className="col p-0">
            <h4 className="h4">About 關於</h4>
            <p className="h6">
              現任職彩妝藝術總監。身為一個表演者，我喜歡後台的能量和創造力，但無論在哪裡
              - 在世界各地教授彩妝大師班，在全球舉行活動或參與密集的時裝週活動 -
              品牌的多樣性仍然是我持續的靈感來源。
            </p>
          </div>
          <div className="col p-0">
            <h4 className="h4">Experience 經歷</h4>
            <p className="h6">
              擔任 M.A.C 彩妝藝術總監17年。
              <br />與 Grace Jones 一起合作，並由 Jean-Paul Goude
              負責拍攝V雜誌封面。
            </p>
          </div>
        </div>
      </div>

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
                      <h4 className={`h4 ${styles.wTitle}`}>
                        {workshop.title}
                      </h4>
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
        </div>
      </div>
    </>
  )
}
