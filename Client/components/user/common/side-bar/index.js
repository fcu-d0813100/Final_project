import React, { useState, useEffect } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/use-auth';

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
    href: '/user', // 个人信息
    icon: <PiUser size={65} />,
    label: '個人資訊',
    key: 'user',
  },
  {
    href: '/user/password', // 更改密码
    icon: <PiLockOpen size={65} />,
    label: '變更密碼',
    key: 'password',
  },
  {
    href: '/user/order', // 订单查询
    icon: <PiListMagnifyingGlass size={65} />,
    label: '訂單查詢',
    key: 'order',
  },
  {
    href: '/user/favorite', // 我的收藏
    icon: <PiHeartStraight size={65} />,
    label: '我的收藏',
    key: 'favorite',
  },
  {
    href: '/user/workshop', // 我的课程
    icon: <PiNotebook size={65} />,
    label: '我的課程',
    key: 'workshop',
  },
  {
    href: '/user/post', // 我的贴文
    icon: <PiListPlus size={65} />,
    label: '我的貼文',
    key: 'post',
  },
  {
    href: '/user/activity', // 活动记录
    icon: <PiClockCountdown size={65} />,
    label: '活動紀錄',
    key: 'activity',
  },
  {
    href: '/user/coupon', // 优惠券
    icon: <PiTicket size={65} />,
    label: '優惠券',
    key: 'coupon',
  },
];

export default function Index() {
  const router = useRouter();
  const { logout, auth } = useAuth(); // 使用 useAuth 获取登录状态和 userId
  const [linkState, setLinkState] = useState(
    navLinks.reduce((acc, link) => {
      acc[link.key] = { hover: false, active: router.pathname === link.href };
      return acc;
    }, {})
  );

  const userId = auth.isAuth ? auth.userData.id : null; // 从 useAuth 获取 userId

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
      <Navbar.Toggle aria-controls="basic-navbar-nav" className={styles['toggle-btn']} />
      <Navbar.Collapse id="basic-navbar-nav" className={`${styles['collapse']} justify-content-center`}>
        <Nav>
          {navLinks.map((link) => {
            // 动态更新所有链接，基于 userId 动态拼接路径
            const updatedHref = userId && link.href.includes('/user/')
              ? `${link.href}/${userId}`  // 如果是 '/user' 开头的链接，动态加上 userId
              : link.href; // 否则保持原路径不变

            return (
              <Nav.Link
                key={link.key}
                href={updatedHref}
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
            );
          })}
          <button
            className="btn-logout h6"
            onClick={() => {
              logout();
            }}
          >
            登出
          </button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
