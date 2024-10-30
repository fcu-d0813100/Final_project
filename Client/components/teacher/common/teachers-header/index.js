'use client'
import styles from '@/components/teacher/common/teachers.module.scss'
import { PiMagnifyingGlass, PiCaretDown } from 'react-icons/pi'
import React, { useState, useEffect } from 'react'

export default function TeachersHeader(props) {
  return (
    <>
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
            <div className="dropdown mx-3">
              <a
                href="#"
                className={`${styles.dropdownTitle} p d-flex align-content-center justify-content-between`}
                data-bs-toggle="dropdown"
              >
                <p>類型</p>
                <PiCaretDown />
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
                <p>彩妝年資</p>
                <PiCaretDown />
              </a>
              <div className={`dropdown-menu ${styles.dropdownMenu}`}>
                <a href="#" className="dropdown-item my-1">
                  資深優先排序
                </a>
                <a href="#" className="dropdown-item my-1">
                  資淺優先排序
                </a>
              </div>
            </div>

            <div className="dropdown mx-3">
              <a
                href="#"
                className={`${styles.dropdownTitle} p d-flex align-content-center justify-content-between`}
                data-bs-toggle="dropdown"
              >
                <p>國籍</p>
                <PiCaretDown />
              </a>
              <div className={`dropdown-menu ${styles.dropdownMenu}`}>
                <a href="#" className="dropdown-item my-1">
                  臺灣
                </a>
                <a href="#" className="dropdown-item my-1">
                  外籍
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
