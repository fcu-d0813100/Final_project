import React from 'react';
import styles from './index.module.scss';
import Link from 'next/link';
import { FaAnglesRight } from "react-icons/fa6";
import { useAuth } from '@/hooks/use-auth';

export default function Index({ CN }) {
  // 从 useAuth 钩子获取当前用户信息
  const { auth } = useAuth() // 使用 useAuth 获取登录状态和 userId

  // 确保 auth 对象存在并且用户已认证
  if (!auth || !auth.isAuth) {
    return null;  // 如果用户未认证，不渲染链接
  }

   // 获取 userId
   const userId = auth.userData?.id;

  // 如果没有 userId，则不渲染链接
  if (!userId) {
    return null;
  }

  return (
    <>
      <div className={styles['post-title']}>
        <span className="h3 m-2">{CN}</span>

        {/* 歷史紀錄 链接，使用动态 userId */}
        <Link href='/user/coupon/history' className={`${styles.history} text-decoration-none p d-flex align-items-center`}>
          歷史紀錄<FaAnglesRight className={`${styles.arrow} ms-1`} />
        </Link>
      </div>
    </>
  );
}
