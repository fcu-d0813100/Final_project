import React, { useState } from 'react'
import SideBar from '@/components/user/common/side-bar'
import UserHeader from '@/components/user/common/user-header'
import UserTitle from '@/components/user/common/user-title'
import styles from './index.module.scss'

export default function Index({ children, titleCN, titleENG }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // 切換側邊欄顯示的函式
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState)
  }
  return (
    <>
      <UserHeader />
      <div className={styles['user-section']}>
        <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        {isSidebarOpen && (
          <div
            className={`${styles['overlay']} ${
              isSidebarOpen ? styles['show'] : ''
            }`}
            onClick={toggleSidebar} // 點擊遮罩時關閉側邊欄
          ></div>
        )}
        <div className={styles['any-section']}>
          <UserTitle CN={titleCN} ENG={titleENG} />
          {children}
        </div>
      </div>
    </>
  )
}
