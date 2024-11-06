'use client'
import Dropdown from '@/components/workshop/common/dropdown'
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
            <Dropdown
              name="狀態"
              items={[
                { option: '報名中', link: '' },
                { option: '已截止', link: '' },
              ]}
            />

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
              name="排序"
              items={[
                { option: '價錢 高 -- 低', link: '' },
                { option: '價錢 低 -- 高', link: '' },
                { option: '最新上架', link: '' },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  )
}
