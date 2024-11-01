import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { PiNotePencilBold } from 'react-icons/pi'
import { PiMagnifyingGlass } from 'react-icons/pi'
import Masonry from 'react-masonry-css'
import Header from '@/components/home/common/header'
import WallCard from '@/components/post/common/wall-card'
import axios from 'axios'
import styles from './index.module.scss'
export default function PostWall(props) {
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
  const breakpoint = {
    default: 5,
    1600: 4,
    1200: 3,
    700: 2,
  }
  return (
    <>
      <Header />
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
              <input type="text" placeholder="任意關鍵字｜" />
              <PiMagnifyingGlass size={22} />
            </div>
          </div>
          <div className={styles['post-filter']}>
            <button>熱門</button>
            <div className={styles['filter-line']}></div>
            <button>最新</button>
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
                key={post.id}
                imageSrc={`/post/${post.post_img}`}
                title={post.title}
                username={post.nickname}
                avatarSrc={`/user/${post.user_img}` || '/post/user-img.png'}
                likeCount={post.like_count}
              />
            ))}
          </Masonry>
        </div>
      </section>
    </>
  )
}
