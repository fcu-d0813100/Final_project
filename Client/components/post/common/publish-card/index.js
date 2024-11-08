import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { PiChatCircle } from 'react-icons/pi'
import { FgThumbsUp, FgThumbUpFill } from '@/components/icons/figma'
import DeleteModal from '@/components/shared/modal-delete'
import styles from './index.module.scss'
export default function Index({
  postId,
  userId,
  imageSrc,
  title,
  content,
  createTime,
  likeCount,
  commentCount,
  onDelete,
}) {
  const [showModal, setShowModal] = useState(false)
  const formattedTime = createTime
    ? format(new Date(createTime), 'yyyy-MM-dd HH:mm')
    : ''
  const router = useRouter()
  return (
    <>
      {/* {showModal && (
        <DeleteModal
          title="刪除貼文"
          content={`刪除後將無法恢復，\n確定要刪除這篇貼文嗎 ?`}
          btnConfirm="確定刪除"
          btnCancel="取消"
          ConfirmFn={async () => {
            try {
              await fetch(`http://localhost:3005/api/post/delete`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                  postId,
                  userId,
                }),
              })
              setShowModal(false)
              // router.push('/user/post')
            } catch (err) {
              alert('刪除失敗，請稍後再試！')
            }
          }}
          show={showModal}
          handleClose={() => setShowModal(false)}
        />
      )} */}
      <div className={styles['post-card3']}>
        <Image src={imageSrc} alt="public image" width={200} height={200} />

        <div className={styles['post-info']}>
          <div className={styles['post-info-main']}>
            <div className={`${styles['post-main-title']} h5`}>
              {title}
              <div className={styles['ps']}>
                <button
                  onClick={() => router.push(`/user/post/edit/${postId}`)}
                >
                  編輯
                </button>
                <button onClick={onDelete}>刪除</button>
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
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
