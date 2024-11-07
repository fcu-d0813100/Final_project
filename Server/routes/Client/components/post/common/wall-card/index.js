import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FgThumbsUp, FgThumbUpFill } from '@/components/icons/figma'

import styles from './index.module.scss'
export default function Index({
  postId,
  href,
  imageSrc,
  title,
  avatarSrc,
  username,
  likeCount,
}) {
  const [isSaved, setIsSaved] = useState(null)
  useEffect(() => {
    // 發送 API 請求取得收藏狀態
    fetch(`/api/posts/${postId}/isSaved`)
      .then((res) => res.json())
      .then((data) => {
        // 根據 API 返回的狀態更新 isSaved，假設返回的狀態為布林值
        setIsSaved(data.isSaved)
      })
      .catch((err) => {
        console.error(err)
        setIsSaved(false) // 若發生錯誤，設定為未收藏
      })
  }, [postId])
  return (
    <>
      <div className={styles['post-card1']}>
        <div className={styles['post-img']}>
          <Link href={href || '/'}>
            <Image
              src={imageSrc || '/post/user-img.png'}
              alt="share image"
              sizes="100%"
              width={0}
              height={0}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
              }}
              priority
            />
          </Link>
        </div>
        <div className={styles['post-title']}>{title}</div>
        <div className={styles['post-info']}>
          <div className={styles['post-info-user']}>
            <Image src={avatarSrc} width={24} height={24} alt="User avatar" />
            <p className="p">{username}</p>
          </div>
          <div className={styles['post-info-like']}>
            <FgThumbsUp />
            <p className="p">{likeCount}</p>
          </div>
        </div>
      </div>
    </>
  )
}
