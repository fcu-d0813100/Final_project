import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Tab, Nav } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import styles from './index.module.scss'
import UserCard from '../../common/userCard'
import UserSection from '@/components/user/common/user-section'
import { PiPlus } from 'react-icons/pi'
import AdminSB from '@/components/admin/common/admin-side-bar'
import UserTitle from '@/components/user/common/user-title'
export default function Index(props) {
  return (
    <>
      <header
        className={`${styles.header} d-flex justify-content-between align-items-center px-5`}
      >
        <div className={`${['h3-L']}`}>Beautique</div>
        <div className="h5">Admin</div>
      </header>
      <div className={styles['user-section']}>
        <AdminSB />
        <div className={styles['any-section']}>
          <UserTitle CN="活動管理" ENG="Activity Management" />
          <div>
            <div className={`${styles['card-Area']} d-flex mt-5`}>
              <Link href="#">
                <UserCard />
              </Link>

              <Link href="/admin/activity/upload">
                <button className={styles['new-act']}>
                  <div className="text-center">
                    <PiPlus className={styles.plus} />
                    <p className={`${styles.picUploadText} h4 mt-3`}>
                      新增活動
                    </p>
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
