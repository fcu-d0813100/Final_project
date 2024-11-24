import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import { RiCheckboxCircleFill } from 'react-icons/ri'
import { PiChatCircle, PiDotsThree } from 'react-icons/pi'
import { useAuth } from '@/hooks/use-auth'
import styles from './index.module.scss'
import PostIcon from '../post-icon'
import { usePost } from '@/hooks/post/use-post'
import useAlert from '@/hooks/alert/use-alert'
import useToast from '@/hooks/toast/use-toast'

export default function ReplyInfo({
  onReplyClick = () => {},
  comments,
  commentId,
  commentAuthorId,
  commentAuthor,
  commentAuthorAvatar,
  commentCreateTime,
  commentContent,
  commentLikeCount,
  commentReplyTarget,
}) {
  const userRef = useRef()
  const userIdRef = useRef()
  const replyRef = useRef()
  const [show, setShow] = useState(false)
  const [commentLiked, setCommentLiked] = useState(false) // comment like
  const { auth } = useAuth()
  const userId = auth.userData.id
  const { forceUpdate } = usePost()
  const commentIdRef = useRef() //delete comment
  const showToast = useToast()

  const showAlert = useAlert()
  const formattedTime = commentCreateTime
    ? format(new Date(commentCreateTime), 'yyyy-MM-dd HH:mm')
    : ''

  const replyHandle = () => {
    let user = userRef.current.textContent
    let replyTargetId = userIdRef.current.textContent
    user = '回覆 ' + user
    const text = replyRef.current.textContent
    onReplyClick(text, user, replyTargetId, comments.comment_id) // 傳遞回父組件
    // console.log(commentId)
  }
  const showMoreHandle = () => {
    setShow(!show)
  }

  // GET COMMENT LIKE
  useEffect(() => {
    if (commentId && userId) {
      fetchCommentLike(commentId)
    }
  }, [commentId, userId])

  const fetchCommentLike = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/post/comment/isLiked/${commentId}/${userId}`
      )
      const data = await response.json()
      setCommentLiked(data.isLiked)
      // console.log(data.isLiked)
    } catch (error) {
      console.log(error)
    }
  }
  // COMMENT LIKE TOGGLE
  const commentLikeToggle = async () => {
    try {
      if (commentLiked) {
        await fetch(
          `http://localhost:3005/api/post/comment/dislike/${commentId}/${userId}`,
          {
            method: 'DELETE',
          }
        )
      } else {
        await fetch(
          `http://localhost:3005/api/post/comment/like/${commentId}/${userId}`,
          {
            method: 'POST',
          }
        )
      }
      setCommentLiked(!commentLiked)
      forceUpdate()
    } catch (error) {
      console.log('Error', error)
    }
  }
  //DELETE COMMENT
  const deleteComment = async () => {
    if (!userId || userId == 0) {
      alert('請先登入')
    }
    let deleteCommentId = commentIdRef.current.textContent
    // console.log(deleteCommentId)
    // console.log(userId)
    try {
      await fetch(`http://localhost:3005/api/post/comment_delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          commentId: deleteCommentId,
          userId,
        }),
      })
      showToast('刪除成功', 'success')
      // showAlert('刪除成功', <RiCheckboxCircleFill color="#90957A" />)
      forceUpdate()
    } catch (err) {
      showToast('刪除失敗，請稍後再試！', 'error')
    }
  }

  return (
    <>
      {comments.comment_id === null ? (
        <div>目前尚無評論</div>
      ) : (
        <div
          className={`${styles['reply-wrap']} ${styles['children-comment']}`}
        >
          <Image
            className={styles['user-image']}
            // src={`/user/img/${commentAuthorAvatar}`}
            src={`http://localhost:3005/avatar/${commentAuthorAvatar}`}
            alt="User Image"
            width={40}
            height={40}
          />
          <div className={styles['reply-info']}>
            <div className={styles['user-name']}>
              <div className={styles['user-info']}>
                <span ref={userRef}>{commentAuthor}</span>
                <span ref={userIdRef} style={{ display: 'none' }}>
                  {commentAuthorId}
                </span>
                <span>{formattedTime}</span>
              </div>

              {commentAuthorId === userId && (
                <span role="button" tabIndex={0} onBlur={() => setShow(false)}>
                  <PiDotsThree
                    style={{ cursor: 'pointer' }}
                    onClick={showMoreHandle}
                  />
                  {show && (
                    <div className={styles['reply-delete-wrap']}>
                      <div
                        className={styles['reply-delete']}
                        onClick={deleteComment}
                      >
                        刪除
                      </div>
                    </div>
                  )}
                </span>
              )}
            </div>
            <div className={styles['user-reply']} ref={replyRef}>
              <span>
                {commentReplyTarget ? `回覆 ${commentReplyTarget} : ` : null}
              </span>
              {commentContent}
            </div>
            <div ref={commentIdRef} style={{ display: 'none' }}>
              {commentId}
            </div>
            <div className={styles['post-icons']}>
              <div className={styles['like']}>
                <PostIcon
                  id={commentId}
                  icon="like"
                  size={24}
                  count={commentLikeCount}
                  initialToggled={commentLiked}
                  onToggle={commentLikeToggle}
                />
                {/* <div onClick={toggleHandle}>{icon.like}</div>
                <span>{commentLikeCount}</span> */}
              </div>
              <div className={styles['reply']} onClick={replyHandle}>
                <PiChatCircle size={24} fill="#8A8A8A" />
                <span>回覆</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
