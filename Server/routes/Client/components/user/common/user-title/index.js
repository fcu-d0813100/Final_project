import React from 'react'
import styles from '@/components/user/common/user-title/index.module.scss'
export default function index({ CN, ENG }) {
  return (
    <>
      <div className={styles['post-title']}>
        <span className="h3">{CN}</span>
        <span className="h1-L">{ENG}</span>
      </div>
    </>
  )
}
