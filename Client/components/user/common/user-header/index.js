import React, { useState, useEffect } from 'react'
import styles from './index.module.scss'
import { useAuth } from '@/hooks/use-auth'

export default function UserHeader(props) {
  const { auth, getUser } = useAuth()
  const [userData, setUserData] = useState(auth.userData)
  // 獲取用戶信息
  const fetchUserData = async () => {
    try {
      const user = await getUser()
      setUserData(user)
    } catch (error) {
      console.error('獲取用戶信息失敗:', error)
    }
  }
  useEffect(() => {
    fetchUserData()
  }, [])
  return (
    <div className={styles['user-header']}>
      <div className={`${styles['header-img']}`}>
        <h1 className={`h1-L text-white ${styles['welcome-msg']}`}>
          WELCOME！
        </h1>
        <br />
        <h4 className={`h3 text-white ${styles['welcome-name']}`}>
          {userData.name}
        </h4>
      </div>
    </div>
  )
}
