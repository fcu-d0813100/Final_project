import React, { Children } from 'react'
import SideBar from '@/components/user/common/side-bar'
import UserHeader from '@/components/user/common/user-header'
import UserCouponTitle from '@/components/discount/common/user-coupon-title'
import styles from './index.module.scss'

export default function index({ children, titleCN, titleENG }) {
  return (
    <>
      <UserHeader />
      <div className={styles['user-section']}>
        <SideBar />
        <div className={styles['any-section']}>
          <UserCouponTitle CN={titleCN}  />
          {children}
        </div>
      </div>
    </>
  )
}
