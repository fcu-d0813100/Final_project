'use client'
import {
  PiMagnifyingGlass,
  PiCaretDown,
  PiArrowRight,
  PiTrash,
  PiExport,
} from 'react-icons/pi'
import Image from 'next/image'
import styles from '@/components/teacher/common/myworkshop.module.scss'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MyWorkshopBox({
  img,
  name,
  start_date,
  end_date,
  price,
  isUpload,
  registration_start,
  registration_end,
  filterStatus,
}) {
  const now = new Date()
  const regStart = new Date(registration_start)
  const regEnd = new Date(registration_end)
  const endDateObj = new Date(end_date.replace(/\//g, '-'))

  let statusText = ''
  let statusClass = ''

  if (isUpload === 0) {
    statusText = '未發布'
    statusClass = styles.unUpload
  } else if (now < regEnd) {
    statusText = '報名中'
    statusClass = styles.registering
  } else if (now >= regEnd && now <= endDateObj) {
    statusText = '已截止'
    statusClass = styles.end
  } else if (now > endDateObj) {
    statusText = '已過期'
    statusClass = styles.expired
  }
  return (
    <>
      <div className={`${styles.workshopArea}`}>
        <div className={`${styles.myWorkshop}`}>
          <div className="d-flex">
            <div className={styles.imgArea}>
              <Image
                height={190}
                width={190}
                className={styles.coverImg}
                src={img}
                alt=""
              />
            </div>
            <div className={styles.infoText}>
              <h4 className="h4">{name}</h4>
              <h5 className="h5 mb-1">開課期間</h5>
              <p className="p">
                {start_date} - {end_date}
              </p>
            </div>
          </div>

          <div className={styles.priceAndStatus}>
            <h4 className="h4 m-0 me-3">{price}</h4>
            <p className={`ps ${statusClass}`}>{statusText}</p>
          </div>

          <div href="#" className="ph d-flex gap-1">
            {filterStatus === 'unpublished' && (
              <>
                <button title="丟到垃圾桶" className={styles.trash}>
                  <PiTrash />
                </button>
                <button title="發布課程" className={styles.upload}>
                  <PiExport className="ph" />
                </button>
                <Link
                  href=""
                  className={`${styles.editBtn} h6 mx-2 text-decoration-none`}
                >
                  編輯 <PiArrowRight className={`${styles.arrow} ph ms-2`} />
                </Link>
              </>
            )}

            {filterStatus === 'trash' && (
              <>
                <button
                  className={`${styles.editBtn} h6 mx-2 text-decoration-none`}
                >
                  復原
                </button>
                <button
                  className={`${styles.deleteBtn} h6 mx-2 text-decoration-none`}
                >
                  永久刪除
                </button>
              </>
            )}

            {filterStatus === 'published' && (
              <>
                <button title="丟到垃圾桶" className={styles.trash}>
                  <PiTrash />
                </button>
                <button title="取消上傳" className={styles.upload}>
                  <PiExport
                    className="ph"
                    style={{ transform: 'rotate(180deg)' }}
                  />
                </button>
                <Link
                  href=""
                  className={`${styles.editBtn} h6 mx-2 text-decoration-none`}
                >
                  編輯 <PiArrowRight className={`${styles.arrow} ph ms-2`} />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
