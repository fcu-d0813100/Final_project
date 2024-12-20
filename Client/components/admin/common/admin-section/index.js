import React, { Children } from 'react'
import AdminSB from '@/components/admin/common/admin-side-bar'
import AdminTitle from '@/components/admin/common/admin-title'
import styles from './index.module.scss'

export default function index({ children, titleCN, titleENG }) {
  return (
    <>
      <header className={`${styles.header} d-flex justify-content-between align-items-center px-5`}>
        <div className={`${["h3-L"]}`}>Beautique</div>
        <div className='h5'>Admin</div>
        <div></div>
      </header>
      <div className={styles['user-section']}>
        <AdminSB/>
        <div className={styles['any-section']}>
          <AdminTitle CN={titleCN} ENG={titleENG} />
          {children}
        </div>
      </div>
    </>
  )
}
