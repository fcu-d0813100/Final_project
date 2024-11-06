import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { PiNotePencilBold } from 'react-icons/pi'
import { PiMagnifyingGlass } from 'react-icons/pi'
import Masonry from 'react-masonry-css'
import WallCard from '@/components/post/common/wall-card'
// import axios from 'axios'
import styles from './index.module.scss'
export default function PostWall(props) {
  const [wallCard, setWallCard] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('total_count')

  //render
  useEffect(() => {
    fetchPosts()
  }, [sort, search])

  //get data
  const fetchPosts = async () => {
    const response = await fetch(
      `http://localhost:3005/api/post/?sort=${sort}&order=DESC&search=${search}`,
      {
        credentials: 'include',
      }
    )
    const data = await response.json()
    setWallCard(data)
  }

  // const searchHandle = async () => {
  //   let response = await fetch()
  // }
  // const keyDownHandle = (e) => {
  //   if (e.key === 'Enter') {
  //     searchHandle()
  //   }
  // }
  const breakpoint = {
    default: 5,
    1600: 4,
    1200: 3,
    700: 2,
  }
  return (
    <>
      <div className={styles['post-banner']}>
        <div className={styles['post-banner-text']}>
          <span>— Share & Save —</span>
          <span>Share Your Insights & Save for Later</span>
        </div>
      </div>
      <section className={styles['post-section']}>
        <div className={styles['post-navbar']}>
          <div className={styles['post-nav']}>
            <Link className={styles['post-add']} href={'/user/post/create'}>
              <PiNotePencilBold size={22} />
              <span>建立</span>
            </Link>
            <div className={styles['post-search']}>
              <input
                type="text"
                placeholder="任意關鍵字｜"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                // onKeyDown={keyDownHandle}
              />
              <PiMagnifyingGlass size={22} />
            </div>
          </div>
          <div className={styles['post-filter']}>
            <button
              onClick={() => setSort('total_count')}
              className={sort === 'total_count' ? styles['active'] : ''}
            >
              熱門
            </button>
            <div className={styles['filter-line']}></div>
            <button
              onClick={() => setSort('created_at')}
              className={sort === 'created_at' ? styles['active'] : ''}
            >
              最新
            </button>
          </div>
        </div>
        <div className={styles['post-wall']}>
          <Masonry
            breakpointCols={breakpoint}
            className={styles['my-masonry-grid']}
            columnClassName={styles['my-masonry-grid_column']}
          >
            {wallCard.map((post) => (
              <WallCard
                postId={post.id}
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
      </section>
    </>
  )
}
