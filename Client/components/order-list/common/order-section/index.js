import React, { Children } from 'react'
import SideBar from '@/components/user/common/side-bar'
import UserHeader from '@/components/user/common/user-header'
import OrderTitle from '@/components/order-list/common/order-title'
import styles from './index.module.scss'

export default function index({ children, titleCN, titleENG }) {
  return (
    <>
      <UserHeader />
      <div className={styles['user-section']}>
        <SideBar />
        <div className={styles['any-section']}>
         
          {children}
        </div>
      </div>
    </>
  )
}
