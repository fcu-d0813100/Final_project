'use client'
import styles from '@/styles/workshop/workshops.module.scss'
import Image from 'next/image'
import { PiMagnifyingGlass, PiCaretDown, PiArrowRight } from 'react-icons/pi'
import React, { useState, useEffect } from 'react'

export default function WorkshopsAll(props) {
  return (
    <>
      <div className={styles.section01}>
        <div className="container d-flex justify-content-center">
          <div className="row col-7">
            <div className={styles.main}>
              <div>
                <div className={styles.headerTitle}>
                  <p className="h5">彩妝課程</p>
                  <span className="h1-L text-light">Makeup Workshop</span>
                </div>
                <hr />
                <p className="mt-5">
                  彩妝課程為愛好美妝的你設計，從基礎到進階技巧，
                  <br />
                  掌握專業彩妝知識與實務操作，提升個人風格與美學創意。
                </p>
              </div>

              <div className={styles.searchArea}>
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="搜尋"
                  />
                  <a
                    className="d-flex align-items-center text-decoration-none ms-3 text-white ph"
                    href="#"
                  >
                    <PiMagnifyingGlass />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className={styles.selectBar}>
            <div className="d-flex align-items-center">
              <p className="m-0 me-3 h6 text-dark ">日期</p>
              <input
                type="date"
                className={`${styles.searchInput} mx-2`}
                placeholder="開始日期"
              />
              <p className="text-dark m-0">--</p>
              <input
                type="date"
                className={`${styles.searchInput} mx-2`}
                placeholder="結束日期"
              />
            </div>

            <div className="d-flex">
              <div className="dropdown mx-3">
                <a
                  href="#"
                  className={`${styles.dropdownTitle} p d-flex align-content-center justify-content-between`}
                  data-bs-toggle="dropdown"
                >
                  <p>老師</p>
                  <PiCaretDown className="ph" />
                </a>
                <div className={`dropdown-menu ${styles.dropdownMenu}`}>
                  <a href="#" className="dropdown-item my-1">
                    老師名
                  </a>
                  <a href="#" className="dropdown-item my-1">
                    老師名
                  </a>
                </div>
              </div>

              <div className="dropdown mx-3">
                <a
                  href="#"
                  className={`${styles.dropdownTitle} p d-flex align-content-center justify-content-between`}
                  data-bs-toggle="dropdown"
                >
                  <p>狀態</p>
                  <PiCaretDown className="ph" />
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
                  <p>類型</p>
                  <PiCaretDown className="ph" />
                </a>
                <div className={`dropdown-menu ${styles.dropdownMenu}`}>
                  <a href="#" className="dropdown-item my-1">
                    基礎化妝
                  </a>
                  <a href="#" className="dropdown-item my-1">
                    新娘化妝
                  </a>
                  <a href="#" className="dropdown-item my-1">
                    時尚與攝影化妝
                  </a>
                  <a href="#" className="dropdown-item my-1">
                    韓系美妝
                  </a>
                  <a href="#" className="dropdown-item my-1">
                    特效化妝
                  </a>
                  <a href="#" className="dropdown-item my-1">
                    美妝產品知識
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
                  <PiCaretDown className="ph" />
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
        </div>

        <div className={`${styles.section03} container`}>
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
