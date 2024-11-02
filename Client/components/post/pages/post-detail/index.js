import React, { useState, useEffect, use } from 'react'
import { useRouter } from 'next/router'
import { GoArrowLeft } from 'react-icons/go'
import Masonry from 'react-masonry-css'
import axios from 'axios'
import { usePost } from '@/hooks/post/use-post'
import PostCard from '@/components/post/common/post-card'
import WallCard from '@/components/post/common/wall-card'
import Header from '@/components/layout/common/header'
import styles from './index.module.scss'
import Link from 'next/link'

export default function Explore(props) {
  const [wallCard, setWallCard] = useState([])
  useEffect(() => {
    async function getWallCard() {
      let response = await axios.get(
        `http://localhost:3005/api/post/post_wall`,
        {
          withCredentials: true,
        }
      )
      setWallCard(response.data)
    }
    getWallCard()
  }, [])
  let { post } = usePost()
  // 如果 post 尚未加載，顯示加載指示
  if (!post) {
    return <p>Loading...</p>
  }
  const breakpoint = {
    default: 5,
    1600: 4,
    1200: 3,
    700: 2,
  }
  return (
    <>
      <Header />
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
            // authorAvatar={post.post_author_img}

            postCreateTime={post.created_at}
            likeCount={post.like_count}
            saveCount={post.save_count}
            commentCount={post.comment_count}
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
                avatarSrc={`/user/${post.user_img}`}
                likeCount={post.like_count}
              />
            ))}
          </Masonry>
        </div>
      </div>
    </>
  )
}
