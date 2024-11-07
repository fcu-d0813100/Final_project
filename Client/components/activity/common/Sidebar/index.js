import React, { useState, useEffect } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/use-auth'
import {
  PiUser,
  PiLockOpen,
  PiListMagnifyingGlass,
  PiHeartStraight,
  PiNotebook,
  PiListPlus,
  PiClockCountdown,
  PiTicket,
} from 'react-icons/pi'

import styles from './index.module.scss'

const navLinks = [
  {
    href: '/admin/activity',
    icon: <PiUser size={65} />,
    label: '活動管理',
    key: 'user',
  },
  {
    href: '/admin/coupon',
    icon: <PiLockOpen size={65} />,
    label: '優惠卷管理',
    key: 'password',
  },
]

export default function Sidebar() {
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
      <button className="btn-logout" onClick={logout}>
        登出
      </button>
    </Navbar>
  )
}
