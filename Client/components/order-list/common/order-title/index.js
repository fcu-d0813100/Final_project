import React from 'react'
import Link from 'next/link';
import styles from './index.module.scss'
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

export default function index({ CN, ENG }) {
  return (
    <>
      <div className={styles['post-title']}>
        <span className="h3 p-2">{CN}</span>
        <span className="h1-L">{ENG}</span>

        <div className={`${styles["title-right"]} ${styles.search} p d-flex align-items-center`}>
          <input type="search" placeholder="可透過訂單編號或商品名稱搜尋" className="p-2" />
          <Link
            href=""
            passHref
            className={`text-decoration-none ${styles["icon-color"]} `}
          >
            <HiMiniMagnifyingGlass size={24} />
          </Link>
        </div>
      </div>
    </>
  )
}
