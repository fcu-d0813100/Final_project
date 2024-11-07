'use client'
import styles from '@/components/workshop/common/workshops.module.scss'
import Image from 'next/image'
import { PiMagnifyingGlass, PiCaretDown, PiArrowRight } from 'react-icons/pi'
import React, { useState, useEffect } from 'react'

export default function WorkshopSelectbar(props) {
  return (
    <>
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
    </>
  )
}
