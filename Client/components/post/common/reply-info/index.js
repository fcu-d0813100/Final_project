import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'

import { PiChatCircle } from 'react-icons/pi'
import { FgThumbsUp, FgThumbUpFill } from '@/components/icons/figma'
import styles from './index.module.scss'

export default function ReplyInfo({
  onReplyClick = () => {},
  comments,
  commentAuthor,
  commentCreateTime,
  commentContent,
  commentLikeCount,
  commentReplyCount,
}) {
  const userRef = useRef()
  const replyRef = useRef()
  const [active, setActive] = useState(false)
  const [show, setShow] = useState(false)
  const formattedTime = commentCreateTime
    ? format(new Date(commentCreateTime), 'yyyy-MM-dd HH:mm')
    : ''
  const handle = () => {
    setActive(!active)
  }

  const icon = {
    default: <FgThumbsUp height="24" width="24" fill="#8A8A8A" />,
    hover: <FgThumbUpFill height="24" width="24" fill="#8A8A8A" />,
  }

  const replyHandle = () => {
    let user = userRef.current.textContent
    user = '回覆 ' + user
    const text = replyRef.current.textContent
    onReplyClick(text, user) // 傳遞回父組件
  }
  const showMoreHandle = () => {
    setShow(!show)
  }
  const isRootComment = comments.parent_id === null
  return (
    <>
      {/* 根評論渲染 */}
      <div
        className={`${styles['reply-wrap']} ${
          isRootComment ? styles['root-comment'] : styles['children-comment']
        }`}
        style={
          {
            // marginLeft: comments?.depth ? comments.depth * 20 + 'px' : '0px',
          }
        }
      >
        <Image
          className={styles['user-image']}
          src={`/post/p3_1.webp`}
          alt="User Image"
          width={40}
          height={40}
        />
        <div className={styles['reply-info']}>
          <div className={styles['user-name']}>
            <span ref={userRef}>{commentAuthor}</span>
            <span>{formattedTime}</span>
          </div>
          <div className={styles['user-reply']} ref={replyRef}>
            {commentContent}
          </div>
          <div className={styles['post-icons']}>
            <div className={styles['like']}>
              <div onClick={handle}>{active ? icon.hover : icon.default}</div>
              <span>{commentLikeCount}</span>
            </div>
            <div className={styles['reply']} onClick={replyHandle}>
              <PiChatCircle size={24} fill="#8A8A8A" />
              <span>{commentReplyCount > 0 ? commentReplyCount : `回覆`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 渲染第一條子評論 */}
      {comments.children && comments.children.length > 0 && (
        <div className={styles['children-comments']}>
          <ReplyInfo
            key={comments.children[0].comment_id}
            onReplyClick={onReplyClick}
            comments={comments.children[0]}
            commentAuthor={comments.children[0].comment_author_nickname}
            commentCreateTime={comments.children[0].created_at}
            commentContent={comments.children[0].comment_content}
            commentLikeCount={comments.children[0].comment_like_count}
            commentReplyCount={comments.children[0].comment_reply_count}
          />
        </div>
      )}
      {/* 展開按鈕 */}
      {!show && comments.children && comments.children.length > 1 && (
        <div className={styles['reply-more']} onClick={showMoreHandle}>
          展開 {comments.children.length - 1} 條回覆
        </div>
      )}
      {/* 顯示剩下的子評論 */}
      {show && comments.children && comments.children.length > 1 && (
        <div className={styles['children-comments']}>
          {comments.children.slice(1).map((childComment) => (
            <ReplyInfo
              key={childComment.comment_id}
              onReplyClick={onReplyClick}
              comments={childComment}
              commentAuthor={childComment.comment_author_nickname}
              commentCreateTime={childComment.created_at}
              commentContent={childComment.comment_content}
              commentLikeCount={childComment.comment_like_count}
              commentReplyCount={childComment.comment_reply_count}
            />
          ))}
        </div>
      )}
    </>
  )
}
