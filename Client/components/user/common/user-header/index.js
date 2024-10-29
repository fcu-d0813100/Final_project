import React, { useState } from 'react'
import Image from 'next/image'
import styles from './index.module.scss'

export default function UserHeader(props) {
  const [showSidebar, setShowSidebar] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)

  const handleClose = () => setShowSidebar(false)
  const handleShow = () => setShowSidebar(true)

  return (
    <div className={styles['user-header']}>
      <div className={`${styles['header-img']}`}>
        <h1 className={`h1-L text-white ${styles['welcome-msg']}`}>
          WELCOME！
        </h1>
        <br />
        <h4 className={`h3 text-white ${styles['welcome-name']}`}>王美美</h4>
      </div>
      <Image
        className={styles['user-header-icon']}
        src="/user/user-list.png"
        alt="User Icon"
        width={30}
        height={30}
        onClick={handleShow}
        tabIndex={0}
        role="button"
        aria-label={showSidebar ? '關閉側邊欄' : '打開側邊欄'}
      />
    </div>
  )
}