import React, { useState } from 'react'
import styles from './index.module.scss'

export default function UserHeader(props) {
  return (
    <div className={styles['user-header']}>
      <div className={`${styles['header-img']}`}>
        <h1 className={`h1-L text-white ${styles['welcome-msg']}`}>
          WELCOME！
        </h1>
        <br />
        <h4 className={`h3 text-white ${styles['welcome-name']}`}>王美美</h4>
      </div>
    </div>
  )
}