import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PiNotePencilBold } from 'react-icons/pi'
import { PiMagnifyingGlass } from 'react-icons/pi'
import { useAuth } from '@/hooks/use-auth'
import ModalConfirm from '@/components/shared/modal-confirm'
import Masonry from 'react-masonry-css'
import WallCard from '@/components/post/common/wall-card'
import styles from './index.module.scss'
import InputIME from '@/components/shared/input-ime/index.js'
export default function PostWall(props) {
  const [wallCard, setWallCard] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('total_count')
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()
  const { auth } = useAuth()
  const userId = auth.userData.id
  // const { type, setType } = usePost()
  // const postId = wallCard?.id
  const tabChangeHandle = (tab) => {
    // setSort(tab)
    // setType(tab)
    router.push({
      pathname: '/post',
      query: { sort: tab },
    })
  }
  useEffect(() => {
    if (router.isReady) {
      const querySort = router.query.sort || 'total_count'
      setSort(querySort)
      return
    }
  }, [router.isReady, router.query.sort])

  // render
  useEffect(() => {
    if (sort) {
      fetchPosts()
    }
  }, [sort, search])

  // GET DATA : wall card
  const fetchPosts = async () => {
    const response = await fetch(
      `http://localhost:3005/api/post/?sort=${sort}&order=DESC&search=${search}`,
      {
        credentials: 'include',
      }
    )
    const data = await response.json()
    setWallCard(data)
    // console.log(data)
  }
  const createHandle = () => {
    if (userId == 0) {
      setShowModal(true)
    } else {
      router.push('/user/post/create')
    }
  }
  //masonry
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
            <button
              className={styles['post-add']}
              onClick={createHandle}
              // href={'/user/post/create'}
            >
              <PiNotePencilBold size={22} />
              <span>建立</span>
            </button>
            <div className={styles['post-search']}>
              <InputIME
                type="text"
                placeholder="任意關鍵字"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                // onKeyDown={keyDownHandle}
                className={styles['post-search-input']}
              />
              <PiMagnifyingGlass size={22} />
            </div>
          </div>
          <div className={styles['post-filter']}>
            <button
              onClick={() => tabChangeHandle('total_count')}
              className={sort === 'total_count' ? styles['active'] : ''}
            >
              熱門
            </button>
            <div className={styles['filter-line']}></div>
            <button
              onClick={() => tabChangeHandle('created_at')}
              className={sort === 'created_at' ? styles['active'] : ''}
            >
              最新
            </button>
          </div>
        </div>
        {/* <div className={styles['post-wall']}> */}
        <div
          className={
            wallCard.length > 5
              ? styles['post-wall']
              : styles['post-wall-small']
          }
        >
          <Link className={styles['post-add']} href={'/user/post/create'}>
            <PiNotePencilBold size={35} />
          </Link>
          <Masonry
            breakpointCols={breakpoint}
            className={styles['my-masonry-grid']}
            columnClassName={styles['my-masonry-grid_column']}
          >
            {wallCard.map((post) => {
              const imgSrc = `http://localhost:3005/post/${post.post_img}`
              return (
                <WallCard
                  postId={post.id}
                  key={post.id}
                  href={`/post/${post.id}`}
                  imageSrc={imgSrc}
                  title={post.title}
                  username={post.nickname}
                  // avatarSrc={`/user/img/${post.user_img}`}
                  // likeCount={post.like_count}
                />
              )
            })}
          </Masonry>
        </div>
      </section>
      {showModal && (
        <ModalConfirm
          title="尚未登入會員"
          content={`是否前往登入?`}
          btnConfirm="前往登入"
          ConfirmFn={() => {
            router.push('/user/login')
          }}
          show={showModal}
          handleClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
