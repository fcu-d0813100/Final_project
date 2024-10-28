'use client'
import styles from '@/components/workshop/common/workshops.module.scss'
import { PiMagnifyingGlass, PiCaretDown, PiArrowRight } from 'react-icons/pi'
import React, { useState, useEffect } from 'react'

export default function WorkshopsBN(props) {
  return (
    <>
      <div className={styles.section01}>
        <div className="container d-flex justify-content-center">
          <div className="row col-7">
            <div className={styles.main}>
              <div>
                <div className={styles.headerTitle}>
                  <p className="h5">彩妝課程</p>
                  <span className="h1-L text-light"> Makeup Workshop </span>
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
      </div>
    </>
  )
}
