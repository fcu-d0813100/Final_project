import React, { Children } from 'react'
import SideBar from '@/components/user/common/side-bar'
import UserHeader from '@/components/user/common/user-header'
import OrderTitle from '@/components/order-list/common/order-title'
import styles from './index.module.scss'
import Footer from '@/components/home/common/footer'
import Header from '@/components/home/common/header'

export default function index({ children, titleCN, titleENG }) {
  return (
    <>
      <Header />
      <UserHeader />
      
      <div className={styles['user-section']}>
        <SideBar />
        <div className={styles['any-section']}>
          <OrderTitle CN={titleCN} ENG={titleENG} />
          {children}
        </div>
      </div>
      <Footer />

    </>
  )
}
