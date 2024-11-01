import React, { useState, useEffect, use } from 'react'
import { useRouter } from 'next/router'
import { GoArrowLeft } from 'react-icons/go'
import axios from 'axios'
import { usePost } from '@/hooks/post/use-post'
import PostCard from '@/components/post/common/post-card'
import WallCard from '@/components/post/common/wall-card'
import Header from '@/components/home/common/header'
import styles from './index.module.scss'
import Link from 'next/link'

export default function Explore(props) {
  let { post } = usePost()
  // 如果 post 尚未加載，顯示加載指示
  if (!post) {
    return <p>Loading...</p>
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
          <WallCard
            imageSrc="/post/p2_1.webp"
            title="新的遮瑕膏測評! 遮瑕力超強"
            username="Anna"
            avatarSrc="/post/user-img.png"
            likeCount={15}
          />
          <WallCard
            imageSrc="/post/p2_1.webp"
            title="新的遮瑕膏測評! 遮瑕力超強"
            username="Anna"
            avatarSrc="/post/user-img.png"
            likeCount={15}
          />
        </div>
      </div>
    </>
  )
}
