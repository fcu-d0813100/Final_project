import React, { useState, useEffect, use } from 'react'
import { useRouter } from 'next/router'
import { GoArrowLeft } from 'react-icons/go'
import Masonry from 'react-masonry-css'
import { usePost } from '@/hooks/post/use-post'
import PostCard from '@/components/post/common/post-card'
import WallCard from '@/components/post/common/wall-card'
import styles from './index.module.scss'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
export default function Explore(props) {
  const { post, forceUpdate } = usePost()
  const { auth } = useAuth()
  const userId = auth.userData.id
  const [wallCard, setWallCard] = useState([])
  const [comments, setComments] = useState(post?.comments || [])
  const [cancelHandle, setCancelHandle] = useState(() => () => {})
  const router = useRouter()
  const { postId } = router.query
  //render
  useEffect(() => {
    if (post && post.tags) {
      fetchPosts(post.tags)
    }
  }, [post])

  //get data : related posts //
  const fetchPosts = async (tags) => {
    const queryString = tags
      .split(',')
      .map((tag) => `tags=${encodeURIComponent(tag)}`)
      .join('&')
    const response = await fetch(
      `http://localhost:3005/api/post/?${queryString}&postId=${postId}&order=DESC`,
      {
        credentials: 'include',
      }
    )
    console.log(queryString)
    const data = await response.json()
    setWallCard(data)
  }
  useEffect(() => {
    if (post && post.comments) {
      setComments(post.comments)
    }
  }, [post])
  // 如果 post 尚未加載，顯示加載指示
  if (!post) {
    return <p></p>
  }
  // waterfall layout
  const breakpoint = {
    default: 5,
    1600: 4,
    1200: 3,
    700: 2,
  }
  //
  const sendHandle = async (replyId, inputValue) => {
    // verify form
    if (!inputValue) return

    // collect form
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('postId', postId)
    formData.append('content', inputValue)
    formData.append('replyId', replyId)
    // Submit form
    const response = await fetch(
      'http://localhost:3005/api/post/comment_create',
      {
        method: 'POST',
        body: formData,
        credentials: 'include',
      }
    )
    if (response.ok) {
      alert('提交成功')
      forceUpdate()
      cancelHandle()
    } else {
      alert('提交失敗，請再試一次！')
    }
  }

  return (
    <>
      <div className={styles['post-container']}>
        <div className={styles['post-read']}>
          <Link href="/post">
            <GoArrowLeft size={30} />
          </Link>
          <PostCard
            postAuthor={post.post_author_nickname}
            title={post.title}
            content={post.content}
            tags={post.tags}
            postImages={post.post_imgs}
            authorAvatar={post.post_author_img}
            postCreateTime={post.created_at}
            likeCount={post.like_count}
            saveCount={post.save_count}
            commentCount={post.comment_count} //
            comments={comments}
            sendHandle={sendHandle}
            setCancelHandle={setCancelHandle}
          />
          {/* {console.log(typeof post.post_imgs)} */}
        </div>
        <div className={`h5 ${styles['post-explore']}`}>探索更多</div>
        <div className={styles['post-wall']}>
          <Masonry
            breakpointCols={breakpoint}
            className={styles['my-masonry-grid']}
            columnClassName={styles['my-masonry-grid_column']}
          >
            {wallCard.map((post) => (
              <WallCard
                key={post.id}
                href={`/post/${post.id}`}
                imageSrc={`/post/${post.post_img}`}
                title={post.title}
                username={post.nickname}
                avatarSrc={`/user/img/${post.user_img}`}
                likeCount={post.like_count}
              />
            ))}
          </Masonry>
        </div>
      </div>
    </>
  )
}
