import React, { useState, useEffect } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { useRouter } from 'next/router'
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
    href: '/teacher/information',
    icon: <PiUser size={65} />,
    label: '個人資訊',
    key: 'user',
  },
  {
    href: '/teacher/myworkshop',
    icon: <PiLockOpen size={65} />,
    label: '我的課程',
    key: 'password',
  },
  {
    href: '/teacher/upload',
    icon: <PiListMagnifyingGlass size={65} />,
    label: '課程上架',
    key: 'order',
  },
]

export default function Sidebar() {
  const router = useRouter()

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
      <button className="btn-logout">登出</button>
    </Navbar>
  )
}
