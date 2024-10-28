'use client'
import styles from '@/components/teacher/common/teacher-detail.module.scss'
import Image from 'next/image'
import { PiMagnifyingGlass, PiCaretDown, PiArrowRight } from 'react-icons/pi'

import WorkshopCardT from '@/components/teacher/common/workshop-card-t'
import TeacherDetailBn from '@/components/teacher/common/teacher-detail-bn'
import TeacherDetailText from '@/components/teacher/common/teacher-detail-text'

import React, { useState, useEffect } from 'react'

export default function TeacherDetail(props) {
  return (
    <>
      <TeacherDetailBn />

      <TeacherDetailText/>

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

          <WorkshopCardT />
        </div>
      </div>
    </>
  )
}
