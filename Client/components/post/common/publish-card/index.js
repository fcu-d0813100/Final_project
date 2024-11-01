import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { PiChatCircle } from 'react-icons/pi'
import { FgThumbsUp, FgThumbUpFill } from '@/components/icons/figma'
import styles from './index.module.scss'
export default function Index({
  imageSrc,
  title,
  content,
  createTime,
  likeCount,
  commentCount,
}) {
  return (
    <>
      <div className={styles['post-card3']}>
        <Image src={imageSrc} alt="public image" width={200} height={200} />

        <div className={styles['post-info']}>
          <div className={styles['post-info-main']}>
            <div className={`${styles['post-main-title']} ${styles['h5']}`}>
              {title}
              <div className={styles['ps']}>
                <button>編輯</button>
                <button>刪除</button>
              </div>
            </div>
            <div className={styles['post-main-content']}>{content}</div>
          </div>
          <div className={styles['post-info-others']}>
            <div className={styles['post-icon']}>
              <div className={styles['post-icons-like']}>
                <FgThumbsUp size={24} />
                <span>{likeCount}</span>
              </div>
              <div className={styles['post-icons-reply']}>
                <PiChatCircle size={24} />
                <span>{commentCount}</span>
              </div>
            </div>
            <div className={styles['post-date']}>
              <span>{createTime}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
