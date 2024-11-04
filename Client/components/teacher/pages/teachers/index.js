'use client'
import Dropdown from '@/components/teacher/common/teacher-dropdown'
import styles from '@/components/teacher/common/teachers.module.scss'
import Image from 'next/image'
import { PiMagnifyingGlass, PiCaretDown, PiArrowRight } from 'react-icons/pi'
import Boxrow from '@/components/teacher/common/teacher-boxrow'

import React, { useState, useEffect, Fragment } from 'react'

export default function Teachers(props) {
  return (
    <>
      <div className={styles.bodyImg}>
        <header className={styles.header}>
          <div className={`${styles.container} d-flex justify-content-center`}>
            <div className="row col-7">
              <div className={styles.main}>
                <div>
                  <p className={`${styles.headerTitle} h5`}>
                    彩妝師介紹 <br />
                    <span className="h1-L text-light">Makeup Artist</span>
                  </p>
                  <hr />
                  <p className="mt-5">
                    我們的專業，成就您的美麗。
                    <br />
                    課程由業界資深化妝師親自授課，擁有豐富的實務經驗和教學技巧，將前沿的化妝技術傳授給學員，
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`container d-flex justify-content-between align-items-center ${styles.selectBar}`}
          >
            <div className="d-flex align-items-center">
              <input
                type="text"
                className={styles.searchInput}
                placeholder="搜尋"
              />
              <a
                className="d-flex align-items-center text-decoration-none ph text-light ms-3"
                href="#"
              >
                <PiMagnifyingGlass />
              </a>
            </div>
            <div className="d-flex">
              <Dropdown
                name="類型"
                items={[
                  { option: '基礎化妝', link: '' },
                  { option: '新娘化妝', link: '' },
                  { option: '時尚與攝影化妝', link: '' },
                  { option: '韓系美妝', link: '' },
                  { option: '特效化妝', link: '' },
                  { option: '美妝產品知識', link: '' },
                ]}
              />
              <Dropdown
                name="彩妝年資"
                items={[
                  { option: '資深優先排序', link: '' },
                  { option: '資淺優先排序', link: '' },
                ]}
              />
              <Dropdown
                name="國籍"
                items={[
                  { option: '臺灣', link: '' },
                  { option: '外籍', link: '' },
                ]}
              />
            </div>
          </div>
        </header>

        <div className={`${styles.section01} container `}>
          <Boxrow />
        </div>

        <div className={`container ${styles.bottomText}`}>
          <p className="pt-3">Define Your Beauty</p>
        </div>
      </div>
    </>
  )
}
