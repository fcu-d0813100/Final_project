import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PiChatCircle } from 'react-icons/pi'
import { FgThumbsUp, FgThumbUpFill } from '@/components/icons/figma'
import DeleteModal from '@/components/shared/modal-delete'
import styles from './index.module.scss'
export default function Index({
  postId,
  imageSrc,
  title,
  content,
  createTime,
  likeCount,
  commentCount,
}) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      {showModal && (
        <DeleteModal
          title="刪除貼文"
          content={`刪除後將無法恢復，\n確定要刪除這篇貼文嗎 ?`}
          btnConfirm="確定刪除"
          btnCancel="取消"
          ConfirmFn={() => {}} //刪除的函數
          show={showModal}
          handleClose={() => setShowModal(false)}
        />
      )}
      <div className={styles['post-card3']}>
        <Image src={imageSrc} alt="public image" width={200} height={200} />

        <div className={styles['post-info']}>
          <div className={styles['post-info-main']}>
            <div className={`${styles['post-main-title']} ${styles['h5']}`}>
              {title}
              <div className={styles['ps']}>
                <Link href={`/user/post/edit/${postId}`}>編輯</Link>
                <button onClick={() => setShowModal(true)}>刪除</button>
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