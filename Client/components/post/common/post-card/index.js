import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { PiChatCircle } from 'react-icons/pi'
import Image from 'next/image'
import Carousel from 'react-bootstrap/Carousel'
import 'bootstrap/dist/css/bootstrap.min.css'
import { usePost } from '@/hooks/post/use-post'
import { useAction } from '@/hooks/post/use-action'
import { useModal } from '@/hooks/use-modal'
import ReplyInfo from '../reply-info'
import PostIcon from '../post-icon'
import styles from './index.module.scss'
// import ModalConfirm from '@/components/shared/modal-confirm'
export default function PostCard({
  postAuthor,
  authorAvatar,
  title,
  content,
  tags,
  postImages,
  likeCount,
  saveCount,
  commentCount,
  postCreateTime,
  comments,
  sendHandle,
  setCancelHandle = {},
}) {
  // post & user
  const { post } = usePost()
  const postId = post?.id

  const { ensureLoggedIn } = useModal()

  // action
  const { liked, likeToggle, saved, saveToggle } = useAction(postId, {
    fetchLike: true,
    fetchSave: true,
  })
  // data
  const [inputValue, setInputValue] = useState('')
  const [replyTarget, setReplyTarget] = useState('')
  const [replyTargetId, setReplyTargetId] = useState('')
  const [reply, setReply] = useState('')
  const [replyId, setReplyId] = useState('')
  // ui
  const [index, setIndex] = useState(0)
  const [focus, setFocus] = useState(false)

  const images = postImages.split(',')
  const formattedTime = postCreateTime
    ? format(new Date(postCreateTime), 'yyyy-MM-dd HH:mm')
    : ''

  useEffect(() => {
    setCancelHandle(() => cancelHandle)
  }, [setCancelHandle])

  useEffect(() => {
    if (focus) {
      if (!ensureLoggedIn()) return
    }
  }, [focus])

  const cancelHandle = (e) => {
    e && e.preventDefault()
    setInputValue('')
    setFocus(false)
    setReplyTarget('')
    setReply('')
    setReplyId('')
  }

  const replyHandle = (text, user, replyTargetId, replyId) => {
    if (!ensureLoggedIn()) return

    setReplyTargetId(replyTargetId)
    setReplyId(replyId)
    setReplyTarget(user)
    setReply(text)
    setFocus(true)
  }

  // carousel
  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1)
    }
  }

  const handleNext = () => {
    if (index < images.length - 1) {
      setIndex(index + 1)
    }
  }

  return (
    <>
      <div className={styles['post-card3']}>
        {/* post-img with Carousel */}
        <div className={styles['post-img-wrap']}>
          <Carousel
            indicators={true}
            activeIndex={index}
            interval={null}
            prevIcon={
              <span
                aria-hidden="true"
                className="carousel-control-prev-icon"
                onClick={handlePrev}
                style={{ cursor: index === 0 ? 'not-allowed' : 'pointer' }}
              />
            }
            nextIcon={
              <span
                aria-hidden="true"
                className="carousel-control-next-icon"
                onClick={handleNext}
                style={{
                  cursor:
                    index === images.length - 1 ? 'not-allowed' : 'pointer',
                }}
              />
            }
          >
            {postImages.split(',').map((image, index) => {
              const imgSrc = `http://localhost:3005/post/${image}`
              return (
                <Carousel.Item key={index}>
                  <Image
                    className={styles['post-image']}
                    src={imgSrc}
                    alt="Share Image"
                    // width={600}
                    // height={650}
                    priority
                    fill
                    // layout="responsive"
                  />
                </Carousel.Item>
              )
            })}
          </Carousel>
        </div>
        {/* post-text */}
        <div className={styles['post-text']}>
          {/* post-user */}
          <div className={styles['post-user']}>
            <Image
              className={styles['user-image']}
              // src={`/user/img/${authorAvatar}`}
              src={`http://localhost:3005/avatar/${authorAvatar}`}
              alt="User Image"
              width={40}
              height={40}
              priority
            />
            <div className={styles['user-name']}>{postAuthor}</div>
          </div>
          {/* mid-content */}
          <div className={styles['post-info-wrap']}>
            <div className={styles['post-info']}>
              <div className={`${styles['info-title']} h6`}>{title}</div>
              <div className={styles['info-content-wrap']}>
                <span className={styles['info-content']}>{content}</span>
                <span>
                  {tags &&
                    tags
                      .split(',')
                      .map((tag, index) => <span key={index}>#{tag}</span>)}
                </span>
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
                    onReplyClick={(text, user, commentId) =>
                      replyHandle(text, user, commentId)
                    }
                    comments={comment}
                    commentId={comment.comment_id}
                    commentAuthorId={comment.comment_author_id}
                    commentAuthor={comment.comment_author_nickname}
                    commentAuthorAvatar={comment.comment_author_img}
                    commentCreateTime={comment.created_at}
                    commentContent={comment.comment_content}
                    commentLikeCount={comment.comment_like_count}
                    commentReplyCount={comment.comment_reply_count}
                    commentReplyTarget={comment.reply_user_nickname}
                    commentDepth={comment.depth}
                    initialToggled={liked}
                    onToggle={likeToggle}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* bottom */}
          <form
            className={styles['post-comment']}
            onSubmit={(e) => {
              e.preventDefault()
              sendHandle(replyTargetId, replyId, inputValue)
            }}
          >
            <div className={styles['reply-user']}>
              <span> {replyTarget}</span>
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
                  <PostIcon
                    id={postId}
                    icon="like"
                    count={likeCount}
                    initialToggled={liked}
                    onToggle={likeToggle}
                  />
                  <PostIcon
                    id={postId}
                    icon="save"
                    count={saveCount}
                    initialToggled={saved}
                    onToggle={saveToggle}
                  />
                  <div onClick={() => setFocus(true)}>
                    <div>
                      <PiChatCircle />
                    </div>
                    <span>{commentCount}</span>
                  </div>
                  {/* <PostIcon id={postId} icon="comment" count={commentCount} /> */}
                </div>
              ) : (
                <div className={styles['btns']}>
                  <button className={`${styles['send']}`}>發送</button>
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
      {/* {showModal && (
        <ModalConfirm
          title="尚未登入會員"
          content={`是否前往登入?`}
          btnConfirm="前往登入"
          ConfirmFn={() => {
            router.push('/user/login/user')
          }}
          show={showModal}
          handleClose={() => setShowModal(false)}
        />
      )} */}
    </>
  )
}
