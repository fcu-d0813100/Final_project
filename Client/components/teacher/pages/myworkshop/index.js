'use client'
import Image from 'next/image'
import Dropdown from '@/components/workshop/common/dropdown'
import {
  PiMagnifyingGlass,
  PiCaretDown,
  PiArrowRight,
  PiTrash,
  PiExport,
} from 'react-icons/pi'
import styles from '@/components/teacher/common/myworkshop.module.scss'
import Sidebar from '@/components/teacher/common/t-dashboard-side-bar'
import TDashboardBN from '@/components/teacher/common/t-dashboard-bn'
import DashboardTitle from '@/components/shared/dashboard-title-y'
import React, { useState, useEffect } from 'react'
import { Link } from 'phosphor-react'

export default function MyWorkshop(props) {
  return (
    <>
      <TDashboardBN teacher="Gina Bettelli" />

      <div>
        <Sidebar />

        <div className={styles.main}>
          <DashboardTitle chTitle="我的課程" enTitle="workshop" />

          <div>
            <div className={styles.selectbar}>
              <div className={styles.searchArea}>
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="搜尋"
                  />
                  <a
                    className="d-flex align-items-center text-decoration-none ms-3 text-dark ph"
                    href="#"
                  >
                    <PiMagnifyingGlass />
                  </a>
                </div>

                <div className="d-flex ">
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
          </div>
          <div className={`${styles.filterBtn} p ms-2 mb-3`}>
            <button>未發布</button>
            <button>已發布</button>
            <button>垃圾桶</button>
          </div>
          <div className={`${styles.workshopArea}`}>
            <button className={`${styles.myWorkshop}`}>
              <div className="d-flex">
                <div className={styles.imgArea}>
                  <Image
                    height={190}
                    width={190}
                    className={styles.coverImg}
                    src="/workshop/workshop_img/1-1-c.jpg"
                    alt=""
                  />
                </div>
                <div className={styles.infoText}>
                  <h4 className="h4">妝容持久與調整技巧課程</h4>
                  <h5 className="h5 mb-1">開課期間</h5>
                  <p className="p">2024/09/30 - 2024/10/30</p>
                </div>
              </div>

              <div className={styles.priceAndStatus}>
                <h4 className="h4 m-0 me-3">NT$3200</h4>
                {/* <p className={`ps ${styles.unUpload}`}>未發布</p> */}
                {/* <p className={`ps ${styles.registering}`}>報名中</p> */}
                {/* <p className={`ps ${styles.end}`}>已截止</p> */}
                <p className={`ps ${styles.expired}`}>已過期</p>
              </div>

              <div href="#" className="ph d-flex gap-1">
                <button className={styles.trash}>
                  <PiTrash />
                </button>
                <button className={styles.upload}>
                  <PiExport className="ph" />
                </button>
                <button className={`${styles.editBtn} h6 mx-2`}>
                  編輯 <PiArrowRight className={`${styles.arrow} ph ms-2`}/>
                </button>
              </div>
            </button>

          
          </div>
        </div>
      </div>
    </>
  )
}
