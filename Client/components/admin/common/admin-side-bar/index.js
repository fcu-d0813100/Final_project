import React, { useState, useEffect } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/use-auth'
import {
  PiClockCountdown,
  PiTicket,
  PiUser,
  PiChalkboardTeacher,
} from 'react-icons/pi'
import styles from './index.module.scss'

const navLinks = [
  {
    href: '/admin/coupon',
    icon: <PiTicket size={68} />,
    label: '優惠券管理',
    key: 'coupon',
  },
  {
    href: '/admin/activity',
    icon: <PiClockCountdown size={68} />,
    label: '活動管理',
    key: 'activity',
  },

  {
    href: '',
    icon: <PiUser size={68} />,
    label: '會員管理',
    key: 'users',
  },
  {
    href: '',
    icon: <PiChalkboardTeacher size={68} />,
    label: '師資管理',
    key: 'teachers',
  },
]

export default function Index() {
  const router = useRouter()
  const { logout } = useAuth()

  const [linkState, setLinkState] = useState(
    navLinks.reduce((acc, link) => {
      acc[link.key] = { hover: false, active: router.pathname === link.href }
      return acc
    }, {})
  )

  useEffect(() => {
    setLinkState((prev) => {
      const newLinkState = { ...prev }
      navLinks.forEach((link) => {
        newLinkState[link.key].active = router.pathname === link.href
      })
      return newLinkState
    })
  }, [router.pathname])

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
              } h6`}
              onMouseEnter={() => handleMouseEnter(link.key)}
              onMouseLeave={() => handleMouseLeave(link.key)}
            >
              {link.icon}
              {link.label}
            </Nav.Link>
          ))}
          <button className={`btn-logout h6 ${styles.out}`} onClick={logout}>
            登出
          </button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
