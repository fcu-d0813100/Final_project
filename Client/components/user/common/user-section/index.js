import React, { Children } from 'react'
import SideBar from '@/components/user/common/side-bar'
import UserHeader from '@/components/user/common/user-header'
import UserTitle from '@/components/user/common/user-title'
import styles from './index.module.scss'
export default function index({children,titleCN,titleENG }) {
  return (
    <>
        <UserHeader/>
        <div className={styles['user-sction']}>
            <SideBar/>
            <div className={styles['any-sction']}>
                <UserTitle CN={titleCN} ENG={titleENG}/>
                {children}
            </div>
        </div>
        
    </>
  )
}
