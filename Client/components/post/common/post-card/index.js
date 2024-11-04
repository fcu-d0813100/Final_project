import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import Carousel from 'react-bootstrap/Carousel'
import 'bootstrap/dist/css/bootstrap.min.css'
import {
  PiHeartStraight,
  PiHeartStraightFill,
  PiChatCircle,
} from 'react-icons/pi'
import { usePost } from '@/hooks/post/use-post'
import { FgThumbsUp, FgThumbUpFill } from '@/components/icons/figma'

import styles from './index.module.scss'
import ReplyInfo from '../reply-info'
import { ImageSquare } from '@phosphor-icons/react'
export default function PostCard1({
  postAuthor,
  title,
  content,
  tags,
  postImages,
  likeCount,
  saveCount,
  commentCount,
  postCreateTime,
}) {
  const [active, setActive] = useState({})
  const icons = [
    {
      id: 1,
      default: <FgThumbsUp height="26" width="26" fill="#8A8A8A" />,
      active: <FgThumbUpFill height="26" width="26" fill="#8A8A8A" />,
    },
    {
      id: 2,
      default: <PiHeartStraight size={26} fill="#8A8A8A" />,
      active: <PiHeartStraightFill size={26} fill="#963827" />,
    },
    {
      id: 3,
      default: <PiChatCircle size={26} fill="#8A8A8A" />,
      active: <PiChatCircle size={26} fill="#8A8A8A" />,
    },
  ]
  const [inputValue, setInputValue] = useState('')
  const [focus, setFocus] = useState(false)
  const [user, setUser] = useState('')
  const [reply, setReply] = useState('')

  const formattedTime = postCreateTime
    ? format(new Date(postCreateTime), 'yyyy-MM-dd HH:mm')
    : ''
  // console.log(postImages)
  let { post } = usePost()

  if (!post) {
    return <p>Loading...</p>
  }
  const { comments } = post
  // const FocusHandle = (e) => {
  //   setFocus(true);
  //   // setInputValue(e.target.value);
  //   // if (inputValue !== '') {
  //   //   setFocus(true);
  //   // }
  // };
  const cancelHandle = (e) => {
    e.preventDefault()
    setInputValue('')
    setFocus(false)
    setUser('')
    setReply('')
  }
  const replyHandle = (text, user) => {
    setUser(user)
    setReply(text)
    setFocus(true)
  }
  const iconHandle = (iconId) => {
    //先複製原本的狀態 然後動態搜尋 改相反
    setActive((prevState) => ({
      ...prevState,
      [iconId]: !prevState[iconId],
    }))
  }

  return (
    <>
      <div className={styles['post-card3']}>
        {/* post-img with Sw*/}
        <div className={styles['post-img']}>
          <Carousel interval={null}>
            {postImages.split(',').map((image, index) => (
              <Carousel.Item key={index}>
                <Image
                  className={styles['user-image']}
                  src={`/post/${image}`}
                  alt="User Image"
                  // fill
                  // layout="responsive"
                  width={600}
                  height={650}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
        {/* post-text */}
        <div className={styles['post-text']}>
          {/* post-user */}
          <div className={styles['post-user']}>
            <Image
              className={styles['user-image']}
              src="/post/p2_1.webp"
              alt="User Image"
              width={40}
              height={40}
            />
            <div className={styles['user-name']}>{postAuthor}</div>
          </div>
          {/* mid-content */}
          <div className={styles['post-info-wrap']}>
            <div className={styles['post-info']}>
              <div className={`${styles['info-title']} h6`}>{title}</div>
              <div>
                <span className={styles['info-content']}>{content}</span>
                {tags.split(',').map((tag, index) => (
                  <span key={index}>#{tag}</span>
                ))}
              </div>
              <div className={styles['info-date']}>{formattedTime}</div>
            </div>
            <hr className={styles['line']} />
            {/* reply */}
            <div className={styles['post-reply']}>
              <div className={styles['reply-amount']}>
                共有{commentCount}條評論
              </div>
              <div className={styles['reply-container']}>
                {comments.map((comment) => (
                  <ReplyInfo
                    key={comment.comment_id}
                    onReplyClick={replyHandle}
                    comments={comment}
                    commentAuthor={comment.comment_author_nickname}
                    commentCreateTime={comment.created_at}
                    commentContent={comment.comment_content}
                    commentLikeCount={comment.comment_like_count}
                    commentReplyCount={comment.comment_reply_count}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* bott */}
          <form className={styles['post-comment']}>
            <div className={styles['reply-user']}>
              <span> {user}</span>
              <span>{reply}</span>
            </div>
            <div className={styles['reply-wrap']}>
              <input
                type="text"
                className={styles['reply-input']}
                placeholder="新增評論"
                onFocus={() => setFocus(true)}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              {!focus ? (
                <div className={styles['comment-icons']}>
                  {icons.map((icon) => (
                    <div key={icon.id}>
                      <div onClick={(e) => iconHandle(icon.id)}>
                        {active[icon.id] ? icon.active : icon.default}
                      </div>
                      <span>
                        {icon.id === 1
                          ? likeCount
                          : icon.id === 2
                          ? saveCount
                          : icon.id === 3
                          ? commentCount
                          : 1}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles['btns']}>
                  <button className={` ${styles['send']}`}>發送</button>
                  <button
                    className={`${styles['cancel']}`}
                    onClick={cancelHandle}
                  >
                    取消
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
