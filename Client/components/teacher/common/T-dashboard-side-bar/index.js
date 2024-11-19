import React, { useState, useEffect } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/use-auth'
import { PiUser, PiNotePencil, PiNotebook } from 'react-icons/pi'

import styles from './index.module.scss'

const navLinks = [
  {
    href: '/teacher/information',
    icon: <PiUser size={68} />,
    label: '個人資訊',
    key: 'user',
  },
  {
    href: '/teacher/upload',
    icon: <PiNotePencil size={68} />,
    label: '課程上架',
    key: 'order',
  },
  {
    href: '/teacher/myworkshop',
    icon: <PiNotebook size={68} />,
    label: '我的課程',
    key: 'password',
  },
]

export default function Sidebar() {
  const router = useRouter()
  const { logout } = useAuth()
  const [workshop, setWorkshop] = useState(null)

  const [linkState, setLinkState] = useState(
    navLinks.reduce((acc, link) => {
      acc[link.key] = { hover: false, active: router.pathname === link.href }
      return acc
    }, {})
  )

  useEffect(() => {
    fetchData()
  }, []) // 將 filterStatus 作為依賴項

  const fetchData = async () => {
    try {
      const response = await fetch(
        'http://localhost:3005/api/workshop/myWorkshop',
        {
          credentials: 'include', //一定要加，才會帶cookie
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (!response.ok) {
        throw new Error('網路回應不成功：' + response.status)
      }
      const data = await response.json()
      setWorkshop(...data) // 確保獲取到的資料即時更新
      //console.log(data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    setLinkState((prev) => {
      const newLinkState = { ...prev }
      navLinks.forEach((link) => {
        const isActive =
          router.pathname === link.href ||
          (link.href === '/teacher/myworkshop' &&
            (router.pathname.startsWith('/teacher/workshopEdit') ||
              (workshop &&
                router.pathname === `/teacher/workshopEdit/${workshop.id}`)))
        newLinkState[link.key].active = isActive
      })
      return newLinkState
    })
  }, [router.pathname, workshop])

  const handleMouseEnter = (key) => {
    setLinkState((prev) => ({
      ...prev,
      [key]: { ...prev[key], hover: true },
    }))
  }

  const handleMouseLeave = (key) => {
    setLinkState((prev) => ({
      ...prev,
      [key]: { ...prev[key], hover: false },
    }))
  }

  return (
    <Navbar expand="lg" className={styles['nav']}>
      <Navbar.Toggle
        aria-controls="basic-navbar-nav"
        className={styles['toggle-btn']}
      />
      <Navbar.Collapse
        id="basic-navbar-nav"
        className={`${styles['collapse']} justify-content-center`}
      >
        <Nav>
          {navLinks.map((link) => (
            <Nav.Link
              key={link.key}
              href={link.href}
              className={`${
                linkState[link.key].active
                  ? styles['active']
                  : linkState[link.key].hover
                  ? styles['hover']
                  : ''
              }`}
              onMouseEnter={() => handleMouseEnter(link.key)}
              onMouseLeave={() => handleMouseLeave(link.key)}
            >
              {link.icon}
              {link.label}
            </Nav.Link>
          ))}
        </Nav>
      </Navbar.Collapse>
      <button
        onClick={() => {
          logout()
        }}
        className="btn-logout"
      >
        登出
      </button>
    </Navbar>
  )
}
