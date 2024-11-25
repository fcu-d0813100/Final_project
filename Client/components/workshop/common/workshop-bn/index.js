'use client'
import InputIME from '@/components/shared/input-ime/index.js'
import styles from '@/components/workshop/common/workshops.module.scss'
import { PiMagnifyingGlass, PiCaretDown, PiArrowRight } from 'react-icons/pi'
import React, { useState, useEffect } from 'react'

export default function WorkshopsBN(props) {
  return (
    <>
      <div className={styles.section01}>
        <div className="container d-flex justify-content-center">
          <div className="row  col-lg-7 ">
            <div className={styles.main}>
              <div>
                <div className={styles.headerTitle}>
                  <p className="h5">彩妝課程</p>
                  <span className="h1-L text-light"> Makeup Workshop </span>
                </div>
                <hr />
                <p className={`${styles.detailText} mt-5`}>
                  彩妝課程為愛美妝的你設計，從基礎到進階技巧，
                  <br />
                  掌握專業彩妝知識與實務操作，提升個人風格與美學創意。
                </p>
              </div>

              <div className={styles.searchArea}>
                <div className="d-flex align-items-center">
                  <InputIME
                    type="text"
                    className={styles.searchInput}
                    placeholder="搜尋"
                    value={props.search}
                    onChange={(e) => props.setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        // 當用戶按下 Enter 鍵時觸發搜尋
                        props.onSearch()
                      }
                    }}
                  />
                  <a
                    className="d-flex align-items-center text-decoration-none ms-3 text-white ph"
                    href="#"
                    onClick={props.onSearch} // 點擊圖示時觸發搜尋
                  >
                    <PiMagnifyingGlass />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
