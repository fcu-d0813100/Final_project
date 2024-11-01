import React, { useState, useEffect } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { useRouter } from 'next/router';
import {
  PiUser,
  PiLockOpen,
  PiListMagnifyingGlass,
  PiHeartStraight,
  PiNotebook,
  PiListPlus,
  PiClockCountdown,
  PiTicket,
} from 'react-icons/pi';
import styles from './index.module.scss';

const navLinks = [
  {
    href: '/user',
    icon: <PiUser size={65} />,
    label: '個人資訊',
    key: 'user',
  },
  {
    href: '/user/password',
    icon: <PiLockOpen size={65} />,
    label: '變更密碼',
    key: 'password',
  },
  {
    href: '/user/order',
    icon: <PiListMagnifyingGlass size={65} />,
    label: '訂單查詢',
    key: 'order',
  },
  {
    href: '/user/favorite',
    icon: <PiHeartStraight size={65} />,
    label: '我的收藏',
    key: 'favorite',
  },
  {
    href: '/user/workshop',
    icon: <PiNotebook size={65} />,
    label: '我的課程',
    key: 'workshop',
  },
  {
    href: '/user/post',
    icon: <PiListPlus size={65} />,
    label: '我的貼文',
    key: 'post',
  },
  {
    href: '/user/activity',
    icon: <PiClockCountdown size={65} />,
    label: '活動紀錄',
    key: 'activity',
  },
  {
    href: '/user/coupon',
    icon: <PiTicket size={65} />,
    label: '優惠券',
    key: 'coupon',
  },
];

export default function Index() {
  const router = useRouter();

  const [linkState, setLinkState] = useState(
    navLinks.reduce((acc, link) => {
      acc[link.key] = { hover: false, active: router.pathname === link.href };
      return acc;
    }, {})
  );

  useEffect(() => {
    setLinkState((prev) => {
      const newLinkState = { ...prev };
      navLinks.forEach((link) => {
        newLinkState[link.key].active = router.pathname === link.href;
      });
      return newLinkState;
    });
  }, [router.pathname]);

  const handleMouseEnter = (key) => {
    setLinkState((prev) => ({
      ...prev,
      [key]: { ...prev[key], hover: true },
    }));
  };

  const handleMouseLeave = (key) => {
    setLinkState((prev) => ({
      ...prev,
      [key]: { ...prev[key], hover: false },
    }));
  };

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
              className={`${linkState[link.key].active
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
          <button className="btn-logout h6">登出</button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
