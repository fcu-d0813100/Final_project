import React from 'react'
import Link from 'next/link'
import { PiPlus } from 'react-icons/pi'
import 'bootstrap/dist/css/bootstrap.min.css'
import styles from './index.module.scss'
import UserCard from '../../common/userCard'
import AdminSB from '@/components/admin/common/admin-side-bar'
import UserTitle from '@/components/user/common/user-title'
import Sidebar from '@/components/activity/common/Sidebar'
export default function Index(props) {
  return (
    <>
      <header
        className={`${styles.header} d-flex justify-content-between align-items-center px-5`}
      >
        <div className="h3">Beautique</div>
        <div className="h5">Admin</div>
      </header>

      <div className={styles['user-section']}>
        <Sidebar />
        <div className={styles['any-section']}>
          <UserTitle CN="活動管理" ENG="Activity Management" />

          <div className={`${styles['card-Area']} d-flex mt-5 flex-wrap`}>
            {/* 多个 UserCard，每个 UserCard 独立包裹在 Link 内 */}

            <UserCard />

            <UserCard />

            <UserCard />

            <UserCard />

            {/* 新增活动按钮 */}
            <Link href="/admin/activity/upload">
              <button className={`${styles['new-act']}  mt-5 `}>
                <div className="text-center">
                  <PiPlus className={styles.plus} />
                  <p className={`${styles.picUploadText} h4 mt-3`}>新增活動</p>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
