import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import UserHeader from '@/components/user/common/user-header'
import {
  User,
  Lock,
  List,
  Star,
  Book,
  FileText,
  Calendar,
  Tag,
} from 'phosphor-react'
import styles from './index.module.scss'

export default function UserHeaderSb(props) {
  const [showSidebar, setShowSidebar] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)

  const handleClose = () => setShowSidebar(false)
  const handleShow = () => setShowSidebar(true)

  const menuItems = [
    { label: '個人資訊', icon: <User size={24} /> },
    { label: '變更密碼', icon: <Lock size={24} /> },
    { label: '訂單查詢', icon: <List size={24} /> },
    { label: '我的收藏', icon: <Star size={24} /> },
    { label: '我的課程', icon: <Book size={24} /> },
    { label: '我的貼文', icon: <FileText size={24} /> },
    { label: '我的活動', icon: <Calendar size={24} /> },
    { label: '優惠券', icon: <Tag size={24} /> },
  ]

  return (
    <>
      <UserHeader />
      <div
        className={`${styles['overlay']} ${showSidebar ? styles['show'] : ''}`}
        onClick={handleClose}
      ></div>
      <div className={`d-flex ${styles['user-section']}`}>
        <aside
          className={`${styles['user-sidebar']} ${showSidebar ? styles['open'] : ''
            }`}
        >
          <ul className={styles['info-list']}>
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`h6 ${styles['list-item']} ${activeIndex === index ? styles['active'] : ''
                  }`}
                onClick={() => setActiveIndex(index)}
              >
                <Link href={`/${item.label}`}>
                  <span className={styles['icon']}>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <button className={`btn-logout h6`}>登出</button>
        </aside>
      </div>
    </>
  )
}
